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
} from "../../lib/firebaseApi";
import Message from "./Message";
import { Iroom } from "../../type/room";
import { Iuser } from "../../type/user";
import { Imessage } from "../../type/message";
import MessageInput from "./MessageInput";
import { validateSameDay } from "../../lib/validate";
import { ExpandMore } from "@mui/icons-material";

/**
 * @description 메세지 컴포넌트와 메세지 인풋 컴포넌트를 보여주는 페이지 컴포넌트 입니다.
 */

type RoomDetail = {
  roomId: number | string;
  userInfo: Iuser;
};

const RoomDetail: React.FunctionComponent<RoomDetail> = ({
  roomId,
  userInfo,
}) => {
  const collectionType = "chat/" + roomId;

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

  useEffect(() => {
    realtimeChatListenOn(
      { collectionType: collectionType + "/messages" },
      () => {
        console.log("realtimeChatListenOn");
        getRoomInfo();
      }
    );
  }, [roomId]);

  return (
    <>
      {roomId ? (
        <Box>
          <Card
            sx={{
              height: "83.2vh",
              width: "80vh",
              overflow: "scroll",
              overflowX: "hidden",
            }}
          >
            <Accordion
              disabled={!members}
              sx={{
                backgroundColor: "#1769aa",
                ":disabled": { color: "black" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography
                  sx={{
                    color: members ? "white" : "black",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: 1000,
                  }}
                >
                  {roomInfo.title}
                </Typography>
              </AccordionSummary>
              {members && (
                <AccordionDetails>
                  <Box sx={{ color: "white" }}>
                    참여자
                    {members.map((member) => {
                      return (
                        <Box
                          sx={{ textAlign: "right" }}
                        >{`${member.userName}(${member.userId})`}</Box>
                      );
                    })}
                  </Box>
                </AccordionDetails>
              )}
            </Accordion>
            {messages && (
              <Box sx={{}}>
                {messages.map((message: Imessage, idx) => {
                  const date = new Date(message.date);
                  const prevDate = new Date(message.prevDate);
                  return (
                    <Box key={idx} sx={{ backgroundColor: "#e0f2f1" }}>
                      {!validateSameDay(date, prevDate) && (
                        <Box
                          sx={{
                            textAlign: "center",
                            backgroundColor: "#009688",
                            color: "white",
                          }}
                        >
                          {date.toLocaleDateString()}
                        </Box>
                      )}
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
                    </Box>
                  );
                })}
              </Box>
            )}
          </Card>
          <Box
            sx={{
              bottom: "0.1vh",
              position: "absolute",
              width: "80vh",
            }}
          >
            <MessageInput
              text={text}
              setText={setText}
              sendMessage={sendMessage}
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
