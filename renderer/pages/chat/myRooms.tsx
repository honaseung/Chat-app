import MyRooms from "../../components/room/MyRooms";
import InviteSnackbar from "../../components/common/InviteSnackbar";

/**
 *
 * @description 내가 참여중인 방의 컨테이너 컴포넌트입니다.
 */
const myRoomsConatiner: React.FunctionComponent = () => {
  return (
    <>
      <MyRooms />
      <InviteSnackbar />
    </>
  );
};

export default myRoomsConatiner;
