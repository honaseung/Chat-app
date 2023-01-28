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
  off,
} from "firebase/database";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  auth,
  firestore,
  realtimeDatabase,
  cmmAuth,
} from "../../firebase-config";

import {
  useCreateWhere,
  useRealtimeDatabaseCreateWhere,
} from "../lib/create-query";
import { replaceAllSpecialChar } from "./utils";

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
export async function listUsers(sucCallback, failCallback) {
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
export async function registUser(request, sucCallback, failCallback) {
  const { inputParams } = request;
  await auth
    .createUser({
      email: inputParams.email,
      emailVerified: false,
      phoneNumber: inputParams.phoneNumber,
      password: inputParams.password,
      displayName: inputParams.displayName,
      // photoURL: inputParams.photoURL,
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
export async function loginUser(request, sucCallback, failCallback) {
  const { inputParams } = request;
  await signInWithEmailAndPassword(
    cmmAuth,
    inputParams.id,
    inputParams.password
  )
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
 * @description 사용자 로그 아웃 함수
 */
export async function logoutUser(sucCallback, failCallback) {
  signOut(cmmAuth)
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

/**
 * @deprecated
 * @description firestore 에 저장 함수
 */
export async function commonAddDoc(request, sucCallback, failCallback) {
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
export async function commonGetDocs(request, sucCallback, failCallback) {
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
export async function realtimeAddDoc(request, sucCallback, failCallback) {
  const { collectionType, inputParams } = request;
  await set(ref(realtimeDatabase, collectionType), inputParams)
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
export async function realtimeGetDocs(request, sucCallback, failCallback) {
  const { collectionType, condition = [] } = request;
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
export async function realtimeGetRoomDocs(sucCallback, failCallback) {
  const userInfo = cmmAuth.currentUser;
  const queryConstraints = useRealtimeDatabaseCreateWhere([
    replaceAllSpecialChar(userInfo.email, "_"),
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
export async function realtimeExitRoomDocs(request, sucCallback, failCallback) {
  const { collectionType, inputParams } = request;
  console.log(collectionType.replace(`-${inputParams}_`, ""));
  const newCollectionType = collectionType.replace(`-${inputParams}`, "");
  await get(child(ref(realtimeDatabase), collectionType)).then((data) => {
    console.log("remove", collectionType);
    remove(child(ref(realtimeDatabase), collectionType)).then((response) => {
      console.log("remove", response);
      console.log("set", newCollectionType);
      set(child(ref(realtimeDatabase), newCollectionType), data.val()).then(
        (response) => {
          console.log("set", response);
          if (sucCallback) sucCallback();
        }
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
export async function realtimeListenOn(request, sucCallback, failCallback) {
  const { collectionType } = request;
  await onChildAdded(
    child(ref(realtimeDatabase), collectionType),
    sucCallback,
    failCallback
  );
}
/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime Database 읽기 함수
 */
export async function realtimeListenOff(request) {
  const { collectionType } = request;
  await off(child(ref(realtimeDatabase), collectionType), "child_added");
}
