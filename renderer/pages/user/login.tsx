import { useState } from "react";
import Link from "next/link";
import UserForm from "../../components/UserForm";
import FirebaseBtn from "../../components/FirebaseBtn";
import useCreateRequest from "../../lib/create-request";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleValue = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "input-id":
        setLoginId(value);
        break;

      case "input-password":
        setLoginPassword(value);
        break;

      default:
        break;
    }
  };

  const [loginRequest, loginCallback, loginCondition] = useCreateRequest(
    "C",
    "get",
    "users",
    {
      id: loginId,
      password: loginPassword,
    },
    (response) => {
      console.log(response);
    },
    ["id", "==", loginId, "password", "==", loginPassword]
  );

  return (
    <>
      <UserForm
        id={loginId}
        password={loginPassword}
        handleValue={handleValue}
        request={loginRequest}
        callback={loginCallback}
        condition={loginCondition}
      />
      <Link href="/user/regist">GO TO REGIST</Link>
      <Link href="/home">HOME</Link>
    </>
  );
};

export default Login;
