import { Button, ButtonGroup, TableCell, TableRow } from "@mui/material";
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
  invite,
  inviteOne,
  setInviteOne,
  userInfo,
}) => {
  return (
    <>
      <ButtonGroup size="large" variant="contained" fullWidth>
        <Button
          sx={{ backgroundColor: "#01579b" }}
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
          sx={{ backgroundColor: "#311b92" }}
        >
          INVITE
        </Button>
      </ButtonGroup>
    </>
  );
};

export default UserGridButton;
