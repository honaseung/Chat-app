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

export async function registUser(request, sucCallback, failCallback) {
  const { inputParams } = request;
  const auth = getAuth();
  await createUserWithEmailAndPassword(
    auth,
    inputParams.id,
    inputParams.password
  )
    .then((response) => {
      sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

export async function loginUser(request, sucCallback, failCallback) {
  const { inputParams } = request;
  const auth = getAuth();
  await signInWithEmailAndPassword(auth, inputParams.id, inputParams.password)
    .then((response) => {
      sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

export async function logoutUser(sucCallback, failCallback) {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      sucCallback();
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

export async function commonAddDoc(request, sucCallback, failCallback) {
  const { collectionType, inputParams } = request;
  await addDoc(collection(database, collectionType), inputParams).then(
    (response) => {
      sucCallback(response);
    }
  );
}

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
    sucCallback(response);
  });
}

export async function realtimeAddDoc(request, sucCallback, failCallback) {
  const { collectionType, inputParams } = request;
  await set(ref(realtimeDatabase, collectionType), inputParams)
    .then((response) => {
      sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}

export async function realtimeGetDocs(request, sucCallback, failCallback) {
  const { collectionType } = request;
  await get(child(ref(realtimeDatabase), collectionType))
    .then((response) => {
      sucCallback(response);
    })
    .catch((error) => {
      if (failCallback) failCallback(error);
    });
}
