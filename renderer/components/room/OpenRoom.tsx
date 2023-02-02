import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from "@mui/material";
import Loading from "../common/Loading";
import { useState } from "react";
import { Iuser } from "../../type/user";
import {
  realtimeChatListenOff,
  realtimeInviteRoom,
} from "../../lib/firebaseApi";
import { Imessage } from "../../type/message";
import { useRouter } from "next/router";
import { QuestionAnswer } from "@mui/icons-material";

type Room = {
  title: string;
  created: number;
  lastMessage: string;
  roomId: string;
  img: string;
};

const OpenRoom: React.FunctionComponent<Room> = ({
  title,
  lastMessage,
  roomId,
  img,
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
      <Box sx={{ textAlign: "center" }}>
        <Card
          sx={{ display: "flex", mt: 1, width: 600 }}
          variant="elevation"
          elevation={24}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography
                component="div"
                variant="h5"
                sx={{
                  fontStyle: "italic",
                  fontWeight: 1000,
                  color: "GrayText",
                }}
              >
                {title}
              </Typography>
              <Divider />
              <Typography
                component="p"
                sx={{
                  textAlign: "left",
                  fontSize: 16,
                }}
              >
                최근 메세지:
              </Typography>
              <Typography
                component="p"
                sx={{
                  textOverflow: "ellipsis",
                  textAlign: "start",
                }}
              >
                {lastMessage}
              </Typography>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                pl: 1,
                pb: 1,
              }}
            >
              <CardActions disableSpacing sx={{}}>
                <ButtonGroup>
                  <Button startIcon={<QuestionAnswer />} onClick={enterRoom}>
                    오픈 방 참여하기
                  </Button>
                </ButtonGroup>
              </CardActions>
            </Box>
          </Box>
          <CardMedia
            component="img"
            sx={{
              width: 200,
              height: 200,
              opacity: "0.7",
              pt: 1,
              pb: 1,
            }}
            image={`/globalRoom/${img}`}
            alt="/globalRoom/noImage.png"
          />
        </Card>
      </Box>
    </>
  );
};

export default OpenRoom;
