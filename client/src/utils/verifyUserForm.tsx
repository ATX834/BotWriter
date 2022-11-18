export const passwordsMatch = (pass: string, confirm: string): boolean => {
  return pass === confirm;
};

export const emailContainsAt = (email: string | undefined) => {
  return email ? email.includes("@") : false;
};

export const userAlreadyExists = (message: string | boolean) => {
  return message === "User already exists";
};

export const userIsNotConfirmed = (message: string | boolean) => {
  return message === "You have to confirm your account";
}