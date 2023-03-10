import {
  Button,
  ButtonGroup,
  Container,
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import getErrMsg from "../../lib/errMsg";
import Modal from "../../components/common/Modal";
import { useRouter } from "next/router";
import {
  validateEmail,
  validatePasswod,
  validatePhoneNumber,
} from "../../lib/validate";
import { loginUser, registUser } from "../../lib/firebaseApi";
import { defaultUser } from "../../type/user";
import Loading from "../../components/common/Loading";

/**
 *
 * @description 로그인 / 회원가입을 위한 컴포넌트입니다.
 */
const UserForm: React.FunctionComponent = () => {
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

  /**
   *
   * @description 로그인 / 회원가입 에러 발생시 화면에 모달 창을 띄워줍니다. 에러메세지는 util 의 getErrMsg 에서 가져옵니다.
   */
  const openErrModal = (error: any) => {
    const [title, content] = getErrMsg(error.code);
    setModalOption({
      title,
      content,
    });
    setModalOpen(true);
  };

  /**
   *
   * @param name 컴포넌트의 이름 프로퍼티입니다.
   * @param value 컴포넌트가 갖고 있는 값입니다.
   * @param setErr 유효성 검사를 통해 잘못된 값이 입력되면 에러를 세팅해줍니다.
   * @description 사용자의 정보를 컴포넌트에서 받아와 세팅해주는 함수 입니다.
   */
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

  /**
   * @description 사용자 요청입니다. state 값에 따라서 로그인 / 회원가입으로 나뉩니다.
   */
  const request = () => {
    if (isRegist) regist();
    else login();
  };

  /**
   * @description 회원가입 요청입니다.
   * email 이 ID 가 되며 이름은 생략시에 email 에서 '@' 앞까지가 이름이 됩니다.
   * 가입시에 email 과 핸드폰번호는 중복되어서는 안됩니다.
   * 핸드폰번호는 +8210~ 으로 저장됩니다.
   */
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

  /**
   * @description 로그인 요청입니다. 성공시에는 main 페이지로 이동합니다.
   * 실패시에는 모달창과 함께 실패 이유가 나옵니다.
   */
  const login = () => {
    setLoading(true);
    loginUser(
      {
        userParam: { ...defaultUser, email: id, password: password },
      },
      (response: string) => {
        setLoading(false);
        router.replace("/main", undefined, { shallow: true });
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
        <img src="/common/chat-logo.png" height="280" width="280" />
        <div className="user-form-title">
          {isRegist ? "회원가입" : "로그인"}을 해주세요.
        </div>
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
