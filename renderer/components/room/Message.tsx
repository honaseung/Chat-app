import { Box, Chip } from "@mui/material";
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

/**
 * @description 채팅방 내부에서 화면에 보여지는 메세지 컴포넌트입니다.
 */
const Message: React.FunctionComponent<Message> = ({
  messageKey,
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
                fontSize: 24,
                fontStyle: "italic",
              }}
            >
              {date.toLocaleDateString()}
            </Box>
          )}
        </Box>
        <Chip
          sx={{
            mt: 1,
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
