import { Fragment } from "react";
import Head from "next/head";
import { styled } from "@mui/material";
import UserForm from "./user/userForm";

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
        <UserForm />
      </Root>
    </Fragment>
  );
}

export default Home;
