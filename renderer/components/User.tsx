import { Switch, TableCell, TableRow } from "@mui/material";

type User = {
  userName: string,
  userId: string,
  lastSignInTime: string,
  phoneNumber: string,
  handleChat: Function,
  mine: boolean,
}

const User: React.FunctionComponent<User> = ({
  userName,
  userId,
  lastSignInTime,
  phoneNumber,
  handleChat,
  mine,
}) => {
  return (
    <>
      <TableRow>
        <TableCell align="center">{userName}</TableCell>
        <TableCell align="center">{userId}</TableCell>
        <TableCell align="center">{lastSignInTime}</TableCell>
        <TableCell align="center">{phoneNumber}</TableCell>
        {/* <TableCell align="center">ONLINE</TableCell> */}
        <TableCell align="center">
          {!mine && (
            <Switch
              onChange={(e) =>
                handleChat(e, { userName, userId, phoneNumber })
              }
            />
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default User;
