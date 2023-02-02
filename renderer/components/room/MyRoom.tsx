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
import {
  getUser,
  realtimeChatListenOff,
  realtimeExitRoom,
} from "../../lib/firebaseApi";
import { Imessage } from "../../type/message";
import { useRouter } from "next/router";

type MyRoom = {
  title: string;
  created: number;
  members: Iuser[];
  lastMessage: string;
  messages: Imessage[];
  roomId: string | number;
};

const MyRoom: React.FunctionComponent<MyRoom> = ({
  title,
  created,
  members,
  lastMessage,
  messages,
  roomId,
}) => {
  const userInfo = getUser();
  const router = useRouter();
  const roomCollectionType = "chat/" + roomId;
  const chatCollectionType = roomCollectionType + "/messages";

  const [loading, setLoading] = useState(false);

  const enterRoom = async (roomKey: number | string) => {
    setLoading(true);
    await realtimeChatListenOff({
      collectionType: chatCollectionType,
    });
    router.push({
      pathname: "/chat/roomDetail",
      query: { roomId: roomKey },
    });
  };

  const exitRoom = async () => {
    setLoading(true);
    await realtimeExitRoom(
      {
        collectionType: roomCollectionType,
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
      },
      (error) => {
        console.log(error);
      }
    );
  };
  return (
    <>
      {loading && <Loading />}
      <Card
        sx={{
          minWidth: 275,
          mb: 0.3,
          backgroundColor: "#d8ede7",
        }}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            생성 날짜: {createLocaleDateString(created)}
          </Typography>
          {title}
          <Typography variant="h5" component="div">
            참여자:
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
          <Button onClick={() => enterRoom(created)}>들어가기</Button>
          <Button onClick={exitRoom}>방에서 나가기</Button>
        </ButtonGroup>
      </Card>
    </>
  );
};

export default MyRoom;
