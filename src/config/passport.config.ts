import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { config } from "dotenv";
import User from "../models/user";
import Role from "../models/Role";

config();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string
};
const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findOne({
      where: {
        email: payload.email,
        verified: true
      },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          attributes: ["id", "name"]
        }
      ]
    });

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

passport.use("jwt", jwtStrategy);
export default passport;
