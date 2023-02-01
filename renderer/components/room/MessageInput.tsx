import { Button, ButtonGroup, CardActionArea, TextField } from "@mui/material";

type MessageInput = {
  text: string;
  setText(s: string): void;
  sendMessage(): void;
};

const MessageInput: React.FunctionComponent<MessageInput> = ({
  text,
  setText,
  sendMessage,
}) => {
  return (
    <>
      <TextField
        sx={{ width: "100%" }}
        label="메세지"
        multiline
        rows={4}
        variant="filled"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <ButtonGroup fullWidth variant="text" sx={{}}>
        <Button onClick={() => sendMessage()}>보내기</Button>
      </ButtonGroup>
    </>
  );
};

export default MessageInput;
