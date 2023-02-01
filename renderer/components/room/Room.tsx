import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { createLocaleDateString } from "../../lib/utils";
import Loading from "../common/Loading";
import { useState } from "react";
import { Iuser } from "../../type/user";
import { realtimeChatListenOff, realtimeExitRoom } from "../../lib/firebaseApi";
import { Imessage } from "../../type/message";

type Room = {
  title: string;
  created: number;
  members: Iuser[];
  lastMessage: string;
  messages: Imessage[];
  roomId: string | number;
  setRoomId(sn: string | number): void;
  userInfo: Iuser;
};

const Room: React.FunctionComponent<Room> = ({
  title,
  created,
  members,
  lastMessage,
  messages,
  roomId,
  setRoomId,
  userInfo,
}) => {
  let collectionType = "chat/" + created;

  const [loading, setLoading] = useState(false);

  const enterRoom = async (roomKey: number | string) => {
    await realtimeChatListenOff({
      collectionType: collectionType + "/messages",
    });
    setRoomId(roomKey);
  };

  const exitRoom = async () => {
    await realtimeChatListenOff({ collectionType });
    await realtimeExitRoom(
      {
        collectionType: collectionType,
        roomParam: {
          title: title,
          created: created,
          messages: [
            ...messages,
            {
              userId: userInfo.email,
              userName: userInfo.displayName,
              prevDate: messages[messages.length - 1].date,
              date: Date.now(),
              text: `${userInfo?.email || ""} 님이 나가셨습니다.`,
            },
          ],
          members: members.filter((member) => member.userId !== userInfo.email),
        },
      },
      () => {
        setLoading(false);
        setRoomId(0);
      },
      (error) => {
        console.log(error);
      }
    );
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Card
          sx={{
            minWidth: 275,
            mb: 0.3,
            backgroundColor:
              // roomId === created
              //   ? "#d1c4e9"
              //   :
              !!created ? "#d8ede7" : "#dcedc8",
          }}
        >
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {!!created ? `생성 날짜: ${createLocaleDateString(created)}` : ""}
            </Typography>
            {title}
            <Typography variant="h5" component="div">
              {!!created ? "참여자:" : "누구나 참여 가능"}
            </Typography>
            {members &&
              members.map((member, idx) => (
                <Typography
                  sx={{ textAlign: "right" }}
                  color="text.secondary"
                  key={idx}
                >
                  {`${member.userName}(${member.userId})`}
                </Typography>
              ))}
            {lastMessage}
          </CardContent>
          <ButtonGroup fullWidth variant="text" color="inherit">
            <Button
              onClick={() => enterRoom(!!created ? created : "0_GLOBAL_ROOM")}
            >
              들어가기
            </Button>
            {!!created && <Button onClick={exitRoom}>방에서 나가기</Button>}
          </ButtonGroup>
        </Card>
      )}
    </>
  );
};

export default Room;
