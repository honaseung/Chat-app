import { Fragment } from "react";
import Head from "next/head";
import Typography from "@mui/material/Typography";
import Link from "../components/Link";
import { styled } from "@mui/material";

const Root = styled("div")(({ theme }) => {
  return {
    textAlign: "center",
    paddingTop: theme.spacing(4),
  };
});

function Home() {
  return (
    <Fragment>
      <Head>
        <title>Chat App - Nextron and firebase</title>
      </Head>
      <Root>
        <Typography variant="h4" gutterBottom>
          Let's CHAT
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          (made by nextron and firebase)
        </Typography>
        <img src="/images/chat-logo.png" />
        <Typography gutterBottom>
          <Link href="/user/userForm">Login/Regist</Link>
        </Typography>
        <Typography gutterBottom></Typography>
      </Root>
    </Fragment>
  );
}

export default Home;
