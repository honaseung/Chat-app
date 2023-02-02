import { Avatar, Box, Chip, Paper } from "@mui/material";
import Divider from "@mui/material/Divider";
import { validateSameDay } from "../../lib/validate";

type Message = {
  messageKey: number;
  userId: string;
  userName: string;
  time: string;
  text: string;
  mine: boolean;
  date: Date;
  prevDate: Date;
};

const Message: React.FunctionComponent<Message> = ({
  messageKey,
  userId,
  userName,
  time,
  text,
  mine,
  date,
  prevDate,
}) => {
  return (
    <>
      <Box key={messageKey}>
        <Box sx={{ backgroundColor: "#e0f2f1" }}>
          {!validateSameDay(date, prevDate) && (
            <Box
              sx={{
                textAlign: "center",
                backgroundColor: "#009688",
                color: "white",
              }}
            >
              {date.toLocaleDateString()}
            </Box>
          )}
        </Box>
        <Chip
          sx={{
            ml: 1,
            mr: 1,
            float: mine ? "right" : "left",
            backgroundColor: "#b2dfdb",
          }}
          label={userName}
        />
        <Box
          component="span"
          sx={{ float: mine ? "left" : "right", color: "#aaa" }}
        >
          {time}
        </Box>
        <Divider component="br" />
        <Box
          component="p"
          sx={{
            ml: 3,
            mr: 3,
            textAlign: mine ? "right" : "left",
            wordWrap: "break-word",
          }}
        >
          {text}
        </Box>
      </Box>
    </>
  );
};

export default Message;
