import { Button, Skeleton, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getUser,
  realtimeAddDoc,
  realtimeExitRoomDocs,
  realtimeGetDocs,
  realtimeChatListenOff,
  realtimeChatListenOn,
} from "../../lib/firebaseApi";
import { replaceAllSpecialChar } from "../../lib/utils";
import Message from "../../components/Message";
import { validateSameDay } from "../../lib/validate";
import { useRouter } from "next/router";
import Loading from "../../components/Loading";

const Room = () => {
  const user = getUser();
  const router = useRouter();
  const room = router.query.room;
  const collectionType = "chat/" + room;

  const getConversation = () => {
    setLoading(true);
    realtimeGetDocs(
      { collectionType },
      (response) => {
        setLoading(false);
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
      (error) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  const addMessage = (
    info: string = null,
    newCollectionType: string = null
  ) => {
    setLoading(true);
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
      (response) => {
        setLoading(false);
        console.log(response);
      },
      (error) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  const [oriConversation, setOriConversation] = useState({});
  const [conversation, setConversation] = useState([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    realtimeChatListenOn({ collectionType }, () => {
      console.log("realtimeListenOn");
      getConversation();
    });
  }, []);

  const goToRooms = () => {
    realtimeChatListenOff({ collectionType });
    console.log("realtimeListenOff");
    router.push("rooms");
  };

  const exitRoom = async () => {
    setLoading(true);
    const changedId = replaceAllSpecialChar(user.email, "_");
    await realtimeChatListenOff({ collectionType });
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
      {loading ? (
        <Loading />
      ) : (
        <>
          {conversation &&
            conversation.map((message, idx) => {
              return (
                <>
                  {!validateSameDay(message.date, message.prevDate) ? (
                    <>
                      <Skeleton animation={false} />
                      <div key={idx} className="conversation-date">
                        {message.date.toLocaleDateString()}
                      </div>
                    </>
                  ) : null}
                  <Message
                    messageKey={message.key}
                    targetId={message.targetId.split("_")[0]}
                    userName={message.userName}
                    text={message.text}
                    mine={
                      replaceAllSpecialChar(user.email, "_") ===
                      message.targetId
                    }
                    time={message.date.toLocaleTimeString()}
                  />
                </>
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
          <Button onClick={() => addMessage()}>보내기</Button>
          <Button onClick={goToRooms}>목록으로 돌아가기</Button>
          <Button onClick={exitRoom}>방에서 나가기</Button>
        </>
      )}
    </>
  );
};

export default Room;
