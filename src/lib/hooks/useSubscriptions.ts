import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Subscription } from '@/types/subscription';

export const useSubscriptions = (userId: string | undefined) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (!userId) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const subscriptionsRef = collection(db, 'subscriptions');
    const q = query(
      subscriptionsRef,
      where('userId', '==', userId),
      orderBy('nextPaymentDate', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const subscriptionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          nextPaymentDate: doc.data().nextPaymentDate?.toDate() || null,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Subscription[];

        setSubscriptions(subscriptionsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading subscriptions:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { subscriptions, loading, error };
};