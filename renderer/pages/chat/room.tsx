import { Button, TextField } from "@mui/material";
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

const Room: React.FunctionComponent = () => {
  const user = getUser();
  const router = useRouter();
  const room = router.query.room;
  const collectionType = "chat/" + room;

  const getConversation = () => {
    setLoading(true);
    realtimeGetDocs(
      { collectionType },
      (response: any) => {
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
      (error: any) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  const addMessage = (
    info: string = '',
    newCollectionType: string = ''
  ) => {
    setLoading(true);
    realtimeAddDoc(
      {
        collectionType: newCollectionType || collectionType,
        roomParam: {
          ...oriConversation,
          [new Date().getTime() +
            "-" +
            replaceAllSpecialChar(user?.email || '', "_") +
            "-" +
            user?.displayName || '']: info || text,
        }
      },
      (response: any) => {
        setLoading(false);
        console.log(response);
      },
      (error: any) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  const [oriConversation, setOriConversation] = useState<object>({});
  const [conversation, setConversation] = useState<Imessage[]>([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    realtimeChatListenOn({ collectionType }, () => {
      getConversation();
    });
  }, []);

  const goToRooms = () => {
    realtimeChatListenOff({ collectionType });
    router.push("rooms", undefined, { shallow: true });
  };

  const exitRoom = async () => {
    setLoading(true);
    const changedId = replaceAllSpecialChar(user?.email || '', "_");
    await realtimeChatListenOff({ collectionType });
    await realtimeExitRoomDocs(
      {
        collectionType,
        roomParam: { changedId },
      },
      () => {
        setLoading(false);
        addMessage(
          `${user?.email || ''} 님이 나가셨습니다.`,
          collectionType.replace(`-${changedId}`, "")
        );
      }
    );
    router.push("rooms");
  };

  if (loading) {
    return null;
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {conversation &&
            conversation.map((message: Imessage, idx) => {
              return (
                <div key={idx}>
                  {!validateSameDay(message.date, message.prevDate) ? (
                    <>
                      <div key={message.date.toLocaleDateString()} className="conversation-date">
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
                      replaceAllSpecialChar(user?.email || '', "_") ===
                      message.targetId
                    }
                    time={message.date.toLocaleTimeString()}
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
          <Button onClick={() => addMessage()}>보내기</Button>
          <Button onClick={goToRooms}>목록으로 돌아가기</Button>
          <Button onClick={exitRoom}>방에서 나가기</Button>
        </>
      )}
    </>
  );
};

export default Room;
