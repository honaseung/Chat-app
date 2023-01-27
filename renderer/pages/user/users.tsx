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
import { listtUsers } from "../../lib/firebaseAction";
import User from "../../components/User";
import Modal from "../../components/Modal";

const Users = () => {
  useEffect(() => {
    listtUsers(
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
  // const [targetUsers, setTargetUsers] = useState([]);
  const [modalOption, setModalOption] = useState({
    title: "",
    content: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  // useEffect(() => {
  //   const title = "초대";
  //   let content = "";
  //   targetUsers.forEach((user) => {
  //     content +=
  //       user.id + " " + user.displayName + " " + user.phoneNumber + "\n";
  //   });
  //   setModalOption({ ...modalOption, title });
  // }, [targetUsers]);

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
    const content = info.dispalyName + "(" + info.email + ")";
    const title = checked ? "초대" : "나가기";
    setModalOption({ title, content });
    // if (checked) {
    //   setTargetUsers([...targetUsers, info]);
    // } else {
    //   setTargetUsers(
    //     targetUsers.filter((user) => {
    //       user.email !== info.email;
    //     })
    //   );
    // }
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
      <Button onClick={() => router.push("../chat/rooms")}>INVITE</Button>
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
