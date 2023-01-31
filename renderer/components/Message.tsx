import { Avatar, Chip, Paper } from "@mui/material";

type Message = {
  messageKey: number,
  userId: string,
  userName: string,
  time: string,
  text: string,
  mine: boolean,
}

const Message: React.FunctionComponent<Message> = ({ messageKey, userId, userName, time, text, mine }) => {
  return (
    <>
      <div key={messageKey} className={mine ? "msg-mine" : "msg-others"}>
        <Chip avatar={<Avatar>{userId}</Avatar>} label={userName} />
        <Chip label={time} color="secondary" size="small" />
        {userName}
        <Paper
          square
          elevation={12}
          sx={{ textAlign: "left" }}
        >
          {text}
        </Paper>
      </div>
    </>
  );
};

export default Message;
