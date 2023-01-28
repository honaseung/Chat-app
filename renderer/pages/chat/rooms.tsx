import { useState, useEffect } from "react";
import { getUser, realtimeGetDocs } from "../../lib/firebaseAction";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { createLocaleDateString, replaceAllSpecialChar } from "../../lib/utils";

const Rooms = () => {
  const user = getUser();

  const router = useRouter();

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    realtimeGetDocs(
      {
        collectionType: "chat",
      },
      (response) => {
        const res = response.val();
        const list = Object.keys(res).filter((el) => {
          if (el.includes(replaceAllSpecialChar(user.email, "_"))) {
            return res[el];
          }
        });
        setRooms(list);
      },
      (err) => console.log(err)
    );
  }, []);
  const enterRoom = (idx, room) => {
    router.push({
      pathname: "room",
      query: { room },
    });
  };
  return (
    <>
      {rooms &&
        rooms.map((room, idx) => {
          return (
            <>
              참여자:
              {room.split("-").map((title, idx) => {
                if (idx == 0) return null;
                return idx === 1 ? (
                  <div key={idx}>
                    {"생성 날짜: " + createLocaleDateString(title)}
                  </div>
                ) : (
                  <div key={idx}>{title.split("_")[0]}</div>
                );
              })}
              <Button key={idx + 1} onClick={() => enterRoom(idx, room)}>
                들어가기
              </Button>
            </>
          );
        })}
      <Button onClick={() => router.push("../user/users")}>Back</Button>
    </>
  );
};

export default Rooms;
