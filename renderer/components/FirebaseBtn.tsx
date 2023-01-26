import { Button } from "@mui/material";
import { database, realtimeDatabase } from "../../firebase-config";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { ref, child, get, set } from "firebase/database";
import { useCreateWhere } from "../lib/create-query";

const FirebaseBtn = ({ request, callback, condition = [], children }) => {
  const databaseAction = async (request) => {
    const { databaseType, actionType, collectionType, inputParams } = request;
    switch (databaseType) {
      case "C":
        if (actionType === "set") {
          await addDoc(collection(database, collectionType), inputParams).then(
            (response) => {
              callback(response);
            }
          );
        }

        if (actionType === "get") {
          let q = null;
          if (condition.length > 0) {
            const queryConstraints = useCreateWhere(condition);
            q = query(
              collection(database, collectionType),
              ...queryConstraints
            );
          } else {
            q = collection(database, collectionType);
          }
          await getDocs(q).then((response) => {
            callback(response);
          });
        }
        break;

      case "R":
        if (actionType === "set") {
          await set(ref(realtimeDatabase, collectionType), inputParams)
            .then((response) => {
              callback(response);
            })
            .catch((error) => {
              console.log(error);
            });
        }

        if (actionType === "get") {
          await get(child(ref(realtimeDatabase), collectionType))
            .then((response) => {
              callback(response);
            })
            .catch((error) => {
              console.error(error);
            });
        }
        break;

      default:
        break;
    }
  };

  return <Button onClick={() => databaseAction(request)}>{children}</Button>;
};

export default FirebaseBtn;
