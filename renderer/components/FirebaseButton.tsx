import { Button } from "@mui/material";
import { useState } from "react";
import { registUser, loginUser, logoutUser } from "../lib/firebaseApi";

/**
 * @description api 전용 요청 버튼 입니다.
 * @deprecated 더이상 사용하지 않습니다.
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
          // commonAddDoc(request, sucCallback, failCallback);
        }
        if (actionType === "get") {
          // commonGetDocs(request, sucCallback, failCallback);
        }
        break;

      case "R":
        if (actionType === "set") {
          // realtimeAddDoc(request, sucCallback, failCallback);
        }
        if (actionType === "get") {
          // realtimeGetDocs(request, sucCallback, failCallback);
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
      {/* {loading && <Loading />} */}
    </>
  );
};

export default FirebaseButton;
