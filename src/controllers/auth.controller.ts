import { Request, Response, NextFunction } from "express";
// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
// eslint-disable-next-line import/no-duplicates
import passport from "passport";

import users from "../models/user";
import { UserAttributes } from "../types/user.types";
import { userToken } from "../utils/token.generator";

// User model interface
interface UserModel extends UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile?: string;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
  photoURL?: string;
}

// Configure Google OAuth2 strategy with Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:4000/api/users/google/callback"
    },
    async (
      accessToken: any,
      refreshToken: any,
      profile: {
        emails: { value: string }[];
        name: { givenName: string; familyName: string };
        id: string;
        photos: { value: string }[];
      },
      done: (arg0: unknown, arg1: UserModel | null) => void
    ) => {
      try {
        const existingUser = await users.findOne({
          where: { email: profile.emails?.[0].value }
        });
        if (existingUser) {
          return done(null, existingUser);
        }
        const newUser: UserModel = await users.create({
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          email: profile.emails?.[0].value || "",
          googleId: profile.id,
          photoURL: profile.photos?.[0].value || "",
          verified: true
        });
        done(null, newUser);
      } catch (error) {
        console.error("Error in Google OAuth2 strategy:", error);
        done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await users.findByPk(id);
    done(null, user);
  } catch (error) {
    console.error("Error in deserializing user:", error);
    done(error, null);
  }
});

// Initiate Google OAuth2 login process
export const initiateGoogleLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  passport.authenticate("google", async (err: any, user: UserModel | null) => {
    if (err) {
      console.error("Error in Google authentication:", err);
      return res
        .status(500)
        .json({ error: "Failed to authenticate with Google" });
    }
    if (!user) {
      console.error("User not found");
      return res.status(401).json({ error: "User not found" });
    }

    const userObject = {
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      googleID: user.googleId || "",
      photoUrl: user.photoURL || "",
      verified: user.verified || false,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date()
    };
    const id = userObject.id || "";
    const email = userObject.email || "";
    try {
      const token = await userToken(id, email);

      res.json({ user: userObject, token });
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ error: "Failed to generate token" });
    }
  })(req, res);
};
