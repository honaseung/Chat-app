import {
  Button,
  Card,
  CardContent,
  Switch,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { Iuser, defaultUser } from "../../type/user";

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
};

const UserGridRow: React.FunctionComponent<UserGridRow> = ({
  userName,
  userId,
  lastSignInTime,
  phoneNumber,
  mine,
  inviteOne,
  handleTargetUser,
  handleTargetUsers,
}) => {
  return (
    <>
      <TableCell sx={{ textAlign: "center" }}>{userName}</TableCell>
      <TableCell sx={{ textAlign: "center" }}>{userId}</TableCell>
      <TableCell sx={{ textAlign: "center" }}>{lastSignInTime}</TableCell>
      <TableCell sx={{ textAlign: "center" }}>{phoneNumber}</TableCell>
      <TableCell sx={{ textAlign: "right" }}>
        {mine ? (
          <Typography
            sx={{
              textAlign: "right",
              fontSize: "16px",
              color: "green",
              fontWeight: 1000,
              pr: 1.5,
            }}
          >
            "ME"
          </Typography>
        ) : inviteOne ? (
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
    </>
  );
};

export default UserGridRow;
