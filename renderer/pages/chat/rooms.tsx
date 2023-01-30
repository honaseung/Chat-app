import { useState, useEffect } from "react";
import {
  getUser,
  realtimeGetDocs,
  realtimeGetRooms,
} from "../../lib/firebaseApi";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import Room from "../../components/Room";
import { Iroom } from "../../type/room";
import { Iuser } from "../../type/user";
import { User } from "firebase/auth";

const Rooms: React.FunctionComponent = () => {
  const router = useRouter();
  const userInfo = getUser();

  const [rooms, setRooms] = useState<Iroom[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    setLoading(true);
    realtimeGetRooms(
      {
        collectionType: "chat",
      },
      (response: any) => {
        setLoading(false);
        if (response) {
          const rooms = response.val();
          setMessagesLength(rooms);
          setRooms(getMyRooms(rooms));
        }
      },
      (error: any) => {
        setLoading(false);
        console.log(error);
      }
    );
  }, []);

  const setMessagesLength = (rooms: any) => {
    const tmpRooms = Object.keys(rooms).map((roomKey: string) => {
      const tmpRoom = {
        ...rooms[roomKey],
        length: Object.keys(rooms[roomKey].messages),
      };
      return tmpRoom;
    });
    return tmpRooms;
  };

  const getMyRooms = (allRooms: any): Iroom[] => {
    const myRooms: Iroom[] = [];
    Object.keys(allRooms).map((room: string) => {
      if (
        allRooms[room].members.some(
          (member: Iuser) => member.userId === userInfo.email
        )
      ) {
        myRooms.push(allRooms[room]);
      }
    });
    return myRooms;
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : rooms.length > 0 ? (
        rooms.map((room, i) => {
          return (
            <Room
              title={room.title}
              created={room.created}
              members={room.members}
              lastMessage={room.messages[room.messages.length - 1].text}
              key={i}
            />
          );
        })
      ) : (
        <div>참여중인 방이 없습니다.</div>
      )}
      <Button
        onClick={() =>
          router.push("../user/users", undefined, { shallow: true })
        }
      >
        Back
      </Button>
    </>
  );
};

export default Rooms;
