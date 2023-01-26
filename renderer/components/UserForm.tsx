import {
  Container,
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import FirebaseButton from "./FirebaseButton";
import Modal from "./Modal";

const UserForm = ({
  id,
  password,
  passwordConfirm = "",
  // auth,
  isRegist = false,
  handleValue,
  request,
  sucCallback,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOption, setModalOption] = useState({
    title: "",
    content: "",
  });
  const [idErr, setIdErr] = useState(true);
  const [passwordErr, setPasswordErr] = useState(true);
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(true);

  const openModal = (param) => {
    setModalOption({
      title: param.code,
      content: param.message,
    });
  };
  return (
    <>
      <Container maxWidth="xs">
        <FormControl>
          <InputLabel htmlFor="input-id">ID</InputLabel>
          <FilledInput
            value={id}
            onChange={(e) => handleValue(e, setIdErr)}
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
        <FormControl>
          <InputLabel htmlFor="input-password">PASSWORD</InputLabel>
          <FilledInput
            value={password}
            onChange={(e) => handleValue(e, setPasswordErr)}
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
          <FormControl>
            <InputLabel htmlFor="input-password-confirm">
              PASSWORD CONFIRM
            </InputLabel>
            <FilledInput
              value={passwordConfirm}
              onChange={(e) => handleValue(e, setConfirmPasswordErr)}
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
          // <FormControl>
          //   <InputLabel id="select-auth-label">AUTH</InputLabel>
          //   <Select
          //     labelId="select-auth-label"
          //     id="select-auth"
          //     value={auth}
          //     label="AUTH"
          //     onChange={(e) => handleValue(e)}
          //     name="user-auth"
          //   >
          //     <MenuItem value="C">COMMON</MenuItem>
          //     <MenuItem value="A">ADMIN</MenuItem>
          //   </Select>
          // </FormControl>
        )}
      </Container>
      <FirebaseButton
        request={request}
        sucCallback={sucCallback}
        failCallback={openModal}
        disabled={idErr || passwordErr || (isRegist && confirmPasswordErr)}
      >
        {isRegist ? "REGIST" : "LOGIN"}
      </FirebaseButton>
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
