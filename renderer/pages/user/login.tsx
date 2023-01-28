import { useState } from "react";
import Link from "../../components/Link";
import UserForm from "../../components/UserForm";
import { validateEmail, validatePasswod } from "../../lib/validate";
import { useRouter } from "next/router";
import { loginUser } from "../../lib/firebaseApi";
import Loading from "../../components/Loading";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [loading, setLoading] = useState(false);

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

  const login = (failCallback) => {
    setLoading(true);
    loginUser(
      { inputParams: { id: loginId, password: loginPassword } },
      () => {
        setLoading(false);
        router.push("users");
      },
      (error) => {
        setLoading(false);
        failCallback(error);
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
      <Link href="/user/regist">GO TO REGIST</Link>
      <Link href="/home">HOME</Link>
      {loading && <Loading />}
    </>
  );
};

export default Login;
