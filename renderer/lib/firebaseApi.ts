//@ts-check

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
  onChildChanged,
  off,
  DataSnapshot,
} from "firebase/database";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  browserSessionPersistence,
  IdTokenResult,
  onIdTokenChanged,
  Persistence,
} from "firebase/auth";
import admin, {
  auth,
  firestore,
  database,
  realtimeDatabase,
  cmmAuth,
} from "../../firebase-config";

import { useCreateWhere, useRealtimeDatabaseCreateWhere } from "./create-query";
import { replaceAllSpecialChar } from "./utils";
import { Irequest } from "../type/firebaseApi";
import { Iuser, defaultUser } from "../type/user";
import { User } from "firebase/auth";
import { Iroom } from "../type/room";

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 등록 함수
 */
export function getUser() {
  // auth.verifyIdToken()
  const user = cmmAuth.currentUser;
  if (user) return user;
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 등록 함수
 */
export async function listUsers(
  sucCallback?: Function,
  failCallback?: Function
) {
  await auth
    .listUsers()
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

export async function getOnlineUsers(
  sucCallback?: Function,
  failCallback?: Function
) {
  await get(ref(realtimeDatabase, `onlineUser`))
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
  const { userParam } = request || { defaultUser };
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
  const { userParam } = request || { defaultUser };
  await signInWithEmailAndPassword(
    cmmAuth,
    userParam?.email || "",
    userParam?.password || ""
  )
    .then(async (response) => {
      if (sucCallback) {
        await onlineUser(response.user.uid, null, failCallback);
        await response.user
          .getIdTokenResult()
          .then((token: IdTokenResult) => {
            sucCallback(new Date(token.expirationTime).toLocaleTimeString());
          })
          .catch((error) => {
            if (failCallback) failCallback(error);
          });
      }
    })
    .then(() => {
      cmmAuth.setPersistence(browserSessionPersistence);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

// /**
//  * @param request 인풋값을 담은 객체
//  * @param sucCallback 성공콜백함수
//  * @param failCallback 실패콜백함수
//  * @description realtime Database 저장 함수
//  */
// export async function getUserToken(
//   sucCallback: Function,
//   failCallback: Function
// ) {
//   ref(realtimeDatabase, "onlineUser");
//   await cmmAuth.currentUser
//     .getIdTokenResult()
//     .then((value: IdTokenResult) => {
//       if (sucCallback) sucCallback(value.token);
//     })
//     .catch((error) => {
//       if (failCallback) failCallback(error);
//     });
// }

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 로그인 함수
 */
async function onlineUser(
  uid: string,
  sucCallback?: Function,
  failCallback?: Function
) {
  await set(ref(realtimeDatabase, `onlineUser/${uid}`), true)
    .then(() => {
      if (sucCallback) sucCallback();
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
  // await (child(ref(realtimeDatabase), "collectionType"), sucCallback);
}

/**
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 로그 아웃 함수
 */
export async function logoutUser(
  sucCallback?: Function,
  failCallback?: Function
) {
  realtimeInviteListenOff();
  await offlineUser(cmmAuth.currentUser.uid, null, failCallback);
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
async function offlineUser(
  uid: string,
  sucCallback?: Function,
  failCallback?: Function
) {
  await set(ref(realtimeDatabase, `onlineUser/${uid}`), false)
    .then(() => {
      if (sucCallback) sucCallback();
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
  // await (child(ref(realtimeDatabase), "collectionType"), sucCallback);
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 저장 함수
 */
export async function realtimeInviteRoom(
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
  await realtimeNoticeInvite(roomParam, sucCallback);
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 저장 함수
 */
export async function realtimeNoticeInvite(
  roomParam: Iroom,
  sucCallback?: Function,
  failCallback?: Function
) {
  const memberIds = roomParam.members.map((member) => member.userId).join();
  await set(ref(realtimeDatabase, `notice/chat/${roomParam.created}`), {
    roomKey: roomParam.created,
    title: roomParam.title,
    memberIds,
  })
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
export async function realtimeSendMessage(
  request: any,
  sucCallback: Function,
  failCallback: Function
) {
  const { collectionType, messages } = request;
  await set(ref(realtimeDatabase, collectionType), messages)
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
export async function realtimeGetRooms(
  request: any,
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
 */
export async function realtimeExitRoomDocs(
  request: Irequest,
  sucCallback: Function,
  failCallback: Function
) {
  const { collectionType = "", roomParam } = request;
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
export function realtimeInviteListenOn(
  sucCallback: (snapshot: DataSnapshot, previousChildName?: string) => unknown
) {
  onChildAdded(child(ref(realtimeDatabase), `notice/chat`), sucCallback);
  // onChildRemoved(child(ref(realtimeDatabase), "chat"), (snapshot: DataSnapshot) => console.log('snapshot', snapshot));
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export function realtimeInviteListenOff() {
  off(child(ref(realtimeDatabase), `notice/chat`), "child_added");
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export function realtimeRoomListenOn(
  sucCallback: (snapshot: DataSnapshot, previousChildName?: string) => unknown
) {
  onChildAdded(child(ref(realtimeDatabase), `chat/`), sucCallback);
  // onChildRemoved(child(ref(realtimeDatabase), "chat"), (snapshot: DataSnapshot) => console.log('snapshot', snapshot));
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export function realtimeRoomListenOff() {
  off(child(ref(realtimeDatabase), "chat/"), "child_added");
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export function realtimeChatListenOn(
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
export function realtimeChatListenOff(request: Irequest) {
  const { collectionType = "" } = request;
  off(child(ref(realtimeDatabase), collectionType), "child_added");
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export function realtimeOnlineUserListenOn(sucCallback: () => void) {
  onChildAdded(child(ref(realtimeDatabase), "onlineUser"), sucCallback);
  onChildRemoved(child(ref(realtimeDatabase), "onlineUser"), sucCallback);
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export function realtimeOnlineUserListenOff() {
  off(child(ref(realtimeDatabase), "onlineUser"), "child_changed");
  off(child(ref(realtimeDatabase), "onlineUser"), "child_removed");
}
