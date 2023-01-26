import { useState } from "react";
import Link from "next/link";
import UserForm from "../../components/UserForm";
import useCreateRequest from "../../lib/create-request";
import { validateEmail, validatePasswod } from "../../lib/validate";
import Modal from "../../components/Modal";
import { useRouter } from "next/router";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const router = useRouter();

  const handleValue = (e, setErr) => {
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

  const [loginRequest, loginSucCallback] = useCreateRequest(
    "U",
    "get",
    "",
    {
      id: loginId,
      password: loginPassword,
    },
    [],
    (response) => {
      console.log(response);
      // router.push();
    },
    null
  );

  return (
    <>
      <UserForm
        id={loginId}
        password={loginPassword}
        handleValue={handleValue}
        request={loginRequest}
        sucCallback={loginSucCallback}
      />
      <Link href="/user/regist">GO TO REGIST</Link>
      <Link href="/home">HOME</Link>
    </>
  );
};

export default Login;
