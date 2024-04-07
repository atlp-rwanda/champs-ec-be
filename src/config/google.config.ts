import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import users from "../models/user";
import { UserAttributes } from "../types/user.types";

export interface UserModel extends UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile?: string;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  googleId?: string;
  profileImage?: string;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/users/google/callback"
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
          profileImage: profile.photos?.[0].value || "",
          verified: true
        });

        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await users.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;