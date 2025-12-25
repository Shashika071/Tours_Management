import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/ClientModle/User.js';
import passport from 'passport';
import { sendEmail } from '../utils/emailserver.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.authProvider = 'google';
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          authProvider: 'google',
          profileImage: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
        });

        await user.save();

        // Send welcome email for Google signup
        try {
          const welcomeMailOptions = {
            to: profile.emails[0].value,
            subject: 'Welcome to GuideBeeLK!',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #28a745;">Welcome to GuideBeeLK, ${profile.displayName}!</h2>
                <p>Thank you for signing up with Google. Your account has been created successfully.</p>
                <p>You can now:</p>
                <ul>
                  <li>Browse and book amazing tours</li>
                  <li>Manage your bookings</li>
                  <li>Leave reviews and ratings</li>
                  <li>Contact our support team</li>
                </ul>
                <p>You signed in with your Google account, so you can continue using Google to sign in anytime.</p>
                <p>If you have any questions, feel free to contact our support team.</p>
                <p>Happy traveling!</p>
                <p>Best regards,<br>GuideBeeLK Team</p>
              </div>
            `,
          };

          await sendEmail(welcomeMailOptions);
        } catch (emailError) {
          console.error('Failed to send Google welcome email:', emailError);
          // Don't fail Google auth if email fails
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;