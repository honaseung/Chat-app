import { Button, TextareaAutosize } from "@mui/material";
import { useState, useEffect } from "react";
import Messages from "../../components/Mesaages";
import { realtimeAddDoc, realtimeGetDocs } from "../../lib/firebaseAction";

const Rooms = () => {
  const getConversation = () => {
    realtimeGetDocs(
      { collectionType: "test/test" },
      (response) => {
        setConversation(response.val());
      },
      (error) => console.log(error)
    );
  };

  const addMessage = () => {
    realtimeAddDoc(
      {
        collectionType: "test/test",
        inputParams: {
          ...conversation,
          ["soma" + "-" + Date.now()]: "NICE3",
        },
      },
      (response) => getConversation(),
      (error) => console.log(error)
    );
  };

  const [conversation, setConversation] = useState({});

  useEffect(() => {
    getConversation();
  }, []);

  return (
    <>
      <Messages conversation={conversation} />
      <TextareaAutosize />
      <Button onClick={addMessage}>보내기</Button>
    </>
  );
};

export default Rooms;
