import { useState, useEffect } from "react";
import { realtimeGetRooms, realtimeRoomListenOn } from "../../lib/firebaseApi";
import { Card, CardContent, List, Paper } from "@mui/material";
import Loading from "../common/Loading";
import Room from "./Room";
import { Iroom } from "../../type/room";
import { Iuser } from "../../type/user";
import RoomDetail from "./RoomDetail";
import Box from "@mui/material/Box";

type Rooms = {
  roomId: string | number;
  setRoomId(sn: string | number): void;
  userInfo: Iuser;
};
/**
 * @description 방 컴포넌트를 보여주는 페이지 컴포넌트입니다.
 */
const Rooms: React.FunctionComponent<Rooms> = ({
  roomId,
  setRoomId,
  userInfo,
}) => {
  const [rooms, setRooms] = useState<Iroom[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    realtimeRoomListenOn(() => {
      console.log("realtimeRoomListenOn");
      getRooms();
    });
  }, []);

  /**
   * @description 방 목록 가져오기 함수
   */
  const getRooms = (): void => {
    realtimeGetRooms(
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

  /**
   * @param rooms 방 정보 목록
   * @returns 메세지 개수가 세팅된 방 정보
   */
  const setMessagesLength = (rooms: any) => {
    const tmpRooms = Object.keys(rooms).map((roomKey: string) => {
      const tmpRoom = {
        ...rooms[roomKey],
        messages: {
          ...rooms[roomKey].messages,
          length: Object.keys(rooms[roomKey].messages),
        },
      };
      return tmpRoom;
    });
    return tmpRooms;
  };

  /**
   *
   * @param allRooms 모든 방 목록의 키 값
   * @returns 내가 속한 방 목록과 오픈 그룹방 정보
   */
  const getMyRooms = (allRooms: any): Iroom[] => {
    const myRooms: Iroom[] = [];
    Object.keys(allRooms).map((room: string) => {
      if (
        room.includes("GLOBAL") ||
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
        <>
          <List
            sx={{
              maxHeight: "100vh",
              width: "65vh",
              overflow: "scroll",
              overflowX: "hidden",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                fontSize: 25,
                backgroundColor: "#607d8b",
                color: "white",
                fontWeight: 1000,
              }}
            >
              참여 중인 방 목록
            </Box>
            {rooms.map((room, i) => {
              return room.created === 0 ? (
                <Room
                  title={room.title}
                  created={room.created}
                  members={room.members}
                  lastMessage={room.messages[room.messages.length - 1].text}
                  messages={room.messages}
                  key={i}
                  roomId={roomId}
                  setRoomId={setRoomId}
                  userInfo={userInfo}
                />
              ) : (
                <Room
                  title={room.title}
                  created={room.created}
                  members={room.members}
                  lastMessage={room.messages[room.messages.length - 1].text}
                  messages={room.messages}
                  key={i}
                  roomId={roomId}
                  setRoomId={setRoomId}
                  userInfo={userInfo}
                />
              );
            })}
          </List>
          <RoomDetail roomId={roomId} userInfo={userInfo} />
        </>
      ) : (
        <Card>
          <CardContent>
            <div>참여중인 방이 없습니다.</div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Rooms;
