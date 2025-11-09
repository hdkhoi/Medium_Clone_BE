export const nameMaxLength = 50;

export const usernameMaxLength = 30;
export const usernameMinLength = 3;

export const passwordSaltRounds = 10;
export const passwordMinLength = process.env.USER_PASSWORD_MIN_LENGTH
  ? parseInt(process.env.USER_PASSWORD_MIN_LENGTH)
  : 6;
export const passwordMaxLength = process.env.USER_PASSWORD_MAX_LENGTH
  ? parseInt(process.env.USER_PASSWORD_MAX_LENGTH)
  : 20;

export const bioMaxLength = 200;

export const imageMaxLength = 100;
