import type { RequestHandler } from "express";
import { getTokenFromRequest, getUserFromToken } from "./password";
import type { User } from "@shared/models/auth";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      authUserId?: string;
      authKind?: "token";
      authUser?: User;
    }
  }
}

export const requireAnyAuth: RequestHandler = async (req, res, next) => {
  try {
    // Token auth
    const token = getTokenFromRequest(req);
    if (token) {
      const user = await getUserFromToken(token);
      if (user) {
        req.authUserId = user.id;
        req.authKind = "token";
        req.authUser = user;
        return next();
      }
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (err) {
    return res.status(500).json({ message: "Auth check failed" });
  }
};

export async function getAuthedUser(req: any) {
  return (req as any)?.authUser ?? null;
}
