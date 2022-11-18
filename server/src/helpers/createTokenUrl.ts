import jwt from "jsonwebtoken";

export const createTokenUrl = async (email: string, actionType: string) => {
  const token = jwt.sign({ email }, process.env.JWT_MAIL_TOKEN);

  return `${process.env.WEBSITE_URL}${actionType}/${token}`;
};
