import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName } = await request.json();
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured' },
        { status: 500 }
      );
    }
    
    // Send test email
    const { data, error } = await resend.emails.send({
      from: 'SubManager <onboarding@resend.dev>', // Resend의 테스트 도메인
      to: [userEmail],
      subject: '[SubManager] Test Email - Email System Working! ✅',
      html: getTestEmailHtml(userName),
    });
    
    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send email' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailId: data?.id,
    });
    
  } catch (error: unknown) {
    console.error('Test email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getTestEmailHtml(userName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Test Email</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <tr>
                  <td style="background: linear-gradient(135deg, #0ea5e9 0%, #a855f7 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">SubManager</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 24px; font-weight: 600;">Hello, ${userName}! 👋</h2>
                    <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px; line-height: 1.6;">
                      This is a <strong>test email</strong> from your SubManager application!
                    </p>
                    
                    <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                      <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 18px; font-weight: 600;">
                        ✅ Email System Working!
                      </h3>
                      <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                        Your email notification system is configured correctly and working as expected.
                        You will receive automatic payment reminders for your subscriptions.
                      </p>
                    </div>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                      <h4 style="margin: 0 0 10px 0; color: #374151; font-size: 16px; font-weight: 600;">Test Details:</h4>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Sent to:</td>
                          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right; font-weight: 500;">${userName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Service:</td>
                          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right; font-weight: 500;">Resend Email API</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Timestamp:</td>
                          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right; font-weight: 500;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      <strong>What's next?</strong><br>
                      • Add your subscriptions to track payment dates<br>
                      • Receive automatic reminders 7, 3, and 1 day before payments<br>
                      • Manage all your subscriptions in one place
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 30px; border-radius: 0 0 12px 12px;">
                    <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                      This is a test email sent from SubManager<br>
                      &copy; 2025 SubManager. All rights reserved.
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