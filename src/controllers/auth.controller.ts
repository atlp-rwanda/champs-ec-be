import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "../models/user";
import { UserAttributes } from "../types/user.types";
import { userToken } from "../utils/functions/token.generator";

// User model interface
interface UserModel extends UserAttributes {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  profile?: string;
  photoUrl?: string;
  verified?: boolean;
  googleID?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
        id: any;
        photos: { value: string }[];
      },
      done: (arg0: unknown, arg1: User | UserModel | null) => void
    ) => {
      try {
        const existingUser = await User.findOne({
          where: { email: profile.emails?.[0].value }
        });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser: UserModel = await User.create({
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          email: profile.emails?.[0].value || "",
          googleID: profile.id,
          photoUrl: profile.photos?.[0].value || "",
          verified: true,
          createdAt: new Date()
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user: UserModel, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
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
      return res
        .status(500)
        .json({ error: "Failed to authenticate with Google" });
    }
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const userObject = {
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      googleID: user.googleID || "",
      photoUrl: user.photoUrl || "",
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
      return res.status(500).json({ error: "Failed to generate token" });
    }
  })(req, res);
};
