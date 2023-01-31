import { Switch, TableCell, TableRow } from "@mui/material";
import React from "react";

type User = {
  userName: string;
  userId: string;
  lastSignInTime: string;
  phoneNumber: string;
  handleChat(e: React.ChangeEvent<HTMLInputElement>, i: any): void;
  mine: boolean;
  online: boolean;
};

const User: React.FunctionComponent<User> = ({
  userName,
  userId,
  lastSignInTime,
  phoneNumber,
  handleChat,
  mine,
  online,
}) => {
  return (
    <>
      <TableRow>
        <TableCell align="center">{userName}</TableCell>
        <TableCell align="center">{userId}</TableCell>
        <TableCell align="center">{lastSignInTime}</TableCell>
        <TableCell align="center">{phoneNumber}</TableCell>
        <TableCell align="center">
          {!mine && (
            <Switch
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChat(e, { userName, userId, phoneNumber })
              }
            />
          )}
        </TableCell>
        <TableCell align="center">{online ? "ONLINE" : ""}</TableCell>
      </TableRow>
    </>
  );
};

export default User;
