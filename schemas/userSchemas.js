import Joi from "joi";
import { PASSWD_REGEX, PHONE_REGEX } from "../constants.js";

export const registerUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least {#limit} characters long",
      "string.max": "Name must not be more than {#limit} characters long",
      "any.required": "Name is required",
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "gov", "edu", "io"] },
    })
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Enter a valid email address",
      "any.required": "Email is required",
    }),
 phone: Joi.string()
    .trim()
    .pattern(PHONE_REGEX)
    .required()
    .messages({
      "string.empty": "Phone number cannot be empty",
      "string.pattern.base": "Phone number must be a valid Ukrainian phone number",
      "any.required": "Phone number is required",
    }),
  password: Joi.string()
    .regex(PASSWD_REGEX)
    .required()
    .messages({
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
      "string.pattern.base":
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
  }),
  repeat_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords must match",
      "any.required": "Repeat password is required",
  }),
  userType: Joi.string()
    .valid("guardian", "adopter")
    .required()
    .messages({
      "any.only": "Invalid user type",
      "any.required": "User type is required",
  }),
});

export const verifyUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "gov", "edu", "io"] },
    })
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Enter a valid email address",
      "any.required": "Email is required",
    }),
});

export const loginUserSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "gov", "edu", "io"] },
    })
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Enter a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .regex(PASSWD_REGEX)
    .required()
    .messages({
      "string.empty": "Password cannot be empty",
      "any.required": "Password is required",
      "string.pattern.base":
      "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
  }),
});
