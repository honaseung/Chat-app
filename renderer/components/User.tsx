import { Switch, TableCell, TableRow } from "@mui/material";

const User = ({
  displayName,
  email,
  lastSignInTime,
  phoneNumber,
  handleChat,
  mine,
}) => {
  return (
    <>
      <TableRow>
        <TableCell align="center">{displayName}</TableCell>
        <TableCell align="center">{email}</TableCell>
        <TableCell align="center">{lastSignInTime}</TableCell>
        <TableCell align="center">{phoneNumber}</TableCell>
        {/* <TableCell align="center">ONLINE</TableCell> */}
        <TableCell align="center">
          {!mine && (
            <Switch
              onChange={(e) =>
                handleChat(e, { displayName, email, phoneNumber })
              }
            />
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export default User;
