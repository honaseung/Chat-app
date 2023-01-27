import Room from "../../components/Room";
import { useState, useEffect } from "react";
import { getUser, realtimeGetDocs } from "../../lib/firebaseAction";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { replaceAllSpecialChar } from "../../lib/utils";

const Rooms = () => {
  const router = useRouter();
  const user = getUser();

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    realtimeGetDocs(
      {
        collectionType: "chat",
      },
      (res) => setRooms(res.val()),
      (err) => console.log(err)
    );
  }, []);
  return (
    <>
      {rooms &&
        Object.keys(rooms).map((room, idx) => {
          <Room key={idx} target={rooms[room]["+821094955948"]} />;
        })}
      <Button onClick={() => router.push("../user/users")}>Back</Button>
    </>
  );
};

export default Rooms;
