import { Button, ButtonGroup, Fab } from "@mui/material";
import { useRouter } from "next/router";

import { Iuser, defaultUser } from "../type/user";
import { getUser, logoutUser } from "../lib/firebaseApi";
import { useState } from "react";

type UserGridButton = {
  targetUsers: Iuser[];
  setTargetUsers(i: Iuser[]): void;
  setLoading(b: boolean): void;
  invite(): void;
  inviteOne: boolean;
  setInviteOne(b: boolean);
};

const UserGridButton: React.FunctionComponent<UserGridButton> = ({
  targetUsers,
  setTargetUsers,
  setLoading,
  invite,
  inviteOne,
  setInviteOne,
}) => {
  const router = useRouter();
  const userInfo: Iuser = getUser();

  const logout = () => {
    setLoading(true);
    logoutUser(
      () => {
        // realtimeOnlineUserListenOff();
        router.push("/home", undefined, { shallow: true });
        setLoading(false);
      },
      (error: any) => {
        console.log(error);
        setLoading(false);
      }
    );
  };
  return (
    <>
      <ButtonGroup size="large" variant="contained" fullWidth>
        <Button color="error" onClick={logout}>
          LOGOUT
        </Button>
        <Button
          color="info"
          onClick={() => {
            setTargetUsers([
              {
                ...defaultUser,
                phoneNumber: userInfo?.phoneNumber,
                userId: userInfo?.email,
                userName: userInfo?.displayName,
              },
            ]);
            setInviteOne(!inviteOne);
          }}
        >
          {inviteOne ? "1:1 CHAT" : "GROUP CHAT"}
        </Button>
        <Button
          color="warning"
          className="btn"
          disabled={targetUsers.length === 1 || inviteOne}
          onClick={invite}
        >
          INVITE
        </Button>
        <Button color="success" onClick={() => router.push("../chat/rooms")}>
          ROOMS
        </Button>
      </ButtonGroup>
    </>
  );
};

export default UserGridButton;
