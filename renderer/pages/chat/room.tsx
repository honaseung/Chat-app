import { Button, TextareaAutosize } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getUser,
  realtimeAddDoc,
  realtimeExitRoomDocs,
  realtimeGetDocs,
  realtimeListenOff,
  realtimeListenOn,
} from "../../lib/firebaseApi";
import {
  replaceAllSpecialChar,
  createChatRoomCollection,
} from "../../lib/utils";
import Message from "../../components/Message";
import { validateSameDay } from "../../lib/validate";
import { useRouter } from "next/router";

const Room = () => {
  const user = getUser();
  const router = useRouter();
  const room = router.query.room;
  const collectionType = "chat/" + room;
  const getConversation = () => {
    realtimeGetDocs(
      { collectionType },
      (response) => {
        const res = response.val();
        setOriConversation(res);
        const messages = Object.keys(response.val()).map((key, idx, whole) => {
          const [milliseconds, targetId, userName] = key.split("-");
          const text = res[key];
          const prevDate = new Date(
            parseInt(whole[idx - 1]?.split("-")[0] || "0", 10)
          );
          const date = new Date(parseInt(milliseconds, 10));
          return {
            targetId, //메세지 주인 ID
            userName, //메세지 주인 이름
            prevDate, //이전 메세지 일자
            date, //메세지 일자
            key, //메세지 키
            text,
          };
        });
        setConversation(messages);
      },
      (error) => console.log(error)
    );
  };

  const addMessage = (
    info: string = null,
    newCollectionType: string = null
  ) => {
    realtimeAddDoc(
      {
        collectionType: newCollectionType || collectionType,
        inputParams: {
          ...oriConversation,
          [new Date().getTime() +
          "-" +
          replaceAllSpecialChar(user.email, "_") +
          "-" +
          user.displayName]: info || text,
        },
      },
      (response) => console.log(response),
      (error) => console.log(error)
    );
  };

  const [oriConversation, setOriConversation] = useState({});
  const [conversation, setConversation] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    realtimeListenOn({ collectionType }, () => {
      console.log("realtimeListenOn");
      getConversation();
    });
  }, []);

  const goToRooms = () => {
    realtimeListenOff({ collectionType });
    console.log("realtimeListenOff");
    router.push("rooms");
  };

  const exitRoom = async () => {
    const changedId = replaceAllSpecialChar(user.email, "_");
    await realtimeListenOff({ collectionType });
    await realtimeExitRoomDocs(
      {
        collectionType,
        inputParams: { changedId },
      },
      () => {
        addMessage(
          `${user.email} 님이 나가셨습니다.`,
          collectionType.replace(`-${changedId}`, "")
        );
      }
    );
    router.push("rooms");
  };

  return (
    <>
      {conversation &&
        conversation.map((message, idx) => {
          return (
            <>
              {!validateSameDay(message.date, message.prevDate) ? (
                <div key={idx} className="conversation-date">
                  {message.date.toLocaleDateString()}
                </div>
              ) : null}
              <Message
                messageKey={message.key}
                targetId={message.targetId.split("_")[0]}
                userName={message.userName}
                text={message.text}
                mine={
                  replaceAllSpecialChar(user.email, "_") === message.targetId
                }
                time={message.date.toLocaleTimeString()}
              />
            </>
          );
        })}
      <TextareaAutosize
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={() => addMessage()}>보내기</Button>
      <Button onClick={goToRooms}>목록으로 돌아가기</Button>
      <Button onClick={exitRoom}>방에서 나가기</Button>
    </>
  );
};

export default Room;
