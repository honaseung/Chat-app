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

type Room = {
  room: string;
};

const Room: React.FunctionComponent<Room> = ({ room }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const enterRoom = (room: string) => {
    setLoading(true);
    router.push({
      pathname: "room",
      query: { room },
    }, undefined, { shallow: true });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Card sx={{ minWidth: 275, mt: 1, backgroundColor: "#d8ede7" }}>
          <CardContent>
            {room.split("-").map((title, idx) => {
              if (idx == 0) return null;
              return idx === 1 ? (
                <div key={title}>
                  <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                    key={title}
                  >
                    {"생성 날짜: " + createLocaleDateString(title)}
                  </Typography>
                  <Typography variant="h5" component="div" key={idx}>
                    참여자:
                  </Typography>
                </div>
              ) : (
                <Typography
                  sx={{ textAlign: "right" }}
                  color="text.secondary"
                  key={idx}
                >
                  {title.split("_")[0]}
                </Typography>
              );
            })}
          </CardContent>
          <CardActions>
            <Button onClick={() => enterRoom(room)}>들어가기</Button>
          </CardActions>
        </Card>
      )}
    </>
  );
};

export default Room;
