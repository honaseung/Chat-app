import { useState, Dispatch, SetStateAction } from "react";
import Link from "../../components/Link";
import UserForm from "../../components/UserForm";
import { validateEmail, validatePasswod } from "../../lib/validate";
import { useRouter } from "next/router";
import { loginUser } from "../../lib/firebaseApi";
import Loading from "../../components/Loading";
import { defaultUser } from "../../type/user";
import { Fab } from "@mui/material";

const Login: React.FunctionComponent = () => {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    setErr: Dispatch<SetStateAction<boolean>> = () => {}
  ) => {
    const { name, value } = e.target;
    switch (name) {
      case "input-id":
        if (!validateEmail(value)) {
          setErr(true);
        } else {
          setErr(false);
        }
        setLoginId(value);
        break;

      case "input-password":
        if (!validatePasswod(value)) {
          setErr(true);
        } else {
          setErr(false);
        }
        setLoginPassword(value);
        break;

      default:
        break;
    }
  };

  const login = (failCallback: Function) => {
    setLoading(true);
    loginUser(
      {
        userParam: { ...defaultUser, email: loginId, password: loginPassword },
      },
      (response: string) => {
        setLoading(false);
        router.push("users", { query: { tokenExpireTime: response } });
      },
      (error: any) => {
        setLoading(false);
        failCallback(error);
        console.log(error);
      }
    );
  };

  return (
    <>
      <UserForm
        id={loginId}
        password={loginPassword}
        handleValue={handleValue}
        request={login}
      />
      {loading && <Loading />}
    </>
  );
};

export default Login;
