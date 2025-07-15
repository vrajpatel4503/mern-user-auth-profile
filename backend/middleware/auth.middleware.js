import JWT from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    // console.log("Access Token (from cookie):", cookieToken);
    // console.log("Authorization Header:", authHeader);

    const token = cookieToken || headerToken;
    // console.log("Access Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    let decodedToken;
    try {
      decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (!decodedToken?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(decodedToken.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyJWT middleware:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* logic 
1. Extract the token from cookies or headers
2. Check the token. token provide or not
3. Verify the token with JWT.verify()
4. Ensure that token contain _id of the user
5. fetch from database and get user excluding sensitive information
6. Check user exist or not
7. Attach user object to request
8. next()

*/
