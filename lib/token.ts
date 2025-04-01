import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function generateToken(user: any) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
      isEmailVerified: user.isEmailVerified,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string) {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
} 