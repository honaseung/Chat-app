import { useState, useEffect } from "react";
import {
  getUser,
  realtimeGetRooms,
  realtimeRoomListenOff,
  realtimeRoomListenOn,
} from "../../lib/firebaseApi";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import Room from "../../components/Room";
import { Iroom } from "../../type/room";
import { Iuser } from "../../type/user";
import InviteSnackbar from "../../components/IniviteSnackbar";

const Rooms: React.FunctionComponent = () => {
  const router = useRouter();
  const userInfo: Iuser = getUser(() => {
    console.log("logouted");
    router.push("/home", undefined, { shallow: true });
  });

  const [rooms, setRooms] = useState<Iroom[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRooms();
    realtimeRoomListenOn(() => {
      getRooms();
    });
  }, []);

  const getRooms = () => {
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
  };

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
        room.includes("_") ||
        allRooms[room].members?.some((member: Iuser) => {
          return member.userId === userInfo?.email;
        })
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
          return room.created === 0 ? (
            <Room
              title={room.title}
              created={room.created}
              members={room.members}
              lastMessage={room.messages[room.messages.length - 1].text}
              key={i}
            />
          ) : (
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
        onClick={() => {
          realtimeRoomListenOff();
          router.push("../user/users", undefined, { shallow: true });
        }}
      >
        Back
      </Button>
      <InviteSnackbar />
    </>
  );
};

export default Rooms;
