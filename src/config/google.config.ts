import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import users from "../models/user";
import { UserAttributes } from "../types/user.types";
import Roles from "../models/Role";

const getBuyerRoleId = async () => {
  try {
    const role = await Roles.findOne({
      where: {
        name: "buyer"
      }
    });
    const roleId = role?.toJSON().id;
    return role ? roleId : null;
  } catch (error) {
    return null;
  }
};
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
  roleId?: string;
}
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string
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
        const buyerRoleId = await getBuyerRoleId();
        if (!buyerRoleId) {
          return done("Buyer role not found", null);
        }
        const newUser: UserModel = await users.create({
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          email: profile.emails?.[0].value || "",
          googleId: profile.id,
          profileImage: profile.photos?.[0].value || "",
          verified: true,
          roleId: buyerRoleId
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
    console.error("Error deserializing user:", error);
    done(error, null);
  }
});
export default passport;
