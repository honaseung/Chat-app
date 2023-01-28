const Message = ({ messageKey, targetId, userName, time, text, mine }) => {
  return (
    <>
      <div key={messageKey} className={mine ? "msg-mine" : "msg-others"}>
        {targetId} {time} {userName} {text}
      </div>
    </>
  );
};

export default Message;
