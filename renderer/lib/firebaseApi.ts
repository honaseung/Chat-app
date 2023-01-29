//@ts-nocheck

import {
  collection,
  query as firesotreQ,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {
  ref,
  child,
  get,
  set,
  remove,
  query,
  onChildAdded,
  onChildRemoved,
  off,
} from "firebase/database";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  auth,
  firestore,
  realtimeDatabase,
  cmmAuth,
} from "../../firebase-config";

import { useCreateWhere, useRealtimeDatabaseCreateWhere } from "./create-query";
import { replaceAllSpecialChar } from "./utils";
import { Irequest } from "../type/firebaseApi";
import { Iuser, defaultUser } from "../type/user";
import { User } from "firebase/auth";

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 등록 함수
 */
export function getUser() {
  const user = cmmAuth.currentUser;
  if (user !== null) {
    return user;
  }
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 등록 함수
 */
export async function listUsers(sucCallback: Function, failCallback: Function) {
  await auth
    .listUsers()
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 등록 함수
 */
export async function registUser(
  request: Irequest,
  sucCallback: Function,
  failCallback: Function
) {
  const { userParam } = request || defaultUser;
  await auth
    .createUser({
      email: userParam?.email,
      emailVerified: false,
      phoneNumber: userParam?.phoneNumber,
      password: userParam?.password,
      displayName: userParam?.displayName,
      // photoURL: userParam?.photoURL,
      disabled: false,
    })
    .then((response) => {
      if (sucCallback) {
        sucCallback(response);
      }
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 로그인 함수
 */
export async function loginUser(
  request: Irequest,
  sucCallback: Function,
  failCallback: Function
) {
  const { userParam } = request || defaultUser;
  await signInWithEmailAndPassword(
    cmmAuth,
    userParam?.id || "",
    userParam?.password || ""
  )
    .then((response) => {
      if (sucCallback) {
        // if (cmmAuth) onlineUser(cmmAuth.currentUser);
        sucCallback(response);
      }
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 로그인 함수
 */
async function onlineUser(user: User | null) {
  await set(ref(realtimeDatabase, `online/${user?.phoneNumber}`), user?.email);
  // await (child(ref(realtimeDatabase), "collectionType"), sucCallback);
}

/**
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 로그 아웃 함수
 */
export async function logoutUser(
  sucCallback: Function,
  failCallback: Function
) {
  // offlineUser(cmmAuth.currentUser);
  signOut(cmmAuth)
    .then((response) => {
      if (sucCallback) {
        sucCallback(response);
      }
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 로그인 함수
 */
async function offlineUser(user: Iuser | null) {
  await set(ref(realtimeDatabase, `online/${user?.phoneNumber}`), null);
  // await (child(ref(realtimeDatabase), "collectionType"), sucCallback);
}

/**
 * @deprecated
 * @description firestore 에 저장 함수
 */
export async function commonAddDoc(
  request: Irequest,
  sucCallback: Function,
  failCallback: Function
) {
  const { collectionType, inputParams } = request;
  await addDoc(collection(firestore, collectionType), inputParams)
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @deprecated
 * @description  firestore 에 읽기 함수
 */
export async function commonGetDocs(
  request: Irequest,
  sucCallback: Function,
  failCallback: Function
) {
  const { collectionType, condition = [] } = request;
  let q = null;
  if (condition.length > 0) {
    const queryConstraints = useCreateWhere(condition);
    q = firesotreQ(collection(firestore, collectionType), ...queryConstraints);
  } else {
    q = collection(firestore, collectionType);
  }
  await getDocs(q)
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 저장 함수
 */
export async function realtimeAddDoc(
  request: Irequest,
  sucCallback: Function,
  failCallback: Function
) {
  const { collectionType, roomParam } = request;
  await set(ref(realtimeDatabase, collectionType), roomParam)
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export async function realtimeGetDocs(
  request: Irequest,
  sucCallback: Function,
  failCallback: Function
) {
  const { collectionType = "", condition = [] } = request;
  let q = null;
  if (condition.length > 0) {
    const queryConstraints = useRealtimeDatabaseCreateWhere(condition);
    q = query(ref(realtimeDatabase), ...queryConstraints);
  } else {
    q = child(ref(realtimeDatabase), collectionType);
  }
  await get(q)
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 * @deprecated
 */
export async function realtimeGetRoomDocs(
  sucCallback: Function,
  failCallback: Function
) {
  const userInfo = cmmAuth.currentUser;
  const queryConstraints = useRealtimeDatabaseCreateWhere([
    replaceAllSpecialChar(userInfo?.email || "", "_"),
    "chat",
  ]);
  const q = query(ref(realtimeDatabase), ...queryConstraints);
  await get(q)
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export async function realtimeExitRoomDocs(
  request: Irequest,
  sucCallback: Function
) {
  const { collectionType = "", roomParam } = request;
  const newCollectionType = collectionType?.replace(
    `-${roomParam?.changedId || ""}`,
    ""
  );
  await get(child(ref(realtimeDatabase), collectionType)).then((data) => {
    remove(child(ref(realtimeDatabase), collectionType)).then(() => {
      realtimeAddDoc(
        { collectionType: newCollectionType, roomParam: data.val() },
        sucCallback
      );
    });
  });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export async function realtimeChatListenOn(
  request: Irequest,
  sucCallback: () => void
) {
  const { collectionType = "" } = request;
  onChildAdded(child(ref(realtimeDatabase), collectionType), sucCallback);
  // onChildRemoved(child(ref(realtimeDatabase), "chat"), (snapshot: DataSnapshot) => console.log('snapshot', snapshot));
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export async function realtimeChatListenOff(request: Irequest) {
  const { collectionType = "" } = request;
  await off(child(ref(realtimeDatabase), collectionType), "child_added");
}
