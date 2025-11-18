import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { DEFAULT_USER_SETTINGS } from '@/types/user';

// Google 로그인
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  
  try {
    const result = await signInWithPopup(auth, provider);
    await createUserDocument(result.user);
    return result.user;
  } catch (error: unknown) {
    console.error("Login failed: ", error);
    throw new Error("Login failed.");
  }
};

// 이메일/비밀번호 회원가입
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // 프로필 업데이트
    await updateProfile(result.user, { displayName });
    
    // Firestore에 사용자 문서 생성
    await createUserDocument(result.user);
    
    return result.user;
  } catch (error: unknown) {
    console.error("SignUp failed: ", error);
    throw new Error("SignUp failed.");
  }
};

// 이메일/비밀번호 로그인
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: unknown) {
    console.error("Login failed: ", error);
    throw new Error("Login failed.");
  }
};

// 로그아웃
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: unknown) {
    console.error("Logout failed: ", error);
    throw new Error("Logout failed.");
  }
};

// 비밀번호 재설정 이메일 발송
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    console.error("Failed to send reset password email: ", error);
    throw new Error("Failed to send reset password email.");
  }
};

// Firestore에 사용자 문서 생성
const createUserDocument = async (user: FirebaseUser) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  // 이미 문서가 존재하면 생성하지 않음
  if (userSnap.exists()) return;
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'User',
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
    settings: DEFAULT_USER_SETTINGS,
  };
  
  await setDoc(userRef, userData);
};