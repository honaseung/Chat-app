import { useState, useEffect } from "react";
import { getUser, realtimeGetDocs } from "../../lib/firebaseApi";
import {
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import { replaceAllSpecialChar } from "../../lib/utils";
import Loading from "../../components/Loading";
import Room from "../../components/Room";

const Rooms: React.FunctionComponent = () => {
  const user = getUser();

  const router = useRouter();

  const [rooms, setRooms] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    realtimeGetDocs(
      {
        collectionType: "chat",
      },
      (response: any) => {
        setLoading(false);
        const res = response.val();
        if (res) {
          const list: string[] = Object.keys(res).filter((el) => {
            if (el.includes(replaceAllSpecialChar(user?.email || '', "_"))) {
              return res[el];
            }
          });
          setRooms(list);
        }
      },
      (error: any) => {
        setLoading(false);
        console.log(error);
      }
    );
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : rooms.length > 0 ? (
        rooms.map((room, i) => {
          return (
            <Room room={room} key={i} />
          );
        })
      ) : (
        <div>참여중인 방이 없습니다.</div>
      )}
      <Button onClick={() => router.push("../user/users", undefined, { shallow: true })}>Back</Button>
    </>
  );
};

export default Rooms;
