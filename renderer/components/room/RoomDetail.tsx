import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Card,
  Divider,
  Icon,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  realtimeChatListenOn,
  realtimeSendMessage,
  realtimeGetRoom,
  getUser,
  realtimeChatListenOff,
} from "../../lib/firebaseApi";
import Message from "./Message";
import { Iroom } from "../../type/room";
import { Iuser } from "../../type/user";
import { Imessage } from "../../type/message";
import MessageInput from "./MessageInput";
import { useRouter } from "next/router";
import Loading from "../common/Loading";
import RoomInfo from "./RoomInfo";

/**
 * @description 메세지 컴포넌트와 메세지 인풋 컴포넌트 그리고 방 정보 컴포넌트를 보여주는 실제 방 내부 컴포넌트 입니다.
 */
const RoomDetail: React.FunctionComponent = () => {
  const userInfo = getUser();
  const router = useRouter();
  const roomId = router.query.roomId;
  const roomCollectionType = "chat/" + roomId;
  const chatCollectionType = roomCollectionType + "/messages";

  /**
   * @description 방 정보 가져오기 함수
   */
  const getRoomInfo = (): void => {
    realtimeGetRoom(
      { collectionType: roomCollectionType },
      (response: any) => {
        setLoading(false);
        const roomInfo = response.val();
        setRoomInfo(roomInfo);
        setMessages(roomInfo.messages);
        setMembers(roomInfo.members);
      },
      (error: any) => {
        setLoading(false);
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
        collectionType: chatCollectionType,
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
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    realtimeChatListenOn({ collectionType: chatCollectionType }, () => {
      getRoomInfo();
    });
    return () => {
      realtimeChatListenOff({ collectionType: chatCollectionType });
    };
  }, []);

  return (
    <>
      {loading && <Loading />}
      {roomId ? (
        <Box>
          <Card
            sx={{
              height: "74.5vh",
              overflow: "scroll",
              overflowX: "hidden",
            }}
          >
            <RoomInfo members={members} roomInfo={roomInfo} />
            <Divider />
            {messages && (
              <Box>
                {messages.map((message: Imessage, idx) => {
                  const date = new Date(message.date);
                  const prevDate = new Date(message.prevDate);
                  return (
                    <Message
                      messageKey={message.date}
                      date={date}
                      prevDate={prevDate}
                      userId={message.userId}
                      userName={message.userName}
                      text={message.text}
                      mine={userInfo?.email === message.userId}
                      time={date.toLocaleTimeString()}
                      key={idx}
                    />
                  );
                })}
              </Box>
            )}
          </Card>
          <Box
            sx={{
              bottom: "0.1vh",
              position: "absolute",
              width: "100%",
            }}
          >
            <MessageInput
              text={text}
              setText={setText}
              sendMessage={sendMessage}
              members={members}
              messages={messages}
              roomInfo={roomInfo}
              collectionType={roomCollectionType}
            />
          </Box>
        </Box>
      ) : (
        "방을 선택해주십시오."
      )}
    </>
  );
};

export default RoomDetail;
