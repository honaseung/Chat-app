import { TableCell, TableRow } from "@mui/material";

const UserGridHeader: React.FunctionComponent = () => {
  return (
    <>
      <TableRow sx={{ backgroundColor: "#b2dfdb" }}>
        <TableCell colSpan={5} align="center">
          <h2>USER INFO</h2>
        </TableCell>
      </TableRow>
      <TableRow sx={{ backgroundColor: "#00796b" }}>
        <TableCell align="center">NAME</TableCell>
        <TableCell align="center">ID</TableCell>
        <TableCell align="center">LAST LOGIN</TableCell>
        <TableCell align="center">NUMBER</TableCell>
        <TableCell align="center" width="25px">
          INVITE
        </TableCell>
      </TableRow>
    </>
  );
};

export default UserGridHeader;
