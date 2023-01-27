import { useEffect, useState } from "react";
import { getUser } from "../lib/firebaseAction";
import { replaceAllSpecialChar } from "../lib/utils";
import { validateSameDay } from "../lib/validate";
import Message from "./Message";

const Messages = ({ userId, conversation }) => {
  return (
    <>
      {Object.keys(conversation).map((key, idx, whole) => {
        const [milliseconds, id, name] = key.split("-");
        const prevDate = new Date(
          parseInt(whole[idx - 1]?.split("-")[0] || "0", 10)
        );
        const date = new Date(parseInt(milliseconds, 10));
        const sameDay = validateSameDay(date, prevDate);
        return (
          <>
            {!sameDay ? (
              <div key={idx} className="conversation-date">
                {date.toLocaleDateString()}
              </div>
            ) : null}
            <Message
              key={key}
              id={id}
              name={name}
              time={date.toLocaleTimeString()}
              message={conversation[key]}
              mine={replaceAllSpecialChar(userId, "_") === id}
            />
          </>
        );
      })}
    </>
  );
};

export default Messages;
