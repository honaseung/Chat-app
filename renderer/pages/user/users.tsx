import {
  Button,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getUser,
  listUsers,
  logoutUser,
  realtimeInviteRoom,
} from "../../lib/firebaseApi";
import User from "../../components/User";
import InviteModal from "../../components/InviteModal";
import Loading from "../../components/Loading";
import Link from "../../components/Link";
import { ListUsersResult } from "firebase-admin/lib/auth/base-auth";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { SetStateAction } from "react";
import { Iuser, defaultUser } from "../../type/user";

const Users: React.FunctionComponent = () => {
  const user: Iuser = getUser();

  useEffect(() => {
    setLoading(true);
    listUsers(
      (response: ListUsersResult) => {
        setLoading(false);
        const users: SetStateAction<Iuser[]> = [];
        response.users.forEach((user: UserRecord) => {
          users.push(user.toJSON() as Iuser);
        });
        setUsers(users);
      },
      (error: any) => {
        setLoading(false);
        console.log(error);
      }
    );
  }, []);

  const [users, setUsers] = useState<Iuser[]>([]);
  const [targetUsers, setTargetUsers] = useState<Iuser[]>([{
    ...defaultUser,
    phoneNumber: user?.phoneNumber,
    userId: user?.email,
    userName: user?.displayName,
  }]);

  const [roomTitle, setRoomTitle] = useState<string>("");
  const [modalOption, setModalOption] = useState({
    title: "",
    content: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const logout = () => {
    setLoading(true);
    logoutUser(
      () => {
        router.push("/home", undefined, { shallow: true });
        setLoading(false);
      },
      (error: any) => {
        console.log(error);
        setLoading(false);
      }
    );
  };

  const handleChat = (
    e: React.ChangeEvent<HTMLInputElement>,
    info: Iuser = { ...defaultUser }
  ) => {
    const { checked } = e.target;
    const { userName, userId, phoneNumber } = info;
    if (checked) {
      setTargetUsers(
        targetUsers.concat([{ ...defaultUser, userName, userId, phoneNumber }])
      );
    } else {
      setTargetUsers(targetUsers.filter((user) => user.userId !== info.userId));
    }
  };

  const invite = () => {
    setModalOption({
      title: "초대",
      content: `${targetUsers
        .map((user) => user.userName)
        .join(" 와\n ")} 를 초대합니다.`,
    });
    setModalOpen(true);
  };

  const confirmInvite = () => {
    setLoading(true);
    const createdTime = new Date().getTime();
    realtimeInviteRoom(
      {
        collectionType: "chat/" + createdTime,
        roomParam: {
          title: roomTitle,
          messages: [{
            userId: user.email,
            userName: user.displayName,
            prevDate: 0,
            date: createdTime,
            text:
              user.displayName +
              "(" +
              user.email +
              ")" +
              " (이)가 " +
              targetUsers
                .map((user) => user.userName)
                .join(" 와\n ") +
              " (을)를 " +
              "초대하였습니다.",
          }],
          // length: 1,
          members: targetUsers,
          created: createdTime,
        },
      },
      () => {
        setLoading(false);
        router.push("../chat/rooms");
      },
      (error: any) => {
        setLoading(false);
        console.log(error);
      }
    );
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="header">
            <Fab color="primary" aria-label="add" onClick={logout}>
              {/* <AddIcon /> */}
              LOGOUT
            </Fab>
            <Button
              className="btn"
              disabled={targetUsers.length === 0}
              onClick={invite}
            >
              INVITE
            </Button>
            <Fab color="primary" aria-label="edit">
              <Link className="btn" href={"../chat/rooms"}>
                GO TO ROOMS
              </Link>
            </Fab>
          </div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <h2>USER INFO</h2>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">NAME</TableCell>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">LAST LOGIN</TableCell>
                <TableCell align="center">NUMBER</TableCell>
                <TableCell align="center">INVITE</TableCell>
                {/* <TableCell align="center">ONLINE</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u: any) => (
                <User
                  key={u.uid}
                  userName={u.displayName}
                  userId={u.email}
                  lastSignInTime={
                    u.metadata.lastSignInTime
                      ? new Date(u.metadata.lastSignInTime).toLocaleDateString()
                      : "Never"
                  }
                  phoneNumber={u.phoneNumber}
                  handleChat={handleChat}
                  mine={u.email === user?.email}
                />
              ))}
            </TableBody>
          </Table>
          <InviteModal
            content={modalOption.content}
            open={modalOpen}
            setOpen={setModalOpen}
            onConfirm={confirmInvite}
            roomTitle={roomTitle}
            setRoomTitle={setRoomTitle}
            onClose={() => { }}
          />
        </>
      )}
    </>
  );
};

export default Users;
