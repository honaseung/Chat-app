import { database, realtimeDatabase } from "../../firebase-config";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { ref, child, get, set } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useCreateWhere } from "../lib/create-query";

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description 사용자 등록 함수
 */
export async function registUser(request, sucCallback, failCallback) {
  const { inputParams } = request;
  const auth = getAuth();
  await createUserWithEmailAndPassword(
    auth,
    inputParams.id,
    inputParams.password
  )
    .then((response) => {
      if (sucCallback) {
        sucCallback(response);
        commonAddDoc(request, (response) => console.log(response), null);
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
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, inputParams.id, inputParams.password)
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
  const auth = getAuth();
  signOut(auth)
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
  await addDoc(collection(database, collectionType), inputParams).then(
    (response) => {
      if (sucCallback) sucCallback(response);
    }
  );
}

/**
 * @deprecated
 * @description  firestore 에 읽기 함수
 */
export async function commonGetDocs(request, sucCallback, failCallback) {
  const { collectionType, condition } = request;
  let q = null;
  if (condition.length > 0) {
    const queryConstraints = useCreateWhere(condition);
    q = query(collection(database, collectionType), ...queryConstraints);
  } else {
    q = collection(database, collectionType);
  }
  await getDocs(q).then((response) => {
    if (sucCallback) sucCallback(response);
  });
}

/**
 * @param request 인풋값을 담은 객체
 * @param sucCallback 성공콜백함수
 * @param failCallback 실패콜백함수
 * @description realtime database 저장 함수
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
 * @description realtime database 읽기 함수
 */
export async function realtimeGetDocs(request, sucCallback, failCallback) {
  const { collectionType } = request;
  await get(child(ref(realtimeDatabase), collectionType))
    .then((response) => {
      if (sucCallback) sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}
