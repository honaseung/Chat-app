import { Button, Switch, TableCell, TableRow } from "@mui/material";
import React from "react";
import { Iuser, defaultUser } from "../type/user";

type UserGridRow = {
  userName: string;
  userId: string;
  lastSignInTime: string;
  phoneNumber: string;
  mine: boolean;
  // online: boolean;
  inviteOne: boolean;
  handleTargetUser(e: React.MouseEvent<HTMLButtonElement>, info: Iuser): void;
  handleTargetUsers(e: React.ChangeEvent<HTMLInputElement>, info: Iuser): void;
  even: boolean;
};

const UserGridRow: React.FunctionComponent<UserGridRow> = ({
  userName,
  userId,
  lastSignInTime,
  phoneNumber,
  mine,
  // online,
  inviteOne,
  handleTargetUser,
  handleTargetUsers,
  even,
}) => {
  return (
    <>
      <TableRow sx={{ backgroundColor: even ? "darkgray" : "whitesmoke" }}>
        <TableCell align="center">{userName}</TableCell>
        <TableCell align="center">{userId}</TableCell>
        <TableCell align="center">{lastSignInTime}</TableCell>
        <TableCell align="center">{phoneNumber}</TableCell>
        <TableCell align="center">
          {mine ? null : inviteOne ? (
            <Button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                handleTargetUser(e, {
                  ...defaultUser,
                  userName,
                  userId,
                  phoneNumber,
                })
              }
            >
              INVITE
            </Button>
          ) : (
            <Switch
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTargetUsers(e, {
                  ...defaultUser,
                  userName,
                  userId,
                  phoneNumber,
                })
              }
            />
          )}
        </TableCell>
        {/* <TableCell align="center">{online ? "ONLINE" : ""}</TableCell> */}
      </TableRow>
    </>
  );
};

export default UserGridRow;
