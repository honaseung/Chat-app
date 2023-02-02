import { TableCell, TableRow } from "@mui/material";

/**
 *
 * @description 사용자를 보여주기 위한 테이블의 헤더 컴포넌트입니다.
 */
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
