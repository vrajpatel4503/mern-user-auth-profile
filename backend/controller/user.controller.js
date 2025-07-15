import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import uploadOnCloudinary from "../cloudinary/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

// Generate refresh and access token
const generateRefreshTokenAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { accessToken, refreshToken };

    // try part end
  } catch (error) {
    console.log(`Error in generateRefreshTokenAndAccessToken :- ${error}`);
  }
};

// User Register Controller

export const userRegisterController = async (req, res) => {
  try {
    const { fullName, userName, email, password, phoneNumber } = req.body;
    const address = req.address;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Validate avatar upload
    if (!req.files || !req.files.avatar || !req.files.avatar.length) {
      return res.status(400).json({
        success: false,
        message: "Avatar is required. Please upload an image.",
      });
    }

    // Upload avatar to Cloudinary
    const avatarPath = req.files.avatar[0].path;
    const avatarUpload = await uploadOnCloudinary(avatarPath);

    if (!avatarUpload?.url || !avatarUpload?.public_id) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload avatar. Please try again.",
      });
    }

    // Create user
    const user = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
      phoneNumber,
      address: {
        state: address?.state,
        city: address?.city,
        street: address?.street,
        pincode: address?.pincode,
      },
      avatar: avatarUpload.url,
    });

    try {
      await user.save();
    } catch (err) {
      // Clean up avatar from Cloudinary if user creation fails
      await cloudinary.uploader.destroy(avatarUpload.public_id);
      console.log(
        `Deleted avatar from Cloudinary due to user save failure: ${avatarUpload.public_id}`
      );
      return res.status(500).json({
        success: false,
        message: "User registration failed. Please try again.",
      });
    }

    // Fetch created user without sensitive fields
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      await cloudinary.uploader.destroy(avatarUpload.public_id);
      console.log(
        `🗑️ Deleted avatar from Cloudinary due to user fetch failure: ${avatarUpload.public_id}`
      );
      return res.status(500).json({
        success: false,
        message: "User registration failed. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User registered successfully.",
      createdUser,
    });
  } catch (error) {
    console.log(` Error in userRegisterController: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

// User Login Controller
export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check for email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email id is not exist.",
      });
    }

    // Check for valid password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // Generate access and refresh token
    const { accessToken, refreshToken } =
      await generateRefreshTokenAndAccessToken(user._id);

    // Retrieve user details excluding sensitive data
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    };

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .status(200)
      .json(
        {
          success: true,
          message: `Welcome back ${user.fullName}`,
          user: loggedInUser,
          accessToken,
          refreshToken,
        }
        // console.log(accessToken),
        // console.log(refreshToken)
      );

    // try part end
  } catch (error) {
    console.log(`Error in userLoginController :- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// User Logout Controller
export const userLogoutController = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: "" },
    });

    const options = {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    };

    return res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User logged out successfully",
      });
    // try part end
  } catch (error) {
    console.log(`Error in userLogoutController :- ${error}`);
    return res.status(500).json({});
  }
};

//  user get information
export const getUserdetailsController = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

    // try part end
  } catch (error) {
    console.log(`Error in getuserdetailsController :- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update userName
export const updateUserNameController = async (req, res) => {
  try {
    const { id } = req.user;
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({
        success: false,
        message: "Please provide username",
      });
    }

    const existingUserName = await User.findOne({ userName });

    if (existingUserName) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { userName },
      { new: true }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Username changed successfully",
      user,
    });
  } catch (error) {
    console.log(`Error in updateUserNameController: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update email controller
export const emailUpdateController = async (req, res) => {
  try {
    const { id } = req.user;
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Please provide email",
      });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is exist",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        email,
      },
      {
        new: true, // This tells Mongoose to return the updated document after the changes have been applied.Without new: true It returns the original document before the update.
      }
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email change successfully",
      user,
    });

    // try part end
  } catch (error) {
    console.log(`Error in updateEmailController :- ${error} `);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//update the avatar

export const updateUserAvatarController = async (req, res) => {
  try {
    const { id } = req.user;

    // Ensure a new avatar is uploaded
    if (!req.files || !req.files.avatar || !req.files.avatar[0]) {
      return res.status(400).json({
        success: false,
        message: "Please upload an avatar image.",
      });
    }

    const avatarPath = req.files.avatar[0].path;

    // Upload new avatar to Cloudinary
    const avatarUpload = await uploadOnCloudinary(avatarPath);

    if (!avatarUpload?.url) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload new avatar. Please try again.",
      });
    }

    // Update avatar URL in the user document
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        avatar: avatarUpload.url,
      },
      {
        new: true,
      }
    ).select("-password -refreshToken");

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUserAvatarController:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
