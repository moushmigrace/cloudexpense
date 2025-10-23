import dotenv from "dotenv";
dotenv.config();

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { findOrCreateUser } from '../models/userModel.js';

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: "id",
  clientId: process.env.COGNITO_APP_CLIENT_ID,
});

export const authMiddleware = async (req, res, next) => {
  console.log('---');
  console.log('[Auth Middleware] Middleware started.');
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifier.verify(token);
    console.log('[Auth Middleware] Token verified successfully. Payload:', payload);

    console.log('[Auth Middleware] Calling findOrCreateUser with:', { id: payload.sub, email: payload.email });
    const userFromDb = await findOrCreateUser({
      id: payload.sub,
      email: payload.email,
    });
    console.log('[Auth Middleware] Received from findOrCreateUser:', userFromDb);

    req.user = {
      user_id: userFromDb.id,
      email: userFromDb.email,
    };
    console.log('[Auth Middleware] Attached req.user. Moving to next function.');

    next();
  } catch (err) {
    console.error("[Auth Middleware] CRITICAL ERROR:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};