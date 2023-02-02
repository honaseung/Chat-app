import { IdTokenResult, User } from "firebase/auth";

/**
 * 사용자 타입
 */
export interface Iuser extends User {
  email: string;
  phoneNumber: string;
  userName?: string;
  userId?: string;
  password?: string;
  online?: boolean;
}

/**
 * 사용자 기본값
 */
export const defaultUser: Iuser = {
  email: "",
  phoneNumber: "",
  userName: "",
  userId: "",
  password: "",
  emailVerified: false,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: "",
  tenantId: "",
  delete: null,
  getIdToken: null,
  getIdTokenResult: null,
  reload: null,
  toJSON: null,
  displayName: "",
  photoURL: "",
  providerId: "",
  uid: "",
};
