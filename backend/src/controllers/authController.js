import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_EXPIRY = 60 * 15; // 15 minutes

// @route POST /auth
// @access Public
const login = async (req, res) => {
  try {
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
      return res
        .status(401)
        .json({ message: "Username or password is not correct" });
    }

    const accessToken = jwt.sign(
      { UserInfo: { username: foundUser.username, roles: foundUser.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken, expiresIn: ACCESS_TOKEN_EXPIRY });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route GET /auth/refresh
// @access Public
const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const foundUser = await User.findOne({ username: decoded.username });
        if (!foundUser)
          return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            UserInfo: { username: foundUser.username, roles: foundUser.roles },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        return res.json({ accessToken, expiresIn: ACCESS_TOKEN_EXPIRY });
      }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route POST /auth/logout
// @access Public
const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
    return res.json({ message: "Cookie cleared" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// @route POST /auth/signup
// @access Public
const signup = async (req, res) => {
  try {
    const { username, password, roles, active } = req.body;

    if (
      !username ||
      !password ||
      !Array.isArray(roles) ||
      roles.length === 0 ||
      active === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await User.findOne({ username }).lean();
    if (duplicate)
      return res.status(409).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      roles,
      active,
    });

    if (!newUser)
      return res.status(400).json({ message: "Invalid user data received" });

    const accessToken = jwt.sign(
      { UserInfo: { username: newUser.username, roles: newUser.roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { username: newUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json({ accessToken, expiresIn: ACCESS_TOKEN_EXPIRY });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const authController = { login, refresh, logout, signup };

export default authController;
