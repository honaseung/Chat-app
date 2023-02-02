/**
 *
 * @param code 에러코드입니다.
 * @returns 에러메세지입니다.
 * @description 에러코드를 이용하여 에러메세지를 리턴해줍니다.
 * 등록되지 않은 에러코드는 콘솔에 보여주며 '관리자에게 문의하세요.' 라는 문구로 리턴됩니다.
 */
export default function getErrMsg(code: string): string[] {
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
    case "auth/phone-number-already-exists":
      return ["번호 중복", "이미 존재하는 핸드폰 번호입니다."];
    case "auth/invalid-phone-number":
      return ["잘못된 핸드폰 번호", "핸드폰를 확인해주십시오."];
    default:
      console.log(code);
      return ["오류", "관리자에게 문의하세요."];
  }
}
