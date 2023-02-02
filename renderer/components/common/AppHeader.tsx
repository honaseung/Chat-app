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
  MenuBookSharp,
} from "@mui/icons-material";

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
              height: 100,
            }}
          >
            <ButtonGroup>
              <Button
                onClick={() => setDrawer(true)}
                startIcon={<MenuBookSharp />}
                variant="text"
                sx={{ color: "black" }}
              >
                메뉴
              </Button>
            </ButtonGroup>
            <Typography
              component="div"
              sx={{
                fontSize: "36px",
                color: "darkgray",
                fontStyle: "italic",
                fontWeight: 1000,
                verticalAlign: "middle",
              }}
            >
              📌 LET's CHAT
            </Typography>
            <Typography
              component="div"
              sx={{
                color: "whitesmoke",
                right: 0,
                position: "absolute",
              }}
            >{`${userInfo.displayName}(${userInfo.email})`}</Typography>
            <ButtonGroup>
              <Button
                startIcon={<ArrowBackIosNewSharp />}
                onClick={() => router.back()}
                variant="text"
                sx={{ color: "black" }}
              >
                뒤로가기
              </Button>
              <Button
                startIcon={<LogoutSharp />}
                onClick={logout}
                variant="text"
                sx={{ color: "black" }}
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
