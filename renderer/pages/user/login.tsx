import { useState, useEffect } from "react";
import Link from "../../components/Link";
import UserForm from "../../components/UserForm";
import useCreateRequest from "../../lib/create-request";
import { validateEmail, validatePasswod } from "../../lib/validate";
import { useRouter } from "next/router";
import Modal from "../../components/Modal";
import getErrMsg from "../../lib/errMsg";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";
import { listUsers } from "../../lib/firebaseApi";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // const [modalOpen, setModalOpen] = useState(false);
  // const [modalOption, setModalOption] = useState({
  //   title: "",
  //   content: "",
  // });

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
      router.push("users");
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
      {/* <Modal
        title={modalOption.title}
        content={modalOption.content}
        open={modalOpen}
        setOpen={setModalOpen}
      /> */}
    </>
  );
};

export default Login;
