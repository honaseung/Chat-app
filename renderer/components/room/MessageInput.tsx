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

/**
 *
 * @description 방 내부에서 메세지를 입력하거나 방 외부로 이동하도록 하는 컴포넌트입니다.
 */
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

  /**
   * @description 방 목록들로 돌아갑니다.
   */
  const goToRooms = () => {
    realtimeChatListenOff({ collectionType });
    if (roomInfo.created) {
      router.push("/chat/myRooms", undefined, { shallow: true });
    } else {
      router.push("/chat/openRooms", undefined, { shallow: true });
    }
  };

  /**
   * @description 방에서 나가기 함수 입니다.
   */
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
        onKeyUp={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
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
