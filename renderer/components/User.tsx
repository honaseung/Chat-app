import { Button, Switch, TableCell, TableRow } from "@mui/material";

const User = ({
  displayName,
  email,
  lastSignInTime,
  phoneNumber,
  handleChat,
}) => {
  return (
    <>
      <TableRow>
        <TableCell align="center">{displayName}</TableCell>
        <TableCell align="center">{email}</TableCell>
        <TableCell align="center">{lastSignInTime}</TableCell>
        <TableCell align="center">{phoneNumber}</TableCell>
        <TableCell align="center">
          <Switch
            // checked={checked}
            onChange={(e) => handleChat(e, { displayName, email, phoneNumber })}
            // inputProps={{ "aria-label": "controlled" }}
          />
          <Button
            onClick={(e) => handleChat(e, { displayName, email, phoneNumber })}
          >
            초대
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default User;
