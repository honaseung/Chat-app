import { Avatar, Chip, Paper } from "@mui/material";

const Message = ({ messageKey, targetId, userName, time, text, mine }) => {
  return (
    <>
      <div key={messageKey} className={mine ? "msg-mine" : "msg-others"}>
        <Chip avatar={<Avatar>{targetId}</Avatar>} label={userName} />
        <Chip label={time} color="secondary" size="small" />
        {userName}
        <Paper
          variant="outlined"
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
