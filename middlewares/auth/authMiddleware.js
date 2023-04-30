const expressAsyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");
const User = require("../../model/user/User");
const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        //find the user by id
        const user = await User.findById(decoded?.id).select("-password");
        //attach the user to the request object
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not authorized token expired, login again");
    }
  } else {
    throw new Error("There is no token attached to the header");
  }
});


const isAdmin = (req, res, next) => {
  const user = req.user;
  console.log(user);
  try {
    if (user.role !== "Admin") {
      return res.status(403).json({ error: "Only admin are allowed" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isSimpleUser = (req, res, next) => {
  const user = req.user;
  try {
    if (user.role !== "SimpleUser") {
      return res.status(403).json({ error: "Only  Users are allowed" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const isAsso = (req, res, next) => {
  const user = req.user;
  try {
    if (user.role !== "Association") {
      return res.status(403).json({ error: "Only  Associations are allowed" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const authPage = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    const role = user.role;
    if (permission.includes(role)) {
      req.user = user;
      next();
    } else {
      return res
        .status(401)
        .json("you dont have permission to access this page ");
    }
  };
};

module.exports = {
  authMiddleware,
  isAdmin,
  isSimpleUser,
  isAsso,
  authPage,
};