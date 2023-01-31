import { Button, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getUser,
  realtimeChatListenOn,
  realtimeSendMessage,
  realtimeInviteListenOff,
  realtimeGetRoom,
} from "../../lib/firebaseApi";
import Message from "../../components/Message";
import { validateSameDay } from "../../lib/validate";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";
import { Iroom } from "../../type/room";
import { Iuser } from "../../type/user";
import { Imessage } from "../../type/message";
import MessageInput from "../../components/MessageInput";

/**
 * @description 메세지 컴포넌트와 메세지 인풋 컴포넌트를 보여주는 페이지 컴포넌트 입니다.
 */
const Room: React.FunctionComponent = () => {
  const router = useRouter();
  const roomKey = router.query.roomKey;
  const collectionType = "chat/" + roomKey;
  const userInfo: Iuser = getUser();

  /**
   * @description 방 정보 가져오기 함수
   */
  const getRoomInfo = (): void => {
    realtimeGetRoom(
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

  /**
   * @description 메세지 정보 기록 함수
   */
  const sendMessage = (): void => {
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
            date: Date.now(),
            text,
          },
        ],
      },
      () => {
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
    realtimeInviteListenOff();
  }, []);

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
          <MessageInput
            collectionType={collectionType}
            setLoading={setLoading}
            roomInfo={roomInfo}
            messages={messages}
            userInfo={userInfo}
            members={members}
            text={text}
            setText={setText}
            sendMessage={sendMessage}
          />
        </>
      )}
    </>
  );
};

export default Room;
