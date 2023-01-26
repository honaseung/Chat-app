import { Button } from "@mui/material";
import {
  firebaseCommonAddDoc,
  firebaseCommonGetDocs,
  firebaseRealtimeAddDoc,
  firebaseRealtimeGetDocs,
} from "../lib/firebaseAction";

const FirebaseButton = ({ request, callback, children }) => {
  const firebaseAction = (request, callback) => {
    const { databaseType, actionType } = request;
    switch (databaseType) {
      case "C":
        if (actionType === "set") {
          firebaseCommonAddDoc(request, callback);
        }
        if (actionType === "get") {
          firebaseCommonGetDocs(request, callback);
        }
        break;

      case "R":
        if (actionType === "set") {
          firebaseRealtimeAddDoc(request, callback);
        }
        if (actionType === "get") {
          firebaseRealtimeGetDocs(request, callback);
        }
        break;

      default:
        break;
    }
  };
  return (
    <Button onClick={() => firebaseAction(request, callback)}>
      {children}
    </Button>
  );
};

export default FirebaseButton;
