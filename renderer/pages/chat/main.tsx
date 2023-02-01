import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

import Users from "../../components/user/Users";
import Rooms from "../../components/room/Rooms";

import { getUser, logoutUser } from "../../lib/firebaseApi";
import { Iuser } from "../../type/user";
import { useState } from "react";
import InviteSnackbar from "../../components/common/InviteSnackbar";
import { useRouter } from "next/router";

const Main: React.FunctionComponent = () => {
  const userInfo: Iuser = getUser();
  const router = useRouter();

  const [roomId, setRoomId] = useState<string | number>(0);
  const logout = () => {
    logoutUser(
      () => {
        router.push("/home", undefined, { shallow: true });
      },
      (error: any) => {
        console.log(error);
      }
    );
  };
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ width: "100vh" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            ></IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {`${userInfo.displayName}(${userInfo.email})`}
            </Typography>
            <Button color="inherit" onClick={logout}>
              LOGOUT
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Box component="span" sx={{ display: "inline-flex" }}>
        <Users userInfo={userInfo} />
        <Rooms userInfo={userInfo} roomId={roomId} setRoomId={setRoomId} />
      </Box>
      <InviteSnackbar userInfo={userInfo} setRoodId={setRoomId} />
    </>
  );
};

export default Main;
