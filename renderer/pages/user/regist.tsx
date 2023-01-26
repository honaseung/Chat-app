import { useState } from "react";
import Link from "../../components/Link";
import UserForm from "../../components/UserForm";
import useCreateRequest from "../../lib/create-request";
import { validateEmail, validatePasswod } from "../../lib/validate";

const Regist = () => {
  const [registId, setRegistId] = useState("");
  const [registPassword, setRegistPassword] = useState("");
  const [registPasswordConfirm, setRegistPasswordConfirm] = useState("");
  // const [auth, setAuth] = useState("C");

  const handleValue = (e, setErr) => {
    const { name, value } = e.target;
    switch (name) {
      case "input-id":
        if (!validateEmail(value)) {
          setErr(true);
        } else {
          setErr(false);
        }
        setRegistId(value);
        break;

      case "input-password":
        if (!validatePasswod(value)) {
          setErr(true);
        } else {
          setErr(false);
        }
        setRegistPassword(value);
        setRegistPasswordConfirm("");
        break;

      case "input-password-confirm":
        if (value !== registPassword) {
          setErr(true);
        } else {
          setErr(false);
        }
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

  const [registRequest, registSucCallback] = useCreateRequest(
    "U",
    "set",
    "",
    {
      id: registId,
      password: registPassword,
    },
    [],
    (response) => {
      console.log(response);
    },
    null
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
        sucCallback={registSucCallback}
      />
      <Link href="/user/login">GO TO LOGIN</Link>
      <Link href="/home">HOME</Link>
    </>
  );
};

export default Regist;
