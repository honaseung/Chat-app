import { Button, TextareaAutosize } from "@mui/material";
import { useState, useEffect } from "react";
import Messages from "./Mesaages";
import {
  getUser,
  realtimeAddDoc,
  realtimeGetDocs,
} from "../lib/firebaseAction";
import { replaceAllSpecialChar, createChatRoomCollection } from "../lib/utils";

const Room = ({ target }) => {
  const user = getUser();
  const collectionType = createChatRoomCollection(user.email, target.email);
  const getConversation = () => {
    realtimeGetDocs(
      { collectionType },
      (response) => {
        setConversation(response.val());
      },
      (error) => console.log(error)
    );
  };

  const addMessage = () => {
    realtimeAddDoc(
      {
        collectionType,
        inputParams: {
          ...conversation,
          [new Date().getTime() +
          "-" +
          replaceAllSpecialChar(user.email, "_") +
          "-" +
          user.displayName]: text,
        },
      },
      (response) => getConversation(),
      (error) => console.log(error)
    );
  };

  const [conversation, setConversation] = useState({});
  const [text, setText] = useState("");

  useEffect(() => {
    getConversation();
  }, []);

  return (
    <>
      {conversation && (
        <Messages userId={user.email} conversation={conversation} />
      )}
      <TextareaAutosize
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={addMessage}>보내기</Button>
    </>
  );
};

export default Room;
