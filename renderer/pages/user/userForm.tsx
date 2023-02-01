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
import { Dispatch, SetStateAction, useState } from "react";
import getErrMsg from "../../lib/errMsg";
import Modal from "../../components/Modal";
import Link from "../../components/Link";
import { useRouter } from "next/router";
import {
  validateEmail,
  validatePasswod,
  validatePhoneNumber,
} from "../../lib/validate";
import { loginUser, registUser } from "../../lib/firebaseApi";
import { defaultUser } from "../../type/user";
import Loading from "../../components/Loading";

type UserForm = {};

const UserForm: React.FunctionComponent<UserForm> = ({}) => {
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOption, setModalOption] = useState({
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [isRegist, setIsRegist] = useState(false);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [idErr, setIdErr] = useState(true);
  const [phoneNumberErr, setPhoneNumberErr] = useState(true);
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

  const handleValue = (
    name: string,
    value?: string,
    setErr?: Dispatch<SetStateAction<boolean>>
  ) => {
    switch (name) {
      case "input-id":
        if (!validateEmail(value)) {
          setErr(true);
        } else {
          setErr(false);
        }
        setId(value);
        break;

      case "input-name":
        setName(value);
        break;

      case "input-number":
        if (!validatePhoneNumber(value)) {
          setErr(true);
        } else {
          setErr(false);
        }
        setPhoneNumber(value);
        break;

      case "input-password":
        if (!validatePasswod(value)) {
          setErr(true);
        } else {
          setErr(false);
        }
        setPassword(value);
        setPasswordConfirm("");
        break;

      case "input-password-confirm":
        if (value !== password) {
          setErr(true);
        } else {
          setErr(false);
        }
        setPasswordConfirm(value);
        break;

      case "reset":
        setId("");
        setName("");
        setPhoneNumber("");
        setPassword("");
        setPasswordConfirm("");

      default:
        break;
    }
  };

  const request = () => {
    if (isRegist) regist();
    else login();
  };

  const regist = () => {
    setLoading(true);
    registUser(
      {
        userParam: {
          ...defaultUser,
          email: id,
          displayName: name ? name : id.split("@")[0],
          phoneNumber: `+82${phoneNumber.slice(1)}`,
          password: password,
        },
      },
      () => {
        setLoading(false);
        setIsRegist(false);
        setModalOption({
          title: "회원 가입 성공",
          content: "회원가입에 성공 하셨습니다.",
        });
        setModalOpen(true);
      },
      (error: any) => {
        setLoading(false);
        openErrModal(error);
      }
    );
  };

  const login = () => {
    setLoading(true);
    loginUser(
      {
        userParam: { ...defaultUser, email: id, password: password },
      },
      (response: string) => {
        setLoading(false);
        router.push(
          "users",
          { query: { tokenExpireTime: response } },
          { shallow: true }
        );
      },
      (error: any) => {
        setLoading(false);
        openErrModal(error);
      }
    );
  };

  return (
    <>
      {loading && <Loading />}
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
              handleValue(e.target.name, e.target.value, setIdErr)
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
                handleValue(e.target.name, e.target.value)
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
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleValue(e.target.name, e.target.value, setPhoneNumberErr)
              }
              name="input-number"
              id="input-number"
              aria-describedby="NUMBER"
              error={phoneNumberErr}
            />
            <FormHelperText id="NUMBER">
              {phoneNumberErr
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
              handleValue(e.target.name, e.target.value, setPasswordErr)
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
                handleValue(
                  e.target.name,
                  e.target.value,
                  setConfirmPasswordErr
                )
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
              onClick={() => request()}
              disabled={
                idErr ||
                passwordErr ||
                (isRegist && (confirmPasswordErr || phoneNumberErr))
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
              onClick={(e) => {
                setIsRegist(!isRegist);
                handleValue("reset");
              }}
              name="reset"
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
