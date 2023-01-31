//@ts-check
import {
  ref,
  child,
  get,
  set,
  onChildAdded,
  onChildRemoved,
  off,
  DataSnapshot,
} from "firebase/database";
import {
  signInWithEmailAndPassword,
  signOut,
  browserSessionPersistence,
  IdTokenResult,
} from "firebase/auth";
import { auth, realtimeDatabase, cmmAuth } from "../../firebase-config";

import { Irequest } from "../type/firebaseApi";
import { Iroom } from "../type/room";
import { defaultUser } from "../type/user";

/**
 * @param failCallback 실패콜백함수
 * @description 사용자 정보 가져오기 함수
 */
export function getUser(failCallback?: Function) {
  // auth.verifyIdToken()
  const user = cmmAuth.currentUser;
  if (user) return user;
  else {
    if (failCallback) failCallback();
  }
}

/**
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 목록 가져오기 함수
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

/**
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 로그인중인 유저 가져오기
 * @deprecated
 */
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
 * @param request 유저 정보를 담은 객체
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
 * @param request 유저 정보를 담은 객체
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
 * @param uid 유저 uid
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 로그인 상태 기록 함수
 * @deprecated
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
 * @param uid 사용자 uid
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 로그인 상태 제거 함수
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
 * @param request 방 정보를 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 방 초대 함수
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
 * @param request 방 정보 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 방 초대를 정보 기록 함수
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
 * @param request 메세지 정보를 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 메세지 정보 기록 함수
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
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 방 목록 가져오기 함수
 */
export async function realtimeGetRooms(
  sucCallback: Function,
  failCallback: Function
) {
  await get(child(ref(realtimeDatabase), "chat"))
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 방 정보 가져오기 함수
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export async function realtimeGetRoom(
  request: Irequest,
  sucCallback: Function,
  failCallback: Function
) {
  const { collectionType } = request;
  await get(child(ref(realtimeDatabase), collectionType))
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @param request 방 정보를 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 방에서 나가기 함수
 */
export async function realtimeExitRoom(
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
 * @param sucCallback 성공콜백함수
 * @description 방 초대 듣기 함수
 */
export function realtimeInviteListenOn(
  sucCallback: (snapshot: DataSnapshot, previousChildName?: string) => unknown
) {
  onChildAdded(child(ref(realtimeDatabase), `notice/chat`), sucCallback);
  // onChildRemoved(child(ref(realtimeDatabase), "chat"), (snapshot: DataSnapshot) => console.log('snapshot', snapshot));
}

/**
 * @description 방 초대 듣기 종료 함수
 */
export function realtimeInviteListenOff() {
  off(child(ref(realtimeDatabase), `notice/chat`), "child_added");
}

/**
 * @param sucCallback 성공콜백함수
 * @description 방 생성 듣기 함수
 */
export function realtimeRoomListenOn(
  sucCallback: (snapshot: DataSnapshot, previousChildName?: string) => unknown
) {
  onChildAdded(child(ref(realtimeDatabase), `chat/`), sucCallback);
  // onChildRemoved(child(ref(realtimeDatabase), "chat"), (snapshot: DataSnapshot) => console.log('snapshot', snapshot));
}

/**
 * @description 방 생성 듣기 종료 함수
 */
export function realtimeRoomListenOff() {
  off(child(ref(realtimeDatabase), "chat/"), "child_added");
}

/**
 * @param request database path 값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @description 채팅 실시간 듣기 함수
 */
export function realtimeChatListenOn(
  request: Irequest,
  sucCallback: () => void
) {
  const { collectionType } = request;
  onChildAdded(child(ref(realtimeDatabase), collectionType), sucCallback);
  // onChildRemoved(child(ref(realtimeDatabase), "chat"), (snapshot: DataSnapshot) => console.log('snapshot', snapshot));
}

/**
 * @param request database path 값을 담은 객체
 * @description 채팅 실시간 종료 함수
 */
export function realtimeChatListenOff(request: Irequest) {
  const { collectionType = "" } = request;
  off(child(ref(realtimeDatabase), collectionType), "child_added");
}

/**
 * @param sucCallback 성공콜백함수
 * @description 사용자 로그인 듣기 함수
 * @deprecated
 */
export function realtimeOnlineUserListenOn(sucCallback: () => void) {
  onChildAdded(child(ref(realtimeDatabase), "onlineUser"), sucCallback);
  onChildRemoved(child(ref(realtimeDatabase), "onlineUser"), sucCallback);
}

/**
 * @description 사용자 로그인 듣기 종료 함수
 */
export function realtimeOnlineUserListenOff() {
  off(child(ref(realtimeDatabase), "onlineUser"), "child_changed");
  off(child(ref(realtimeDatabase), "onlineUser"), "child_removed");
}
