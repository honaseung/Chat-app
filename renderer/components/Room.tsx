import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { createLocaleDateString } from "../lib/utils";
import Loading from "./Loading";
import { useRouter } from "next/router";
import { useState } from "react";
import { Imessage } from "../type/message";
import { Iuser } from "../type/user";

type Room = {
  title: string;
  created: number;
  members: Iuser[];
  lastMessage: string;
};

const Room: React.FunctionComponent<Room> = ({ title, created, members, lastMessage }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const enterRoom = (roomKey: number) => {
    setLoading(true);
    router.push({
      pathname: "room",
      query: { roomKey },
    }, undefined, { shallow: true });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Card sx={{ minWidth: 275, mt: 1, backgroundColor: "#d8ede7" }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {"생성 날짜: " + createLocaleDateString(created)}
            </Typography>
            {title}
            <Typography variant="h5" component="div">
              참여자:
            </Typography>
            {members && members.map((member, idx) => (

              <Typography
                sx={{ textAlign: "right" }}
                color="text.secondary"
                key={idx}
              >
                {`${member.userName}(${member.userId})`}
              </Typography>
            ))
            }
            마지막 메세지: {lastMessage}
          </CardContent>
          <CardActions>
            <Button onClick={() => enterRoom(created)}>들어가기</Button>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default Room;
