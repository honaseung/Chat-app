import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FirebaseButton from "../../components/FirebaseButton";
import useCreateRequest from "../../lib/create-request";
import { getUser, listUsers, realtimeAddDoc } from "../../lib/firebaseApi";
import User from "../../components/User";
import Modal from "../../components/Modal";
import {
  createChatRoomCollection,
  replaceAllSpecialChar,
} from "../../lib/utils";
import { Iuser } from "../../type/user";

const Users = () => {
  const user = getUser();

  useEffect(() => {
    listUsers(
      (response) => {
        const users: Iuser[] = [];
        response.users.forEach((user) => {
          users.push(user.toJSON());
        });
        setUsers(users);
      },
      (error) => {
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

  const router = useRouter();

  const [logoutReqeust, logoutSucCallback, logoutFailCallback] =
    useCreateRequest(
      "U",
      "out",
      "",
      {},
      [],
      (response) => {
        console.log(response);
        router.push("/home");
      },
      null
    );

  const handleChat = (e, info) => {
    const { checked } = e.target;
    const { displayName, email, phoneNumber } = info;
    const content = info.dispalyName + "(" + info.email + ")";
    const title = checked ? "초대" : "나가기";
    setModalOption({ title, content });
    if (checked) setTargetUsers(targetUsers.concat([email]));
    else setTargetUsers(targetUsers.filter((user) => user !== info.email));
  };

  const invite = () => {
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
        router.push("../chat/rooms");
      },
      (error) => console.log(error)
    );
    router.push("../chat/rooms");
  };

  const goToRooms = () => {
    router.push("../chat/rooms");
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={5} align="center">
              <h2>USER INFO</h2>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">NAME</TableCell>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">LAST LOGIN</TableCell>
            <TableCell align="center">NUMBER</TableCell>
            <TableCell align="center">INVITE</TableCell>
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
              mine={u.email === user.email}
            />
          ))}
        </TableBody>
      </Table>
      <FirebaseButton
        request={logoutReqeust}
        sucCallback={logoutSucCallback}
        failCallback={logoutFailCallback}
        disabled={false}
      >
        LOGOUT
      </FirebaseButton>
      {/* <FirebaseButton
        request={logoutReqeust}
        sucCallback={logoutSucCallback}
        failCallback={logoutFailCallback}
        disabled={false}
      >
        INVITE
      </FirebaseButton> */}
      <Button onClick={invite}>INVITE</Button>
      <Button onClick={goToRooms}>GO TO ROOMS</Button>
      <Modal
        title={modalOption.title}
        content={modalOption.content}
        open={modalOpen}
        setOpen={setModalOpen}
        type="confirm"
        // onConfirm={}
      />
    </>
  );
};

export default Users;
