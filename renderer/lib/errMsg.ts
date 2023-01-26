export default function getErrMsg(code: string) {
  switch (code) {
    case "auth/user-not-found":
      return ["미가입 사용자", "가입하지 않은 사용자입니다."];
    case "auth/invalid-email":
      return ["잘못된 이메일 주소", "이메일 주소를 확인해주십시오."];
    case "auth/weak-password":
      return ["비밀번호 취약", "비밀번호가 취약합니다."];
    case "auth/wrong-password":
      return ["잘못된 비밀번호", "비밀번호가 틀렸습니다."];
    case "auth/email-already-in-use":
      return ["계정 중복", "이미 존재하는 계정입니다."];
    default:
      return ["오류", "관리자에게 문의하세요."];
  }
}
