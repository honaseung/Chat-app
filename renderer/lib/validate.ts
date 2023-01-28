export function validateEmail(email) {
  const regex =
    /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return email && regex.test(email);
}

export function validatePasswod(password) {
  return 6 <= password.length && password.length <= 10;
}

export function validatePhoneNumber(number) {
  const regPhoneNumber = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
  return number && regPhoneNumber.test(number);
}

export function validateSameDay(targetDate: Date, compareDate: Date) {
  return (
    targetDate.getFullYear() === compareDate.getFullYear() &&
    targetDate.getMonth() === compareDate.getMonth() &&
    targetDate.getDay() === compareDate.getDay()
  );
}
