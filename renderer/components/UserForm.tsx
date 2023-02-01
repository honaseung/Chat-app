import {
  Button,
  ButtonGroup,
  Container,
  Fab,
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import getErrMsg from "../lib/errMsg";
import Modal from "./Modal";
import Link from "./Link";
import { useRouter } from "next/router";

type UserForm = {
  id: string;
  name?: string;
  password: string;
  passwordConfirm?: string;
  number?: string;
  isRegist?: boolean;
  handleValue(e: React.ChangeEvent<HTMLInputElement>, s?: Function): void;
  request(f: Function): void;
  children?: React.ReactNode;
};

const UserForm: React.FunctionComponent<UserForm> = ({
  id,
  name = "",
  password,
  passwordConfirm = "",
  number = "",
  isRegist = false,
  handleValue,
  request,
}) => {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOption, setModalOption] = useState({
    title: "",
    content: "",
  });
  const [idErr, setIdErr] = useState(true);
  const [numberErr, setNumberErr] = useState(true);
  const [passwordErr, setPasswordErr] = useState(true);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(true);

  const openErrModal = (error: any) => {
    const [title, content] = getErrMsg(error.code);
    setModalOption({
      title,
      content,
    });
    setModalOpen(true);
  };

  return (
    <>
      <Container maxWidth="xs" className="user-form-container">
        <img src="/images/login.png" height="280" width="280" />
        <div className="user-form-title">
          {isRegist ? "회원가입" : "로그인"}을 해주세요.
        </div>
        {/* <InputBase type="file" /> */}
        <FormControl fullWidth>
          <InputLabel htmlFor="input-id">ID</InputLabel>
          <FilledInput
            className="user-form-input"
            value={id}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleValue(e, setIdErr)
            }
            name="input-id"
            id="input-id"
            aria-describedby="ID"
            type="email"
            error={idErr}
          />
          <FormHelperText id="ID">
            {idErr ? "email 을 적어주세요." : "올바르게 입력하셨습니다."}
          </FormHelperText>
        </FormControl>
        {isRegist && (
          <FormControl fullWidth>
            <InputLabel htmlFor="input-name">NAME</InputLabel>
            <FilledInput
              className="user-form-input"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleValue(e)
              }
              name="input-name"
              id="input-name"
              aria-describedby="NAME"
            />
            <FormHelperText id="NAME">
              생략시에는 ID 가 이름이 됩니다.
            </FormHelperText>
          </FormControl>
        )}
        {isRegist && (
          <FormControl fullWidth>
            <InputLabel htmlFor="input-number">NUMBER</InputLabel>
            <FilledInput
              className="user-form-input"
              value={number}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleValue(e, setNumberErr)
              }
              name="input-number"
              id="input-number"
              aria-describedby="NUMBER"
              error={numberErr}
            />
            <FormHelperText id="NUMBER">
              {numberErr
                ? "핸드폰 번호를 입력해주세요."
                : "올바르게 입력하셨습니다."}
            </FormHelperText>
          </FormControl>
        )}
        <FormControl fullWidth>
          <InputLabel htmlFor="input-password">PASSWORD</InputLabel>
          <FilledInput
            className="user-form-input"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleValue(e, setPasswordErr)
            }
            name="input-password"
            id="input-password"
            aria-describedby="PASSWORD"
            type="password"
            error={passwordErr}
          />
          <FormHelperText id="PASSWORD">
            {passwordErr
              ? "최소 6자 에서 최대 10자"
              : "올바르게 입력하셨습니다."}
          </FormHelperText>
        </FormControl>
        {isRegist && (
          <FormControl fullWidth>
            <InputLabel htmlFor="input-password-confirm">
              PASSWORD CONFIRM
            </InputLabel>
            <FilledInput
              className="user-form-input"
              value={passwordConfirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleValue(e, setConfirmPasswordErr)
              }
              name="input-password-confirm"
              id="input-password-confirm"
              aria-describedby="PASSWORD-CONFIRM"
              type="password"
              disabled={passwordErr}
              error={confirmPasswordErr}
            />
            <FormHelperText id="PASSWORD-CONFIRM">
              {confirmPasswordErr
                ? "동일하게 적어주세요."
                : "올바르게 입력하셨습니다."}
            </FormHelperText>
          </FormControl>
        )}
        <div className="user-form-button-container">
          <ButtonGroup
            color="primary"
            fullWidth
            size="small"
            variant="contained"
            sx={{ alignContent: "center " }}
          >
            <Button
              color="primary"
              className="user-form-button"
              onClick={() => request(openErrModal)}
              disabled={
                idErr ||
                passwordErr ||
                (isRegist && (confirmPasswordErr || numberErr))
              }
            >
              {isRegist ? "REGIST" : "LOGIN"}
            </Button>
            <Button
              color="info"
              className="user-form-button"
              onClick={() => router.push("/home")}
            >
              HOME
            </Button>
            <Button
              color="secondary"
              onClick={() =>
                router.push(isRegist ? "/user/login" : "/user/regist")
              }
              className="user-form-link"
            >
              {isRegist ? "LOGIN" : "REGIST"}
            </Button>
          </ButtonGroup>
        </div>
      </Container>
      <Modal
        title={modalOption.title}
        content={modalOption.content}
        open={modalOpen}
        setOpen={setModalOpen}
      />
    </>
  );
};

export default UserForm;
