import { Button, Card, CardContent, Switch, Typography } from "@mui/material";
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
      <Card
        component="li"
        sx={{ backgroundColor: even ? "darkgray" : "whitesmoke" }}
      >
        <CardContent>
          <Typography
            sx={{ textAlign: "right" }}
          >{`${userName}(${userId})`}</Typography>
          <Typography sx={{ textAlign: "right" }}>{phoneNumber}</Typography>
          <Typography sx={{ textAlign: "left" }}>
            {`LAST LOGIN: ${lastSignInTime}`}
            <Typography sx={{ textAlign: "right" }}>
              {mine ? (
                "ME"
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
            </Typography>
          </Typography>
          {/* <TableCell align="center">{online ? "ONLINE" : ""}</TableCell> */}
        </CardContent>
      </Card>
    </>
  );
};

export default UserGridRow;
