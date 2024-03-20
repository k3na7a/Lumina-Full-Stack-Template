export const PasswordValidation = {
  message:
    'Password must contain one digit from 1 to 9 (including 0), one lowercase letter, one uppercase letter, one special character, no space, and it must be 8-16 characters long',
  regex: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/,
};
