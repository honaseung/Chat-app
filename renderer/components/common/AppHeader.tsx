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
  Menu,
  Typography,
} from "@mui/material";
import { getUser, logoutUser } from "../../lib/firebaseApi";
import { useRouter } from "next/router";
import Link from "../Link";
import {
  AccountCircle,
  Chat,
  ChatBubble,
  Home,
  VerticalAlignCenter,
} from "@mui/icons-material";

const AppHeader: React.FunctionComponent = () => {
  const userInfo = getUser();
  const router = useRouter();
  const path = router.pathname;
  const query = router.query;

  const [roomId, setRoomId] = useState<string | number>(0);
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
              <Button onClick={() => setDrawer(true)}>메뉴</Button>
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
                fontSize: "36px",
                color: "whitesmoke",
                verticalAlign: "middle",
              }}
            >{`${userInfo.displayName}(${userInfo.email})`}</Typography>
            <ButtonGroup>
              <Button onClick={() => router.back()}>뒤로가기</Button>
              <Button onClick={logout}>로그아웃</Button>
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
