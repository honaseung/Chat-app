import OpenRooms from "../../components/room/OpenRooms";
import InviteSnackbar from "../../components/common/InviteSnackbar";

/**
 *
 * @description 오픈 채팅방의 컨테이너 컴포넌트입니다.
 */
const openRoomsConatiner: React.FunctionComponent = () => {
  return (
    <>
      <OpenRooms />
      <InviteSnackbar />
    </>
  );
};

export default openRoomsConatiner;
