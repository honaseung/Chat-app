import { Fab, Table, TableBody, TableHead } from "@mui/material";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  getUser,
  listUsers,
  logoutUser,
  realtimeInviteRoom,
  realtimeOnlineUserListenOff,
} from "../../lib/firebaseApi";

import User from "../../components/User";
import InviteModal from "../../components/InviteModal";
import Loading from "../../components/Loading";
import { ListUsersResult } from "firebase-admin/lib/auth/base-auth";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { SetStateAction } from "react";
import { Iuser, defaultUser } from "../../type/user";

import InviteSnackbar from "../../components/IniviteSnackbar";
import UserData from "../../components/UserData";

const Users: React.FunctionComponent = () => {
  const router = useRouter();
  const userInfo: Iuser = getUser();

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

    // const tokenExpireTime = router.query.tokenExpireTime;
    // if (tokenExpireTime) {
    //   setModalOption({
    //     title: "로그인 성공",
    //     content: `토큰 만료시간은 ${tokenExpireTime} 입니다.`,
    //   });
    //   setModalOpen(true);
    // }

    // realtimeOnlineUserListenOn(() => {
    //   getOnlineUsers((response) => {
    //     setOnlineUsers(response.val());
    //   });
    // });
  }, []);

  const [users, setUsers] = useState<Iuser[]>([]);
  // const [onlineUsers, setOnlineUsers] = useState<object>({});
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
  // const [modalOption, setModalOption] = useState({
  //   title: "",
  //   content: "",
  // });
  const [inviteModalOption, setInviteModalOption] = useState({
    title: "",
    content: "",
  });

  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const logout = () => {
    setLoading(true);
    logoutUser(
      () => {
        realtimeOnlineUserListenOff();
        router.push("/home", undefined, { shallow: true });
        setLoading(false);
      },
      (error: any) => {
        console.log(error);
        setLoading(false);
      }
    );
  };

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
      content: `${userInfo.displayName} 와 ${userName} 를 초대합니다.`,
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
        .join(" 와\n ")} 를 초대합니다.`,
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
                " (을)를 " +
                "초대하였습니다.",
            },
          ],
          members: targetUsers,
          created: createdTime,
        },
      },
      () => {
        setLoading(false);
        realtimeOnlineUserListenOff();
        router.push("../chat/rooms", undefined, { shallow: true });
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
            <Fab color="error" onClick={logout}>
              LOGOUT
            </Fab>
            <Fab
              color="info"
              onClick={() => {
                setTargetUsers([
                  {
                    ...defaultUser,
                    phoneNumber: userInfo?.phoneNumber,
                    userId: userInfo?.email,
                    userName: userInfo?.displayName,
                  },
                ]);
                setInviteOne(!inviteOne);
              }}
            >
              {inviteOne ? "1:1 CHAT" : "GROUP CHAT"}
            </Fab>
            <Fab
              color="warning"
              className="btn"
              disabled={targetUsers.length === 1}
              onClick={invite}
            >
              INVITE
            </Fab>
            <Fab color="success" onClick={() => router.push("../chat/rooms")}>
              ROOMS
            </Fab>
          </div>
          <Table>
            <TableHead>
              <UserData />
            </TableHead>
            <TableBody>
              {users.map((u: Iuser) => (
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
                  mine={u.email === userInfo?.email}
                  inviteOne={inviteOne}
                  handleTargetUser={handleTargetUser}
                  handleTargetUsers={handleTargetUsers}
                />
              ))}
            </TableBody>
          </Table>
          {/* <Modal
            title={modalOption.title}
            content={modalOption.content}
            open={modalOpen}
            setOpen={setModalOpen}
          /> */}
          <InviteModal
            content={inviteModalOption.content}
            open={inviteModalOpen}
            setOpen={setInviteModalOpen}
            onConfirm={confirmInvite}
            roomTitle={roomTitle}
            setRoomTitle={setRoomTitle}
          />
          <InviteSnackbar />
        </>
      )}
    </>
  );
};

export default Users;
