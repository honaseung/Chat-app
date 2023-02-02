import Rooms from "../../components/room/MyRooms";
import { useState } from "react";
import { getUser } from "../../lib/firebaseApi";
import { Iuser } from "../../type/user";
import OpenRooms from "../../components/room/OpenRooms";
import InviteSnackbar from "../../components/common/InviteSnackbar";

const openRoomsConatiner: React.FunctionComponent = () => {
  return (
    <>
      <OpenRooms />
      <InviteSnackbar />
    </>
  );
};

export default openRoomsConatiner;
