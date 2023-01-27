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
import { getUser, listUsers, realtimeAddDoc } from "../../lib/firebaseAction";
import User from "../../components/User";
import Modal from "../../components/Modal";
import {
  createChatRoomCollection,
  replaceAllSpecialChar,
} from "../../lib/utils";

const Users = () => {
  const user = getUser();

  useEffect(() => {
    listUsers(
      (response) => {
        const users = [];
        response.users.forEach((user) => {
          users.push(user.toJSON());
        });
        console.log(users);
        setUsers(users);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const [users, setUsers] = useState([]);
  const [targetUser, setTargetUser] = useState({
    displayName: "",
    email: "",
    phoneNumber: "",
  });
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
    setTargetUser({
      displayName,
      email,
      phoneNumber,
    });
  };

  const invite = () => {
    targetUser.email;
    realtimeAddDoc(
      {
        collectionType:
          "chat/" +
          createChatRoomCollection(user.phoneNumber, targetUser.phoneNumber),
        inputParams: {
          members: {
            [user.phoneNumber]: user.email,
            [targetUser.phoneNumber]: targetUser.email,
          },
          [new Date().getTime() +
          "-" +
          replaceAllSpecialChar(user.email, "_") +
          "-" +
          user.displayName]:
            user.email +
            " (이)가 " +
            targetUser.email +
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

  return (
    <>
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
            <TableCell align="center">INVITE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <User
              key={user.uid}
              displayName={user.displayName}
              email={user.email}
              lastSignInTime={
                user.metadata.lastSignInTime
                  ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                  : "Never"
              }
              phoneNumber={user.phoneNumber}
              handleChat={handleChat}
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
