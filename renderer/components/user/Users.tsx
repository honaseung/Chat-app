import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { useState, useEffect } from "react";
import { getUser, listUsers, realtimeInviteRoom } from "../../lib/firebaseApi";

import InviteModal from "../common/InviteModal";
import { ListUsersResult } from "firebase-admin/lib/auth/base-auth";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { SetStateAction } from "react";
import { Iuser, defaultUser } from "../../type/user";

import UserGridRow from "./UserGridRow";
import UserGridButton from "./UserGridButton";
import Loading from "../common/Loading";
import UserGridHeader from "./UserGridHeader";

const Users: React.FunctionComponent = () => {
  const userInfo: Iuser = getUser();
  const [loading, setLoading] = useState(false);

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
  const [targetUsers, setTargetUsers] = useState<Iuser[]>([
    {
      ...defaultUser,
      phoneNumber: userInfo?.phoneNumber,
      userId: userInfo?.email,
      userName: userInfo?.displayName,
    },
  ]);

  const [inviteOne, setInviteOne] = useState(false);

  const [roomTitle, setRoomTitle] = useState<string>("");
  const [inviteModalOption, setInviteModalOption] = useState({
    title: "",
    content: "",
  });

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const handleTargetUser = (
    e: React.MouseEvent<HTMLButtonElement>,
    info: Iuser
  ) => {
    const { userName, userId, phoneNumber } = info;
    setTargetUsers(
      targetUsers.concat([{ ...defaultUser, userName, userId, phoneNumber }])
    );
    setInviteModalOption({
      title: "초대",
      content: `${userInfo.displayName} 와 ${userName} 의 방을 만듭니다.`,
    });
    setInviteModalOpen(true);
  };

  const handleTargetUsers = (
    e: React.ChangeEvent<HTMLInputElement>,
    info: Iuser
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
    setInviteModalOption({
      title: "초대",
      content: `${targetUsers
        .map((user) => user.userName)
        .join(" 와\n ")} 의 방을 만듭니다.`,
    });
    setInviteModalOpen(true);
  };

  const confirmInvite = () => {
    setLoading(true);
    const createdTime = Date.now();
    realtimeInviteRoom(
      {
        collectionType: "chat/" + createdTime,
        roomParam: {
          title: roomTitle,
          messages: [
            {
              userId: userInfo.email,
              userName: userInfo.displayName,
              prevDate: 0,
              date: createdTime,
              text:
                userInfo.displayName +
                "(" +
                userInfo.email +
                ")" +
                " (이)가 " +
                targetUsers.map((user) => user.userName).join(" 와\n ") +
                " 의 방을 " +
                "만들었습니다.",
            },
          ],
          members: targetUsers,
          created: createdTime,
        },
      },
      () => {
        setLoading(false);
        setRoomTitle("");
        setInviteModalOpen(false);
      },
      (error: any) => {
        setLoading(false);
        setRoomTitle("");
        setInviteModalOpen(false);
        console.log(error);
      }
    );
  };

  return (
    <>
      {loading && <Loading />}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>
              <UserGridButton
                targetUsers={targetUsers}
                setTargetUsers={setTargetUsers}
                setLoading={setLoading}
                invite={invite}
                inviteOne={inviteOne}
                setInviteOne={setInviteOne}
                userInfo={userInfo}
              />
            </TableCell>
          </TableRow>
          <UserGridHeader />
        </TableHead>
        <TableBody>
          {users.map((u: Iuser, idx: number) => (
            <TableRow
              sx={{ backgroundColor: idx % 2 ? "#78909c" : "#cfd8dc" }}
              key={idx}
            >
              <UserGridRow
                key={u.uid}
                userName={u.displayName}
                userId={u.email}
                lastSignInTime={
                  u.metadata.lastSignInTime
                    ? new Date(u.metadata.lastSignInTime).toLocaleDateString()
                    : "Never"
                }
                phoneNumber={u.phoneNumber}
                mine={u.email === userInfo?.email}
                inviteOne={inviteOne}
                handleTargetUser={handleTargetUser}
                handleTargetUsers={handleTargetUsers}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InviteModal
        content={inviteModalOption.content}
        open={inviteModalOpen}
        setOpen={setInviteModalOpen}
        onConfirm={confirmInvite}
        roomTitle={roomTitle}
        setRoomTitle={setRoomTitle}
        handleClose={setRoomTitle}
      />
    </>
  );
};

export default Users;
