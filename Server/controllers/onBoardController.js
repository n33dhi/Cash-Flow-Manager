const User = require("../schema/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const RegisterUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 8);
    const newUser = await User.create({
        ...req.body,
        password: hashedPassword
    });
    res.status(200).json(newUser);
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

    const accessToken = jwt.sign({ UserName: UserDetail.userName, Email: email, Role: UserDetail.role }, process.env.JWT_ACCESS_TOKEN,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
    const refreshToken = jwt.sign({ UserName: UserDetail.userName, Email: email, Role: UserDetail.role }, process.env.JWT_REFRESH_TOKEN,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    res.cookie('accesstoken', accessToken, {maxAge:60000, secure: true})
    res.cookie('refreshtoken', refreshToken, {maxAge:30000, httpOnly:true, sameSite: "strict", secure: true})

    res.status(200).json({
      status: "Login Success",
      Login: true
      // Token: accessToken,
      //  RefreshToken: refreshToken,
      //  Data: UserDetail,
    });
  } catch (e) {
    res.status(500).json({ Login: false, message: e.message });
  }
};

module.exports = {
  RegisterUser,
  Login,
};
