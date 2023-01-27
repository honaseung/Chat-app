import { useEffect, useState } from "react";
import Message from "./Message";

const Messages = ({ conversation }) => {
  console.log(Object.keys(conversation));
  return (
    <>
      {conversation &&
        Object.keys(conversation).map((key) => {
          const [name, time] = key.split("-");
          <Message
            key={key}
            name={name}
            time={time}
            message={conversation[key]}
            mine
          />;
        })}
    </>
  );
};

export default Messages;
