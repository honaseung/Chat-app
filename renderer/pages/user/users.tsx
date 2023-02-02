import InviteSnackbar from "../../components/common/InviteSnackbar";
import Users from "../../components/user/Users";

const UsersContainer: React.FunctionComponent = () => {
  return (
    <>
      <Users />
      <InviteSnackbar />
    </>
  );
};

export default UsersContainer;
