import { CognitoJwtVerifier } from "aws-jwt-verify";

// Initialize Cognito verifier
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID, // e.g. "us-east-1_XXXXXXXXX"
  tokenUse: "access", // or "id" depending on your token
  clientId: process.env.COGNITO_APP_CLIENT_ID, // e.g. "XXXXXXXXXXXXXXXXXXXX"
});

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token using Cognito
    const payload = await verifier.verify(token);

    // Attach user info to request
    req.user = {
      user_id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
