import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";

// import Users from "../user/users";
import Rooms from "../components/room/MyRooms";

import { getUser, logoutUser } from "../lib/firebaseApi";
import { Iuser } from "../type/user";
import { useState } from "react";
import InviteSnackbar from "../components/common/InviteSnackbar";
import { useRouter } from "next/router";
import Link from "../components/Link";

const Main: React.FunctionComponent = () => {
  return (
    <>
      <Box
        component="span"
        sx={{ display: "inline-flex", backgroundColor: "black" }}
      >
        {/* <Users userInfo={userInfo} /> */}
        {/* <Rooms userInfo={userInfo} roomId={roomId} setRoomId={setRoomId} /> */}
      </Box>
    </>
  );
};

export default Main;
