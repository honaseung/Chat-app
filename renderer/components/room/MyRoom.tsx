import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import { createLocaleDateString } from "../../lib/utils";
import Loading from "../common/Loading";
import { useState } from "react";
import { Iuser } from "../../type/user";
import {
  getUser,
  realtimeChatListenOff,
  realtimeExitRoom,
} from "../../lib/firebaseApi";
import { Imessage } from "../../type/message";
import { useRouter } from "next/router";
import {
  ExitToApp,
  ExpandCircleDown,
  ExpandMore,
  Info,
  Login,
  MeetingRoom,
  NoMeetingRoom,
  UnfoldLess,
  UnfoldMore,
} from "@mui/icons-material";

type MyRoom = {
  title: string;
  created: number;
  members: Iuser[];
  lastMessage: string;
  messages: Imessage[];
  roomId: string | number;
};

const MyRoom: React.FunctionComponent<MyRoom> = ({
  title,
  created,
  members,
  lastMessage,
  messages,
  roomId,
}) => {
  const userInfo = getUser();
  const router = useRouter();
  const roomCollectionType = "chat/" + roomId;
  const chatCollectionType = roomCollectionType + "/messages";

  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const enterRoom = async (roomKey: number | string) => {
    setLoading(true);
    await realtimeChatListenOff({
      collectionType: chatCollectionType,
    });
    router.push({
      pathname: "/chat/roomDetail",
      query: { roomId: roomKey },
    });
  };

  const exitRoom = async () => {
    setLoading(true);
    await realtimeExitRoom(
      {
        collectionType: roomCollectionType,
        roomParam: {
          title: title,
          created: created,
          messages: [
            ...messages,
            {
              userId: userInfo.email,
              userName: userInfo.displayName,
              prevDate: messages[messages.length - 1].date,
              date: Date.now(),
              text: `${userInfo?.email || ""} 님이 나가셨습니다.`,
            },
          ],
          members: members.filter((member) => member.userId !== userInfo.email),
        },
      },
      () => {
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
  };
  return (
    <>
      {loading && <Loading />}
      <Box sx={{ textAlign: "center" }}>
        <Card
          sx={{
            backgroundColor: "#9fa8da",
            mt: 1,
            width: 500,
            display: "inline-block",
          }}
          variant="outlined"
        >
          <CardHeader
            avatar={<Info />}
            title={title}
            subheader={createLocaleDateString(created)}
            sx={{ textAlign: "right" }}
          />
          <CardContent
            sx={{
              textOverflow: "ellipsis",
            }}
          >
            <Typography
              component="p"
              sx={{
                textAlign: "left",
                fontSize: 24,
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
          <CardActions
            disableSpacing
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {expanded ? (
              <UnfoldLess onClick={() => setExpanded(!expanded)} />
            ) : (
              <UnfoldMore onClick={() => setExpanded(!expanded)} />
            )}
            <ButtonGroup>
              <Button
                startIcon={<MeetingRoom />}
                onClick={() => enterRoom(created)}
                sx={{ color: "whitesmoke" }}
                color="info"
              >
                들어가기
              </Button>
              <Button
                startIcon={<NoMeetingRoom />}
                onClick={exitRoom}
                sx={{ color: "whitesmoke" }}
                color="info"
              >
                방에서 나가기
              </Button>
            </ButtonGroup>
          </CardActions>
          <Collapse
            in={expanded}
            timeout="auto"
            unmountOnExit
            orientation="vertical"
          >
            <CardContent>
              <Typography paragraph sx={{ textAlign: "left" }}>
                참여자:{" "}
              </Typography>
              {members &&
                members.map((member, idx) => (
                  <Typography key={idx} sx={{ textAlign: "right" }}>
                    {`${member.userName}(${member.userId})`}
                  </Typography>
                ))}
            </CardContent>
          </Collapse>
        </Card>
      </Box>
    </>
  );
};

export default MyRoom;
