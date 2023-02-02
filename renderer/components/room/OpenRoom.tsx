import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import Loading from "../common/Loading";
import { useState } from "react";
import { Iuser } from "../../type/user";
import { realtimeChatListenOff } from "../../lib/firebaseApi";
import { Imessage } from "../../type/message";
import { useRouter } from "next/router";

type Room = {
  title: string;
  created: number;
  lastMessage: string;
  roomId: string;
};

const OpenRoom: React.FunctionComponent<Room> = ({
  title,
  lastMessage,
  roomId,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const enterRoom = () => {
    setLoading(true);
    router.push({ pathname: "/chat/roomDetail", query: { roomId } });
  };

  return (
    <>
      {loading && <Loading />}
      <Card
        sx={{
          minWidth: 275,
          mb: 0.3,
          backgroundColor: "#dcedc8",
        }}
      >
        <CardContent>
          {title}
          <Typography variant="h5" component="div">
            {"누구나 참여 가능"}
          </Typography>
          {lastMessage}
        </CardContent>
        <ButtonGroup fullWidth variant="text" color="inherit">
          <Button onClick={enterRoom}>들어가기</Button>
        </ButtonGroup>
      </Card>
    </>
  );
};

export default OpenRoom;
