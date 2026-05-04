import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { UserRepository } from '../db/UserRepository';
import Role from '../models/Role';

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL as string,
    passReqToCallback: true
},
async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value ?? '';
        const school = req.query.state as string;

        const userRepo = new UserRepository();
        let user;
        user = await userRepo.getByGoogleId(profile.id, school);

        if (!user) {
            // first login — create the user
            user = await userRepo.save({
                Id: "",
                GoogleId: profile.id,
                Email: email,
                Username: profile.displayName,
                Role: Role.Student,
                School: school,
                Courses: [],
                CoursesTA: []
            } as any);
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

export default passport;