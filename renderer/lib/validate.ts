export function validateEmail(email) {
  var regex =
    /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return email && regex.test(email);
}

export function validatePasswod(password) {
  return 6 <= password.length && password.length <= 10;
}
