import { Button, TextField } from "@mui/material";
import { useRouter } from "next/router";
import {
  realtimeChatListenOff,
  realtimeExitRoomDocs,
} from "../lib/firebaseApi";
import { Iroom } from "../type/room";
import { Imessage } from "../type/message";
import { Iuser } from "../type/user";

type MessageInput = {
  collectionType: string;
  setLoading(b: boolean): void;
  roomInfo: Iroom;
  messages: Imessage[];
  userInfo: Iuser;
  members: Iuser[];
  text: string;
  setText(s: string): void;
  sendMessage(): void;
};

const MessageInput: React.FunctionComponent<MessageInput> = ({
  collectionType,
  setLoading,
  roomInfo,
  messages,
  userInfo,
  members,
  text,
  setText,
  sendMessage,
}) => {
  const router = useRouter();

  const goToRooms = () => {
    realtimeChatListenOff({ collectionType });
    router.push("rooms", undefined, { shallow: true });
  };

  const exitRoom = async () => {
    setLoading(true);
    await realtimeChatListenOff({ collectionType });
    await realtimeExitRoomDocs(
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
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
    router.push("rooms", undefined, { shallow: true });
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
      <Button onClick={() => sendMessage()}>보내기</Button>
      <Button onClick={goToRooms}>목록으로 돌아가기</Button>
      {!!roomInfo.created ? (
        <Button onClick={exitRoom}>방에서 나가기</Button>
      ) : null}
    </>
  );
};

export default MessageInput;
