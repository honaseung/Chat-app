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
import { createLocaleDateString, toEllipsis } from "../../lib/utils";
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
  FiberNewRounded,
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

/**
 *
 * @description 참여중인 방들의 외부 컴포넌트입니다.
 */
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
  const isNew = Date.now() - created < 300000;

  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  /**
   *
   * @description 방 입장 함수
   */
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

  /**
   * @description 방 나가기 함수
   */
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
      <Box
        sx={{
          textAlign: "center",
          display: "inline-flex",
          justifyContent: "space-between",
        }}
      >
        <Card
          sx={{
            backgroundColor: isNew ? "#80cbc4" : "#9fa8da",
            mt: 1,
            ml: 2,
            mr: 2,
            width: 600,
            display: "inline-block",
          }}
          variant="outlined"
        >
          <CardHeader
            avatar={isNew ? <FiberNewRounded /> : <Info />}
            title={toEllipsis(title, 20)}
            subheader={createLocaleDateString(created)}
            sx={{ textAlign: "right" }}
          />
          <CardContent>
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
                textAlign: "start",
              }}
            >
              {toEllipsis(lastMessage, 45)}
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
                참여자:
              </Typography>
              {members &&
                members.map((member, idx) =>
                  idx < 3 ? (
                    <Typography key={idx} sx={{ textAlign: "right" }}>
                      {`${member.userName}(${member.userId})`}
                    </Typography>
                  ) : (
                    idx === 3 && "... 이외 더 많은 멤버들이 참여중입니다. ..."
                  )
                )}
            </CardContent>
          </Collapse>
        </Card>
      </Box>
    </>
  );
};

export default MyRoom;
