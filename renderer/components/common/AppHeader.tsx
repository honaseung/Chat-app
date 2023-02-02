import { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { getUser, logoutUser } from "../../lib/firebaseApi";
import { useRouter } from "next/router";
import {
  AccountCircle,
  ArrowBackIosNewSharp,
  Chat,
  ChatBubble,
  Home,
  LogoutSharp,
  Menu,
} from "@mui/icons-material";

/**
 * @description 헤더 컴포넌트입니다. 메뉴, 뒤로가기, 로그아웃 버튼과 앱 이름, 유저 정보를 담고 있습니다.
 */
const AppHeader: React.FunctionComponent = () => {
  const userInfo = getUser();
  const router = useRouter();

  const [drawer, setDrawer] = useState(false);

  const logout = () => {
    logoutUser(
      () => {
        router.replace("/home", undefined, { shallow: true });
      },
      (error: any) => {
        console.log(error);
      }
    );
  };

  return (
    <>
      {userInfo ? (
        <>
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#3f50b5",
              height: "9vh",
            }}
          >
            <ButtonGroup>
              <Button
                onClick={() => setDrawer(true)}
                startIcon={<Menu />}
                variant="text"
                sx={{ color: "#9fa8da" }}
              >
                메뉴
              </Button>
            </ButtonGroup>
            <Typography
              component="p"
              sx={{
                fontSize: "36px",
                color: "darkgray",
                fontStyle: "italic",
                fontWeight: 1000,
                verticalAlign: "middle",
                lineHeight: 2.5,
              }}
            >
              📌 LET's CHAT
            </Typography>
            <Typography
              component="div"
              sx={{
                color: "whitesmoke",
                top: "0.5vh",
                right: "1.5vw",
                position: "absolute",
              }}
            >{`${userInfo.displayName}(${userInfo.email})`}</Typography>
            <ButtonGroup>
              <Button
                startIcon={<ArrowBackIosNewSharp />}
                onClick={() => router.back()}
                variant="text"
                sx={{ color: "#9fa8da" }}
              >
                뒤로가기
              </Button>
              <Button
                startIcon={<LogoutSharp />}
                onClick={logout}
                variant="text"
                sx={{ color: "#9fa8da" }}
              >
                로그아웃
              </Button>
            </ButtonGroup>
          </Box>
          <Drawer
            PaperProps={{ sx: { backgroundColor: "darkgray" } }}
            anchor="left"
            open={drawer}
            onClose={() => setDrawer(false)}
          >
            <Box
              role="presentation"
              color="black"
              onClick={() => setDrawer(false)}
              sx={{
                backgroundColor: "darkgray",
              }}
            >
              <List sx={{ backgroundColor: "darkgray", color: "white" }}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      router.push("/main");
                    }}
                  >
                    <Home />
                    <ListItemText primary="메인 화면" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      router.push("/user/users");
                    }}
                  >
                    <AccountCircle />
                    <ListItemText primary="유저 리스트" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      router.push("/chat/myRooms");
                    }}
                  >
                    <Chat />
                    <ListItemText primary="참여중인 채팅방 리스트" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      router.push("/chat/openRooms");
                    }}
                  >
                    <ChatBubble />
                    <ListItemText primary="오픈 채팅방 리스트" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Drawer>
        </>
      ) : null}
    </>
  );
};

export default AppHeader;
