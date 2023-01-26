import {
  Container,
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import FirebaseBtn from "./FirebaseBtn";
import useCreateRequest from "../lib/create-request";
import Modal from "./Modal";

const UserForm = ({
  id,
  password,
  passwordConfirm = "",
  // auth,
  isRegist = false,
  handleValue,
  request,
  callback,
  condition = [],
}) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [checkIdRequest, checkIdCallback, checkIdCondition] = useCreateRequest(
    "C",
    "get",
    "users",
    {
      id,
      password,
    },
    (response) => {
      console.log(response);
      if (response.docs.length > 0) {
        setAlertOpen(true);
      }
    },
    id ? ["id", "==", id] : []
  );
  return (
    <>
      <Container maxWidth="xs">
        <FormControl>
          <InputLabel htmlFor="input-id">ID</InputLabel>
          <FilledInput
            value={id}
            onChange={(e) => handleValue(e)}
            name="input-id"
            id="input-id"
            aria-describedby="ID"
          />
          <FormHelperText id="ID">Let us know your ID.</FormHelperText>
          {isRegist && (
            <FirebaseBtn
              request={checkIdRequest}
              callback={checkIdCallback}
              condition={checkIdCondition}
            >
              CHECK ID
            </FirebaseBtn>
          )}
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="input-password">PASSWORD</InputLabel>
          <FilledInput
            value={password}
            onChange={(e) => handleValue(e)}
            name="input-password"
            id="input-password"
            aria-describedby="PASSWORD"
            type="password"
          />
          <FormHelperText id="PASSWORD">
            We won't share your password.
          </FormHelperText>
        </FormControl>
        {isRegist && (
          <FormControl>
            <InputLabel htmlFor="input-password-confirm">
              PASSWORD CONFIRM
            </InputLabel>
            <FilledInput
              value={passwordConfirm}
              onChange={(e) => handleValue(e)}
              name="input-password-confirm"
              id="input-password-confirm"
              aria-describedby="PASSWORD-CONFIRM"
              type="password"
            />
            <FormHelperText id="PASSWORD-CONFIRM">
              Please Confirm your password.
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
      <FirebaseBtn request={request} callback={callback} condition={condition}>
        {isRegist ? "REGIST" : "LOGIN"}
      </FirebaseBtn>
      <Modal
        title="ID 중복"
        content="이미 존재하는 ID 입니다."
        open={alertOpen}
        setOpen={setAlertOpen}
      />
    </>
  );
};

export default UserForm;
