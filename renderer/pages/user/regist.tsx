import { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";
import Link from "../../components/Link";
import Loading from "../../components/Loading";
import UserForm from "../../components/UserForm";
import { registUser } from "../../lib/firebaseApi";
import {
  validateEmail,
  validatePasswod,
  validatePhoneNumber,
} from "../../lib/validate";
import { defaultUser } from "../../type/user";

const Regist: React.FunctionComponent = () => {
  const [registId, setRegistId] = useState("");
  const [registName, setRegistName] = useState("");
  const [registPassword, setRegistPassword] = useState("");
  const [registPhoneNumber, setRegistPhoneNumber] = useState("");
  const [registPasswordConfirm, setRegistPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    setErr: Dispatch<SetStateAction<boolean>>
  ) => {
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

  const regist = (failCallback: Function) => {
    setLoading(true);
    registUser(
      {
        userParam: {
          ...defaultUser,
          email: registId,
          displayName: registName ? registName : registId.split("@")[0],
          phoneNumber: `+82${registPhoneNumber.slice(1)}`,
          password: registPassword,
        },
      },
      () => {
        setLoading(false);
        router.push("login", undefined, { shallow: true });
      },
      (error: object) => {
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
      {loading && <Loading />}
    </>
  );
};

export default Regist;
