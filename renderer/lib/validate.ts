/**
 *
 * @param email 이메일인지 확인하고 싶은 string 값 입니다.
 * @returns 이메일 여부를 리턴합니다.
 */
export function validateEmail(email: string): boolean {
  const regex =
    /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return email && regex.test(email);
}

/**
 *
 * @param password 유효한 비밀번호인지 확인할 비밀번호입니다.
 * @returns 비밀번호가 유효한지 확인합니다.
 * @description 비밀번호는 6자리이상 10자리 이하입니다.
 */
export function validatePasswod(password: string): boolean {
  return 6 <= password.length && password.length <= 10;
}

/**
 *
 * @param number 유효한 핸드폰번호인지 확인할 번호입니다.
 * @returns 번호가 핸드폰번호인지 리턴합니다.
 */
export function validatePhoneNumber(number: string): boolean {
  const regPhoneNumber = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return number && regPhoneNumber.test(number);
}

/**
 *
 * @param targetDate 비교하고 싶은 Date 객체입니다.
 * @param compareDate 비교하고 싶은 Date 객체입니다.
 * @returns 두 Date 객체가 동일한 날짜를 가지고 있는지를 리턴합니다.
 * @description 이 함수는 년도, 월, 일 까지만 체크 합니다. 시간은 고려하지 않습니다.
 */
export function validateSameDay(targetDate: Date, compareDate: Date): boolean {
  return (
    targetDate.getFullYear() === compareDate.getFullYear() &&
    targetDate.getMonth() === compareDate.getMonth() &&
    targetDate.getDay() === compareDate.getDay()
  );
}
