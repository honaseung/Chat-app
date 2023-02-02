import { useState, useEffect } from "react";
import {
  realtimeGetRooms,
  realtimeRoomListenOff,
  realtimeRoomListenOn,
} from "../../lib/firebaseApi";
import { Card, CardContent, List, Paper } from "@mui/material";
import Loading from "../common/Loading";
import Room from "./MyRoom";
import { Iroom } from "../../type/room";
import { Iuser } from "../../type/user";
import RoomDetail from "./RoomDetail";
import Box from "@mui/material/Box";
import OpenRoom from "./OpenRoom";

/**
 * @description 방 컴포넌트를 보여주는 페이지 컴포넌트입니다.
 */
const OpenRooms: React.FunctionComponent = () => {
  const [rooms, setRooms] = useState<Iroom[]>([]);
  const [roomIds, setRoomIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    realtimeRoomListenOn(() => {
      getRooms();
    });
    return () => {
      realtimeRoomListenOff();
    };
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

          const [gblRooms, gblRoomIds] = getGlobalRooms(rooms);
          setRooms(gblRooms);
          setRoomIds(gblRoomIds);
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
   * @returns 오픈 그룹방 정보
   */
  const getGlobalRooms = (allRooms: any): any[] => {
    const gblRooms: Iroom[] = [];
    const gblRoomIds: string[] = [];
    Object.keys(allRooms).map((room: string) => {
      if (room.includes("GLOBAL")) {
        gblRooms.push(allRooms[room]);
        gblRoomIds.push(room);
      }
    });
    return [gblRooms, gblRoomIds];
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : rooms.length > 0 ? (
        <>
          <List>
            <Box
              sx={{
                textAlign: "center",
                fontSize: 25,
                backgroundColor: "#607d8b",
                color: "white",
                fontWeight: 1000,
              }}
            >
              오픈 채팅 방 목록
            </Box>
            {rooms.map((room, i) => {
              return (
                <OpenRoom
                  title={room.title}
                  created={room.created}
                  lastMessage={room.messages[room.messages.length - 1].text}
                  key={i}
                  roomId={roomIds[i]}
                />
              );
            })}
          </List>
        </>
      ) : (
        <Card>
          <CardContent>
            <div>존재하는 오픈 채팅 방이 없습니다.</div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default OpenRooms;
