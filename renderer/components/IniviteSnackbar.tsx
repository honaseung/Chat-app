import { Snackbar } from "@mui/material";
import { useState, useEffect } from "react";
import { getUser, realtimeInviteListenOn } from "../lib/firebaseApi";
import { useRouter } from "next/router";

const InviteSnackbar: React.FunctionComponent = () => {
  const userInfo = getUser();
  const now = Date.now();
  const router = useRouter();

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
  }, []);
  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClick={() => {
          router.push(
            {
              pathname: "/chat/room",
              query: { roomKey: snackbarOption.roomKey },
            },
            undefined,
            { shallow: true }
          );
        }}
        message={`"${snackbarOption.roomTitle}" 방에 초대 되셨습니다. 클릭 시 이동합니다.`}
      />
    </>
  );
};

export default InviteSnackbar;
