import { useState, useEffect } from "react";
import { getUser, realtimeGetDocs } from "../../lib/firebaseApi";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { createLocaleDateString, replaceAllSpecialChar } from "../../lib/utils";
import Loading from "../../components/Loading";

const Rooms = () => {
  const user = getUser();

  const router = useRouter();

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    realtimeGetDocs(
      {
        collectionType: "chat",
      },
      (response) => {
        setLoading(false);
        const res = response.val();
        if (res) {
          const list = Object.keys(res).filter((el) => {
            if (el.includes(replaceAllSpecialChar(user.email, "_"))) {
              return res[el];
            }
          });
          setRooms(list);
        }
      },
      (error) => {
        setLoading(false);
        console.log(error);
      }
    );
  }, []);
  const enterRoom = (room) => {
    setLoading(true);
    router.push({
      pathname: "room",
      query: { room },
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : rooms.length > 0 ? (
        rooms.map((room, i) => {
          return (
            <>
              <Card sx={{ minWidth: 275, mt: 1, backgroundColor: "#d8ede7" }}>
                <CardContent>
                  {room.split("-").map((title, idx) => {
                    if (idx == 0) return null;
                    return idx === 1 ? (
                      <>
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
                      </>
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
            </>
          );
        })
      ) : (
        <div>참여중인 방이 없습니다.</div>
      )}
      <Button onClick={() => router.push("../user/users")}>Back</Button>
    </>
  );
};

export default Rooms;
