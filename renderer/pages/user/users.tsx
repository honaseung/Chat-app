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
  realtimeAddDoc,
} from "../../lib/firebaseApi";
import User from "../../components/User";
import Modal from "../../components/Modal";
import {
  createChatRoomCollection,
  replaceAllSpecialChar,
} from "../../lib/utils";
import Loading from "../../components/Loading";
import Link from "../../components/Link";
import { ListUsersResult } from "firebase-admin/lib/auth/base-auth";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { SetStateAction } from "react";
import { Iuser, defaultUser } from "../../type/user";
import { User as firebaseUser } from "firebase/auth";

const Users: React.FunctionComponent = () => {
  const user: firebaseUser | Iuser = getUser() || defaultUser;

  useEffect(() => {
    setLoading(true);
    listUsers(
      (response: ListUsersResult) => {
        setLoading(false);
        const users: SetStateAction<object[]> = [];
        response.users.forEach((user: UserRecord) => {
          users.push(user.toJSON());
        });
        setUsers(users);
      },
      (error: any) => {
        setLoading(false);
        console.log(error);
      }
    );
  }, []);

  const [users, setUsers] = useState<object[]>([]);
  const [targetUsers, setTargetUsers] = useState<string[]>([]);
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

  const handleChat = (e: React.ChangeEvent<HTMLInputElement>, info: Iuser = { ...defaultUser }) => {
    const { checked } = e.target;
    const { email } = info;
    if (checked) setTargetUsers(targetUsers.concat([email]));
    else setTargetUsers(targetUsers.filter((user) => user !== info.email));
  };

  const invite = () => {
    setModalOption({
      title: "초대",
      content: `${targetUsers.join(" 와\n ")} 를 초대합니다.`,
    });
    setModalOpen(true);
  };

  const confirmInvite = () => {
    setLoading(true);
    realtimeAddDoc(
      {
        collectionType:
          "chat/" +
          "-" +
          new Date().getTime() +
          createChatRoomCollection(targetUsers.concat([user?.email || ''])),
        roomParam: {
          [new Date().getTime() +
            "-" +
            replaceAllSpecialChar(user?.email || '', "_") +
            "-" +
            user.displayName]:
            user.email +
            " (이)가 " +
            targetUsers.join(" (와)과 ") +
            " (을)를 " +
            "초대하였습니다.",
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
                  displayName={u.displayName}
                  email={u.email}
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
          <Modal
            title={modalOption.title}
            content={modalOption.content}
            open={modalOpen}
            setOpen={setModalOpen}
            type="confirm"
            onConfirm={confirmInvite}
          />
        </>
      )}
    </>
  );
};

export default Users;
