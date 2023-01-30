import { Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getUser,
  realtimeInviteRoom,
  realtimeExitRoomDocs,
  realtimeGetDocs,
  realtimeChatListenOff,
  realtimeChatListenOn,
  realtimeSendMessage,
  commonAddDoc,
} from "../../lib/firebaseApi";
import { replaceAllSpecialChar } from "../../lib/utils";
import Message from "../../components/Message";
import { validateSameDay } from "../../lib/validate";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import { Iroom } from "../../type/room";
import { Iuser } from "../../type/user";
import { Imessage } from "../../type/message";
import { User } from "firebase/auth";

const Room: React.FunctionComponent = () => {
  const userInfo = getUser();
  const router = useRouter();
  const roomKey = router.query.roomKey;
  const collectionType = "chat/" + roomKey;

  const getRoomInfo = () => {
    realtimeGetDocs(
      { collectionType },
      (response: any) => {
        const roomInfo = response.val();
        setRoomInfo(roomInfo);
        setMessages(roomInfo.messages);
        setMembers(roomInfo.members);
      },
      (error: any) => {
        console.log(error);
      }
    );
  };

  const sendMessage = () => {
    if (text === "") return;
    realtimeSendMessage(
      {
        collectionType: collectionType + "/messages",
        messages: [
          ...messages,
          {
            userId: userInfo.email,
            userName: userInfo.displayName,
            prevDate: messages[messages.length - 1].date,
            date: new Date().getTime(),
            text,
          },
        ],
      },
      (response: any) => {
        setText("");
      },
      (error: any) => {
        console.log(error);
      }
    );
  };

  const [roomInfo, setRoomInfo] = useState<Iroom>({});
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [members, setMembers] = useState<Iuser[]>([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    realtimeChatListenOn(
      { collectionType: collectionType + "/messages" },
      () => {
        getRoomInfo();
      }
    );
  }, []);

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
              date: new Date().getTime(),
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
    router.push("rooms");
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {messages &&
            messages.map((message: Imessage, idx) => {
              const date = new Date(message.date);
              const prevDate = new Date(message.prevDate);
              return (
                <div key={idx}>
                  {!validateSameDay(date, prevDate) ? (
                    <>
                      <div key={message.date} className="conversation-date">
                        {date.toLocaleDateString()}
                      </div>
                    </>
                  ) : null}
                  <Message
                    messageKey={message.date}
                    userId={message.userId}
                    userName={message.userName}
                    text={message.text}
                    mine={userInfo?.email === message.userId}
                    time={date.toLocaleTimeString()}
                    key={idx}
                  />
                </div>
              );
            })}
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
          <Button onClick={exitRoom}>방에서 나가기</Button>
          {/* <Button onClick={TEST}>TEST</Button> */}
        </>
      )}
    </>
  );
};

export default Room;
