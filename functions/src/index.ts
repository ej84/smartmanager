import {onRequest, HttpsError} from 'firebase-functions/v2/https';
import {onSchedule} from 'firebase-functions/v2/scheduler';
import {onCall} from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import {Resend} from 'resend';

// Firebase Admin initialization
admin.initializeApp();

const db = admin.firestore();

// Get API key from environment (set via firebase functions:config:set)
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const APP_URL = process.env.APP_URL || 'https://smartmanager-two.vercel.app/';

// Test function (Hello World) - US East 1 region
export const helloWorld = onRequest(
  {region: 'us-east1', invoker: 'public'},
  (request, response) => {
    response.send('Hello from Firebase Functions in US East!');
  }
);

// Daily payment notification check - 9 AM Eastern Time
export const checkUpcomingPayments = onSchedule(
  {
    schedule: '0 9 * * *',
    timeZone: 'America/New_York',
    region: 'us-east1',
  },
  async (event) => {
    console.log('Payment notification check started - US Eastern Time');
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return;
    }
    
    const resend = new Resend(RESEND_API_KEY);

    try {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // Query subscriptions with payments due within 7 days
      const subscriptionsSnapshot = await db
        .collection('subscriptions')
        .where('isActive', '==', true)
        .where(
          'nextPaymentDate',
          '<=',
          admin.firestore.Timestamp.fromDate(sevenDaysLater)
        )
        .where(
          'nextPaymentDate',
          '>=',
          admin.firestore.Timestamp.fromDate(now)
        )
        .get();

      console.log(`Found ${subscriptionsSnapshot.size} upcoming payments`);

      // Group subscriptions by user
      const userPayments: {[userId: string]: any[]} = {};

      for (const doc of subscriptionsSnapshot.docs) {
        const subscription = doc.data();
        const userId = subscription.userId;

        if (!userPayments[userId]) {
          userPayments[userId] = [];
        }

        userPayments[userId].push({
          id: doc.id,
          ...subscription,
        });
      }

      // Send email to each user
      for (const [userId, payments] of Object.entries(userPayments)) {
        try {
          const userDoc = await db.collection('users').doc(userId).get();

          if (!userDoc.exists) {
            console.log(`User ${userId} not found`);
            continue;
          }

          const user = userDoc.data();

          if (!user?.settings?.emailNotifications) {
            console.log(`User ${userId} has email notifications disabled`);
            continue;
          }

          // Format payment information
          const paymentInfos = payments.map((payment) => {
            const paymentDate = payment.nextPaymentDate.toDate();
            const daysUntil = Math.floor(
              (paymentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            return {
              serviceName: payment.name,
              cost: formatCurrency(payment.cost, payment.currency),
              paymentDate: formatDate(paymentDate),
              daysUntil,
            };
          });

          // Generate email HTML
          const emailHtml = getMultiplePaymentsEmail(
            user.name || 'User',
            paymentInfos,
            APP_URL
          );

          // Send email
          await resend.emails.send({
            from: 'SmartManager <onboarding@resend.dev>',
            to: [user.email],
            subject: `[SmartManager] ${payments.length} payment(s) scheduled this week`,
            html: emailHtml,
          });

          console.log(`Email sent to user ${user.email}`);

          // Log notification
          await db.collection('notifications').add({
            userId,
            type: 'upcoming_payments',
            subscriptionCount: payments.length,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'sent',
          });
        } catch (error) {
          console.error(`Failed to send email to user ${userId}:`, error);
        }
      }

      console.log('Payment notification check completed');
    } catch (error) {
      console.error('Error during payment notification check:', error);
      throw error;
    }
  }
);

// Manual payment reminder function - US East 1 region
export const sendPaymentReminder = onCall(
  {region: 'us-east1', invoker: "public"},
  async (request) => {
    if (!RESEND_API_KEY) {
      throw new HttpsError('failed-precondition', 'Email service is not configured');
    }
    
    const resend = new Resend(RESEND_API_KEY);
    
    // Authentication check
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required');
    }

    const {subscriptionId} = request.data;

    if (!subscriptionId) {
      throw new HttpsError('invalid-argument', 'Subscription ID is required');
    }

    try {
      // Get subscription information
      const subscriptionDoc = await db
        .collection('subscriptions')
        .doc(subscriptionId)
        .get();

      if (!subscriptionDoc.exists) {
        throw new HttpsError('not-found', 'Subscription not found');
      }

      const subscription = subscriptionDoc.data();

      // Check permissions
      if (subscription?.userId !== request.auth.uid) {
        throw new HttpsError('permission-denied', 'Permission denied');
      }

      // Get user information
      const userDoc = await db.collection('users').doc(request.auth.uid).get();
      const user = userDoc.data();

      if (!user) {
        throw new HttpsError('not-found', 'User not found');
      }

      // Calculate payment date
      const paymentDate = subscription.nextPaymentDate.toDate();
      const now = new Date();
      const daysUntil = Math.floor(
        (paymentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Send email
      const emailHtml = getPaymentReminderEmail(
        user.name,
        subscription.name,
        formatCurrency(subscription.cost, subscription.currency),
        formatDate(paymentDate),
        daysUntil,
        APP_URL
      );

      await resend.emails.send({
        from: 'SmartManager <onboarding@resend.dev>',
        to: [user.email],
        subject: `[SmartManager] ${subscription.name} payment in ${daysUntil} day(s)`,
        html: emailHtml,
      });

      return {success: true, message: 'Notification sent successfully'};
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw new HttpsError('internal', 'Failed to send notification');
    }
  }
);

// Utility functions
function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York',
  });
}

