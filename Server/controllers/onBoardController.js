const User = require("../schema/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const RegisterUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).send("User already Exists! Login!!");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    return res.status(200).json({status: true, data:newUser});
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const UserDetail = await User.findOne({ email });

    if (!UserDetail) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, UserDetail.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const accessToken = jwt.sign(
      {
        Id: UserDetail._id,
        UserName: UserDetail.userName,
        Email: email,
        Role: UserDetail.role,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      {
        Id: UserDetail._id,
        UserName: UserDetail.userName,
        Email: email,
        Role: UserDetail.role,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    UserDetail.refreshTokens = {
      token: hashedRefreshToken,
      createdAt: new Date(),
      expiresAt: process.env.REFRESH_TOKEN_EXPIRES_IN,
    };

    await UserDetail.save();

    // res.cookie("accesstoken", accessToken, { httpOnly: true, maxAge: 360000, secure: true });
    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      status: "Login Success",
      // Login: true,
      token: accessToken,
      // refreshToken: refreshToken,
      //  Data: UserDetail,
    });
  } catch (e) {
    res.status(500).json({
      Login: false,
      message: e.message,
    });
  }
};

const RefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const user = await User.findOne({ "refreshToken.token": refreshToken });
    if (!user) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken.token);
    if (!isTokenValid) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const accessToken = jwt.sign(
        { Id: user._id, UserName: user.userName, Email: user.email, Role: user.role },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
      );

      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const Logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    // const { refreshToken } = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token not provided" });

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) return res.status(403).send("Invalid Refresh Token");

        const userEmail = decoded.Email;
        const user = await User.findOne({ email: userEmail });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        user.refreshTokens = null
        await user.save();

        // res.clearCookie("refreshToken");
        res.status(200).json({ message: "Logged out successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const ForgetPassword = async (req, res) => {
  try {
    const { email } = req.body; 
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User does not exist! Please register.");
    }

    const newPassword = req.body.newPassword;
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


module.exports = {
  RegisterUser,
  Login,
  Logout,
  ForgetPassword,
  RefreshToken
};
