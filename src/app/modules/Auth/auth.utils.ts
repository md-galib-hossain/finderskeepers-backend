import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const generateToken = (
  payload: any,
  secret: Secret,
  expiresIn: string
) => {
  const token = jwt.sign(
    payload,

    secret,
    {
      algorithm: "HS256",
      expiresIn: expiresIn,
    }
  );
  return token;
};

export const verifyToken = (token: string, secret: Secret): JwtPayload | null => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    // If an error occurs during verification, return null
    return null;
  }
};
