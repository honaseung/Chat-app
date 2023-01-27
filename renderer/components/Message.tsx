const Message = ({ id, name, time, message, mine }) => {
  return (
    <>
      <div className={mine ? "msg-mine" : "msg-others"}>
        {id} {time} {name} {message}
      </div>
    </>
  );
};

export default Message;
