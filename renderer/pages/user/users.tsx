import InviteSnackbar from "../../components/common/InviteSnackbar";
import Users from "../../components/user/Users";

/**
 *
 * @description 유저 페이지 컨테이너 컴포넌트입니다.
 */
const UsersContainer: React.FunctionComponent = () => {
  return (
    <>
      <Users />
      <InviteSnackbar />
    </>
  );
};

export default UsersContainer;
