import { useRouter } from "next/router";
import { useState } from "react";
import Link from "../../components/Link";
import Loading from "../../components/Loading";
import UserForm from "../../components/UserForm";
import { registUser } from "../../lib/firebaseApi";
import {
  validateEmail,
  validatePasswod,
  validatePhoneNumber,
} from "../../lib/validate";

const Regist = () => {
  const [registId, setRegistId] = useState("");
  const [registName, setRegistName] = useState("");
  const [registPassword, setRegistPassword] = useState("");
  const [registPhoneNumber, setRegistPhoneNumber] = useState("");
  const [registPasswordConfirm, setRegistPasswordConfirm] = useState("");

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
        setRegistId(value);
        break;

      case "input-name":
        setRegistName(value);
        break;

      case "input-number":
        if (!validatePhoneNumber(value)) {
          setErr(true);
        } else {
          setErr(false);
        }
        setRegistPhoneNumber(value);
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

      default:
        break;
    }
  };

  const regist = (failCallback) => {
    setLoading(true);
    registUser(
      {
        inputParams: {
          email: registId,
          displayName: registName ? registName : registId.split("@")[0],
          phoneNumber: "+82" + registPhoneNumber.slice(1),
          password: registPassword,
        },
      },
      () => {
        setLoading(false);
        router.push("login");
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
        id={registId}
        password={registPassword}
        passwordConfirm={registPasswordConfirm}
        number={registPhoneNumber}
        name={registName}
        handleValue={handleValue}
        isRegist
        request={regist}
      />
      <Link href="/user/login">GO TO LOGIN</Link>
      <Link href="/home">HOME</Link>
      {loading && <Loading />}
    </>
  );
};

export default Regist;
