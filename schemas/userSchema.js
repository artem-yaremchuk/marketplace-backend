import Joi from "joi";
import { NAME_REGEX, PASSWD_REGEX, PHONE_REGEX, themeTypes, userTypes } from "../constants.js";

export const registerUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).pattern(NAME_REGEX).required().messages({
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least {#limit} characters long",
    "string.max": "Name must not be more than {#limit} characters long",
    "string.pattern.base": "Name can only contain letters, hyphens, apostrophes, and spaces",
    "any.required": "Name is required",
  }),
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "gov", "edu", "io", "email", "me"] },
    })
    .max(50)
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Enter a valid email address",
      "string.max": "Email must not be more than {#limit} characters long",
      "any.required": "Email is required",
    }),
  location: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Location cannot be empty",
    "string.min": "Location must be at least {#limit} characters long",
    "string.max": "Location must not be more than {#limit} characters long",
    "any.required": "Location is required",
  }),
  phone: Joi.string().trim().pattern(PHONE_REGEX).required().messages({
    "string.empty": "Phone number cannot be empty",
    "string.pattern.base":
      "Phone number must be a valid Ukrainian phone number",
    "any.required": "Phone number is required",
  }),
  password: Joi.string().regex(PASSWD_REGEX).required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
    "string.pattern.base":
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
  }),
  repeat_password: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "any.required": "Repeat password is required",
  }),
  userType: Joi.string().valid(...userTypes).required().messages({
    "any.only": "Invalid user type",
    "any.required": "User type is required",
  }),
});

export const verifyUserSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "gov", "edu", "io", "email", "me"] },
    })
    .max(50)
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Enter a valid email address",
      "string.max": "Email must not be more than {#limit} characters long",
      "any.required": "Email is required",
    }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "gov", "edu", "io", "email", "me"] },
    })
    .max(50)
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Enter a valid email address",
      "string.max": "Email must not be more than {#limit} characters long",
      "any.required": "Email is required",
    }),
  password: Joi.string().regex(PASSWD_REGEX).required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
    "string.pattern.base":
    "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
  }),
});

export const themeUserSchema = Joi.object({
  theme: Joi.string()
    .valid(...themeTypes)
    .required()
    .messages({
      "string.empty": "Theme cannot be empty",
      "any.required": "Theme is required",
      "any.only": `Theme must be one of: ${themeTypes.join(", ")}`,
    }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).pattern(NAME_REGEX).messages({
    "string.min": "Name must be at least {#limit} characters long",
    "string.max": "Name must not be more than {#limit} characters long",
    "string.pattern.base": "Name can only contain letters, hyphens, apostrophes, and spaces",
  }),
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "gov", "edu", "io", "email", "me"] },
    })
    .max(50)
    .messages({
      "string.email": "Enter a valid email address",
      "string.max": "Email must not be more than {#limit} characters long",
    }),
  location: Joi.string().trim().min(2).max(50).messages({
    "string.min": "Location must be at least {#limit} characters long",
    "string.max": "Location must not be more than {#limit} characters long",
  }),
  phone: Joi.string().trim().pattern(PHONE_REGEX).messages({
    "string.pattern.base":
      "Phone number must be a valid Ukrainian phone number",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "gov", "edu", "io", "email", "me"] },
    })
    .max(50)
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Enter a valid email address",
      "string.max": "Email must not be more than {#limit} characters long",
      "any.required": "Email is required",
    }),
});

export const resetPasswordCodeSchema = Joi.object({
  resetPasswordCode: Joi.string().trim().length(6).required().messages({
    "string.empty": "Reset password code cannot be empty",
    "any.required": "Reset password code is required",
    "string.length": "Reset password code must be exactly 6 characters long",
  }),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().regex(PASSWD_REGEX).required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
    "string.pattern.base":
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
  }),
  repeat_password: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
    "any.required": "Repeat password is required",
  }),
});

export const changePasswordSchema = Joi.object({
  newPassword: Joi.string().regex(PASSWD_REGEX).required().messages({
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
    "string.pattern.base":
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
  }),
  repeat_newPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "New password must match",
    "any.required": "Repeat new password is required",
  }),
});