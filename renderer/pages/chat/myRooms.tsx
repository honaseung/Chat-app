import Rooms from "../../components/room/MyRooms";
import { useState } from "react";
import { getUser } from "../../lib/firebaseApi";
import { Iuser } from "../../type/user";
import MyRooms from "../../components/room/MyRooms";
import InviteSnackbar from "../../components/common/InviteSnackbar";

const myRoomsConatiner: React.FunctionComponent = () => {
  return (
    <>
      <MyRooms />
      <InviteSnackbar />
    </>
  );
};

export default myRoomsConatiner;
