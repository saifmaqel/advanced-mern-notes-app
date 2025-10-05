import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_EXPIRY = 60 * 15;

// @route Post /auth
// @access public - because access token has expired
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ username });

  if (!foundUser || !foundUser.active) {
    return res
      .status(401)
      .json({ message: "Username or password is not correct" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) {
    res.status(401).json({ message: "Username or password is not correct" });
  }
  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    {
      username: foundUser.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // create secure cookie refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: "none", //  cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry
    // maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry
  });

  // send access token containing username and roles
  return res.json({ accessToken, expiresIn: ACCESS_TOKEN_EXPIRY });
});

// @route Get /auth/refresh
// @access public - because access token has expired
const refresh = asyncHandler((req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const foundUser = await User.findOne({ username: decoded.username });

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: { username: foundUser.username, roles: foundUser.roles },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
      );
      return res.json({ accessToken, expiresIn: ACCESS_TOKEN_EXPIRY });
    })
  );
});

// @route Post /auth/logout
// @access public - just to clear cookie of exist
const logout = asyncHandler((req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.json({ message: "Cookie cleared" });
});

const authController = { login, refresh, logout };

export default authController;
