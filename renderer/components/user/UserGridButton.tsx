import { Button, ButtonGroup } from "@mui/material";
import { useRouter } from "next/router";

import { Iuser, defaultUser } from "../../type/user";
import { logoutUser } from "../../lib/firebaseApi";

type UserGridButton = {
  targetUsers: Iuser[];
  setTargetUsers(i: Iuser[]): void;
  setLoading(b: boolean): void;
  invite(): void;
  inviteOne: boolean;
  setInviteOne(b: boolean);
  userInfo: Iuser;
};

const UserGridButton: React.FunctionComponent<UserGridButton> = ({
  targetUsers,
  setTargetUsers,
  setLoading,
  invite,
  inviteOne,
  setInviteOne,
  userInfo,
}) => {
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
  return (
    <>
      <ButtonGroup size="large" variant="contained" fullWidth>
        <Button color="error" onClick={logout}>
          LOGOUT
        </Button>
        <Button
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
          {inviteOne ? "1:1 CHAT" : "GROUP"}
        </Button>
        <Button
          color="warning"
          className="btn"
          disabled={
            targetUsers.length === 1 || targetUsers.length === 2 || inviteOne
          }
          onClick={invite}
        >
          INVITE
        </Button>
      </ButtonGroup>
    </>
  );
};

export default UserGridButton;
