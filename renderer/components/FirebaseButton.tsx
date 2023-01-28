import { Button } from "@mui/material";
import { useState } from "react";
import {
  commonAddDoc,
  commonGetDocs,
  realtimeAddDoc,
  realtimeGetDocs,
  registUser,
  loginUser,
  logoutUser,
} from "../lib/firebaseApi";
import Loading from "./Loading";

/**
 * @deprecated
 */
const FirebaseButton = ({
  request,
  sucCallback,
  failCallback,
  disabled,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const firebaseAction = (request, sucCallback, failCallback) => {
    setLoading(true);
    const { databaseType, actionType } = request;
    switch (databaseType) {
      case "C":
        if (actionType === "set") {
          commonAddDoc(request, sucCallback, failCallback);
        }
        if (actionType === "get") {
          commonGetDocs(request, sucCallback, failCallback);
        }
        break;

      case "R":
        if (actionType === "set") {
          realtimeAddDoc(request, sucCallback, failCallback);
        }
        if (actionType === "get") {
          realtimeGetDocs(request, sucCallback, failCallback);
        }
        break;

      case "U":
        if (actionType === "set") {
          registUser(request, sucCallback, failCallback);
        }
        if (actionType === "get") {
          loginUser(request, sucCallback, failCallback);
        }
        if (actionType === "out") {
          logoutUser(sucCallback, failCallback);
        }
        break;

      default:
        break;
    }
    setLoading(false);
  };
  return (
    <>
      <Button
        disabled={disabled}
        onClick={() => firebaseAction(request, sucCallback, failCallback)}
      >
        {children}
      </Button>
      <Loading loading={loading} />
    </>
  );
};

export default FirebaseButton;
