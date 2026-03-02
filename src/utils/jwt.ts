import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * Generate Access Token
 */
export const generateToken = (userId: string) => {
  return jwt.sign(
    { userId }, // IMPORTANT: middleware expects "userId"
    JWT_SECRET,
    { expiresIn: "1h" },
  );
};

/**
 * Verify Access Token
 */
export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};
