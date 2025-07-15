import express from "express";
import upload from "../middleware/multer.js";
import {
  emailUpdateController,
  getUserdetailsController,
  updateUserAvatarController,
  updateUserNameController,
  userLoginController,
  userLogoutController,
  userRegisterController,
} from "../controller/user.controller.js";
import {
  userAddressValidation,
  userFieldValidation,
} from "../middleware/user.validation.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// user register routes
router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),

  userFieldValidation,
  userAddressValidation,
  userRegisterController
);

// user login routes
router.post("/login", userLoginController);

// user logout controller
router.post("/logout", verifyJWT, userLogoutController);

// get user details routes
router.get("/getuserdetails", verifyJWT, getUserdetailsController);

// update userName routes
router.put("/update-username", verifyJWT, updateUserNameController);

//update email routes
router.post("/update-email", verifyJWT, emailUpdateController);

//update avatar routes
router.put(
  "/update-avatar",
  verifyJWT,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  updateUserAvatarController
);


export default router;