function getPaymentReminderEmail(
  name: string,
  serviceName: string,
  cost: string,
  paymentDate: string,
  daysUntil: number,
  dashboardUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Reminder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">SmartManager</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Hello, ${name}! 👋</h2>
                    <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                      You have an upcoming payment.
                    </p>
                    <div style="background-color: ${daysUntil <= 3 ? '#fef2f2' : '#fef9c3'}; border-left: 4px solid ${daysUntil <= 3 ? '#ef4444' : '#f59e0b'}; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                      <h3 style="margin: 0 0 15px 0; color: ${daysUntil <= 3 ? '#991b1b' : '#92400e'}; font-size: 18px; font-weight: 600;">
                        ⏰ Payment due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}
                      </h3>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; color: #4b5563; font-size: 14px;"><strong>Service:</strong></td>
                          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">${serviceName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #4b5563; font-size: 14px;"><strong>Amount:</strong></td>
                          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right; font-weight: 600;">${cost}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #4b5563; font-size: 14px;"><strong>Date:</strong></td>
                          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">${paymentDate}</td>
                        </tr>
                      </table>
                    </div>
                    <div style="text-align: center;">
                      <a href="${dashboardUrl}/dashboard" 
                         style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                        View Dashboard
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 30px; border-radius: 0 0 12px 12px;">
                    <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                      This email was sent automatically by SmartManager.<br>
                      You can change notification settings in your account.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function getMultiplePaymentsEmail(
  name: string,
  payments: Array<{
    serviceName: string;
    cost: string;
    paymentDate: string;
    daysUntil: number;
  }>,
  dashboardUrl: string
): string {
  const paymentRows = payments
    .map(
      (p) => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
        <strong style="color: #1f2937; font-size: 15px;">${p.serviceName}</strong>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        <span style="color: #1f2937; font-size: 15px; font-weight: 600;">${p.cost}</span>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        <span style="color: ${p.daysUntil <= 3 ? '#ef4444' : '#f59e0b'}; font-size: 14px; font-weight: 600; background-color: ${p.daysUntil <= 3 ? '#fef2f2' : '#fef9c3'}; padding: 4px 8px; border-radius: 4px;">
          ${p.daysUntil} day${p.daysUntil !== 1 ? 's' : ''}
        </span>
      </td>
    </tr>
  `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Upcoming Payments Summary</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">SmartManager</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Hello, ${name}! 👋</h2>
                    <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                      You have <strong>${payments.length}</strong> payment${payments.length !== 1 ? 's' : ''} scheduled this week.
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                      <thead>
                        <tr style="background-color: #f9fafb;">
                          <th style="padding: 15px; text-align: left; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Service</th>
                          <th style="padding: 15px; text-align: right; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Amount</th>
                          <th style="padding: 15px; text-align: right; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Due In</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${paymentRows}
                      </tbody>
                    </table>
                    <div style="text-align: center; margin-top: 30px;">
                      <a href="${dashboardUrl}/dashboard" 
                         style="display: inline-block; background-color: #0ea5e9; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                        View Dashboard
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 30px; border-radius: 0 0 12px 12px;">
                    <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                      This email was sent automatically by SmartManager.<br>
                      You can change notification settings in your account.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}