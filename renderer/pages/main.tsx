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

import InviteSnackbar from "../components/common/InviteSnackbar";

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
      <InviteSnackbar />
    </>
  );
};

export default Main;
