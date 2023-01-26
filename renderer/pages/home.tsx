import { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
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
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleClick = () => setOpen(true);

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
          <Link href="/user/login">Login</Link>
        </Typography>
        <Typography gutterBottom>
          <Link href="/user/regist">Regist</Link>
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleClick}>
          Super Secret Password
        </Button>
      </Root>
    </Fragment>
  );
}

export default Home;
