import {
  Button,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
import { Iuser } from "../../type/user";
import Loading from "../../components/Loading";
import Link from "../../components/Link";

const Users = () => {
  const user = getUser();

  useEffect(() => {
    setLoading(true);
    listUsers(
      (response) => {
        setLoading(false);
        const users: Iuser[] = [];
        response.users.forEach((user) => {
          users.push(user.toJSON());
        });
        setUsers(users);
      },
      (error) => {
        setLoading(false);
        console.log(error);
      }
    );
  }, []);

  const [users, setUsers] = useState([]);
  const [targetUsers, setTargetUsers] = useState([]);
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
        router.push("/home");
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );
  };

  const handleChat = (e, info) => {
    const { checked } = e.target;
    const { displayName, email, phoneNumber } = info;
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
          createChatRoomCollection(targetUsers.concat([user.email])),
        inputParams: {
          [new Date().getTime() +
          "-" +
          replaceAllSpecialChar(user.email, "_") +
          "-" +
          user.displayName]:
            user.email +
            " (이)가 " +
            targetUsers.join(" (와)과 ") +
            " (을)를 " +
            "초대하였습니다.",
        },
      },
      (response) => {
        setLoading(false);
        router.push("../chat/rooms");
      },
      (error) => {
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
            <Fab color="primary" aria-label="add">
              {/* <AddIcon /> */}
              <Button className="btn" onClick={logout}>
                LOGOUT
              </Button>
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
              {users.map((u) => (
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
