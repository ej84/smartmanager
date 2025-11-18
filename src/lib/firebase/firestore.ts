import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Subscription, SubscriptionFormData } from '@/types/subscription';

// 구독 컬렉션 참조
const subscriptionsRef = collection(db, 'subscriptions');

// 구독 추가
export const createSubscription = async (
  userId: string,
  data: SubscriptionFormData
): Promise<string> => {
  try {
    const subscriptionData = {
      userId,
      ...data,
      nextPaymentDate: Timestamp.fromDate(new Date(data.nextPaymentDate)),
      isActive: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(subscriptionsRef, subscriptionData);
    return docRef.id;
  } catch (error: unknown) {
    console.error("Failed to add a subscription: ", error);
    throw new Error("Failed to add a subscription.");
  }
};

// 구독 수정
export const updateSubscription = async (
  subscriptionId: string,
  data: Partial<SubscriptionFormData>
): Promise<void> => {
  try {
    const subscriptionDoc = doc(db, 'subscriptions', subscriptionId);
    
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    
    // nextPaymentDate가 있으면 Timestamp로 변환
    if (data.nextPaymentDate) {
      updateData.nextPaymentDate = Timestamp.fromDate(new Date(data.nextPaymentDate));
    }
    
    await updateDoc(subscriptionDoc, updateData);
  } catch (error: unknown) {
    console.error("Failed to update subscription: ", error);
    throw new Error("Failed to update subscription.");
  }
};

// 구독 삭제
export const deleteSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    const subscriptionDoc = doc(db, 'subscriptions', subscriptionId);
    await deleteDoc(subscriptionDoc);
  } catch (error: unknown) {
    console.error("Failed to delete subscription: ", error);
    throw new Error("Failed to delete subscription.");
  }
};

// 구독 단건 조회
export const getSubscription = async (subscriptionId: string): Promise<Subscription | null> => {
  try {
    const subscriptionDoc = doc(db, 'subscriptions', subscriptionId);
    const snapshot = await getDoc(subscriptionDoc);
    
    if (!snapshot.exists()) return null;
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      nextPaymentDate: snapshot.data().nextPaymentDate.toDate(),
      createdAt: snapshot.data().createdAt.toDate(),
      updatedAt: snapshot.data().updatedAt.toDate(),
    } as Subscription;
  } catch (error: unknown) {
    console.error("Failed to view subscription: ", error);
    throw new Error("Failed to view subscription.");
  }
};

// 사용자의 모든 구독 조회
export const getUserSubscriptions = async (userId: string): Promise<Subscription[]> => {
  try {
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      orderBy('nextPaymentDate', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      nextPaymentDate: doc.data().nextPaymentDate.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Subscription[];
  } catch (error: unknown) {
    console.error("Failed to view subscription list: ", error);
    throw new Error("Failed to view subscription list.");
  }
};

// 활성 구독만 조회
export const getActiveSubscriptions = async (userId: string): Promise<Subscription[]> => {
  try {
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('nextPaymentDate', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      nextPaymentDate: doc.data().nextPaymentDate.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Subscription[];
  } catch (error: unknown) {
    console.error("Failed to view active subscriptons: ", error);
    throw new Error("Failed to view active subscriptons.");
  }
};

// 구독 활성/비활성 토글
export const toggleSubscriptionStatus = async (
  subscriptionId: string,
  isActive: boolean
): Promise<void> => {
  try {
    const subscriptionDoc = doc(db, 'subscriptions', subscriptionId);
    await updateDoc(subscriptionDoc, {
      isActive,
      updatedAt: serverTimestamp(),
    });
  } catch (error: unknown) {
    console.error("Failed to toggle subscription status(active or inactive): ", error);
    throw new Error("Failed to toggle subscription status(active or inactive).");
  }
};