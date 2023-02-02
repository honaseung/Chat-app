import { Snackbar } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getUser,
  realtimeInviteListenOff,
  realtimeInviteListenOn,
} from "../../lib/firebaseApi";
import { Iuser } from "../../type/user";
import { useRouter } from "next/router";

type InviteSnackbar = {};

/**
 * @description 방에 초대 되었을때 사용자에게 알려주는 컴포넌트입니다.
 */
const InviteSnackbar: React.FunctionComponent<InviteSnackbar> = () => {
  const userInfo: Iuser = getUser();
  const router = useRouter();
  const now = Date.now();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOption, setSnackbarOption] = useState({
    roomTitle: "",
    roomKey: 0,
  });

  useEffect(() => {
    realtimeInviteListenOn((snapshot) => {
      const snap = snapshot.val();
      if (snap.roomKey > now && snap.memberIds.includes(userInfo.email)) {
        setSnackbarOption({
          roomTitle: snap.title,
          roomKey: snap.roomKey,
        });
        setSnackbarOpen(true);
      }
    });
    return () => {
      realtimeInviteListenOff();
    };
  }, []);
  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClick={() => {
          router.push({
            pathname: "/chat/roomDetail",
            query: { roomId: snackbarOption.roomKey },
          });
        }}
        message={`"${snackbarOption.roomTitle}" 방에 참여자가 되셨습니다. 클릭 시 이동합니다.`}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
};

export default InviteSnackbar;
