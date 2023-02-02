import { Button, ButtonGroup, CardActionArea, TextField } from "@mui/material";
import { Iroom } from "../../type/room";
import { useRouter } from "next/router";
import {
  getUser,
  realtimeChatListenOff,
  realtimeExitRoom,
} from "../../lib/firebaseApi";
import { Imessage } from "../../type/message";
import { Iuser } from "../../type/user";

type MessageInput = {
  text: string;
  setText(s: string): void;
  sendMessage(): void;
  members: Iuser[];
  messages: Imessage[];
  roomInfo: Iroom;
  collectionType: string;
};

const MessageInput: React.FunctionComponent<MessageInput> = ({
  text,
  setText,
  sendMessage,
  members,
  messages,
  roomInfo,
  collectionType,
}) => {
  const userInfo = getUser();
  const router = useRouter();

  const goToRooms = () => {
    realtimeChatListenOff({ collectionType });
    if (roomInfo.created) {
      router.push("/chat/myRooms", undefined, { shallow: true });
    } else {
      router.push("/chat/openRooms", undefined, { shallow: true });
    }
  };
  const exitRoom = async () => {
    await realtimeChatListenOff({ collectionType });
    await realtimeExitRoom(
      {
        collectionType: collectionType,
        roomParam: {
          title: roomInfo.title,
          created: roomInfo.created,
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
        router.replace("/chat/myRooms", undefined, { shallow: true });
      },
      (error) => {
        console.log(error);
      }
    );
  };
  return (
    <>
      <TextField
        sx={{ width: "100%" }}
        label="메세지"
        multiline
        rows={4}
        variant="filled"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <ButtonGroup fullWidth variant="text" sx={{}}>
        <Button onClick={() => sendMessage()}>보내기</Button>
        <Button onClick={goToRooms}>목록으로 돌아가기</Button>
        {!!roomInfo.created ? (
          <Button onClick={exitRoom}>방에서 나가기</Button>
        ) : null}
      </ButtonGroup>
    </>
  );
};

export default MessageInput;
