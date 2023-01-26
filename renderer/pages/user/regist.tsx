import {
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import Link from "../../components/Link";
import UserForm from "../../components/UserForm";
import FirebaseBtn from "../../components/FirebaseBtn";
import Alert from "../../components/Modal";
import useCreateRequest from "../../lib/create-request";

const Regist = () => {
  const [registId, setRegistId] = useState("");
  const [registPassword, setRegistPassword] = useState("");
  const [registPasswordConfirm, setRegistPasswordConfirm] = useState("");
  // const [auth, setAuth] = useState("C");

  const handleValue = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "input-id":
        setRegistId(value);
        break;

      case "input-password":
        setRegistPassword(value);
        break;

      case "input-password-confirm":
        setRegistPasswordConfirm(value);
        break;

      // case "user-password-confirm":
      //   setUserPasswordConfirm(value);
      //   break;

      // case "user-auth":
      //   setAuth(value);
      //   break;

      default:
        break;
    }
  };

  const [registRequest, registCallback] = useCreateRequest(
    "C",
    "set",
    "users",
    {
      id: registId,
      password: registPassword,
    },
    (response) => {
      console.log(response);
    }
  );

  return (
    <>
      <UserForm
        id={registId}
        password={registPassword}
        passwordConfirm={registPasswordConfirm}
        // auth={auth}
        handleValue={handleValue}
        isRegist
        request={registRequest}
        callback={registCallback}
      />
      <Link href="/user/login">GO TO LOGIN</Link>
      <Link href="/home">HOME</Link>
    </>
  );
};

export default Regist;
