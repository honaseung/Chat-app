const Message = ({ name, time, message, mine }) => {
  return (
    <>
      <div className={mine ? "msg-mine" : "msg-others"}>
        {name} {time} {message}
      </div>
    </>
  );
};

export default Message;
