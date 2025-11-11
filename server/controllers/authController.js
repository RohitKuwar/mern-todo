const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const register = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    //check existing user
    const existingUser = await User.findOne({ email });
    if(existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({
        email,
        password: hashedPassword
    });

    // don't auto issue tokens on register (optional). Could sign in immediately.
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if(!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await comparePassword(password, user.password);
    if(!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // create tokens
    const jti = Math.random(); // unique identifier for the refresh token
    const userIdStr = String(user._id); // ensures this is a plain string
    const accessToken = signAccessToken({ userId: userIdStr });
    const refreshToken = signRefreshToken({ userId: userIdStr }, jti);

    // store refresh token in DB
    user.refreshTokens.push({ token: refreshToken });
    await user.save();

    // send refresh token in secure HttpOnly cookie; send access token in response body
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE === 'true', // true in production with HTTPS
        sameSite: 'strict', // adjust based on your client-server setup
        path: '/api/auth/refresh', // limit cookie to refresh endpoint
        maxAge: 7 * 24 * 60 * 60 * 1000 // match REFRESH_TOKEN_EXPIRES_IN (here 7 days)

    }

    res.cookie('refreshToken', refreshToken, cookieOptions)
    res.json({ accessToken, user: { id: user._id, email: user.email } })
}

const refresh = async (req, res) => {
  // refresh token expected in HttpOnly cookie
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = verifyRefreshToken(token); // throws if invalid
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    // verify token is in user's stored tokens (revocation check)
    const found = user.refreshTokens.find(rt => rt.token === token);
    if (!found) return res.status(401).json({ message: 'Refresh token revoked' });

    // issue new access token
    const accessToken = signAccessToken({ userId: user._id });

    // Optionally: rotate refresh token (issue new refresh token and revoke old)
    // For simplicity we issue same refresh token until logout/expiry. Rotating is more secure.

    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    // clear cookie anyway
    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
    return res.json({ message: 'Logged out' });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.userId);
    if (user) {
      // remove the refresh token from DB
      user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
      await user.save();
    }
  } catch (err) {
    // ignore errors
  }

  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  res.json({ message: 'Logged out' });
};

module.exports = { register, login, refresh, logout };
