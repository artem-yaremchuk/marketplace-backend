import Joi from "joi";
import { ANIMAL_AD_TEXT_REGEX } from "../constants/constants.js";

export const feedbackSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "ua", "gov", "edu", "io"] },
    })
    .max(50)
    .required()
    .messages({
      "string.empty": "Email cannot be empty",
      "string.email": "Enter a valid email address",
      "string.max": "Email must not be more than {#limit} characters long",
      "any.required": "Email is required",
    }),
  feedback: Joi.string()
    .trim()
    .max(500)
    .pattern(ANIMAL_AD_TEXT_REGEX)
    .required()
    .messages({
      "string.empty": "Feedback cannot be empty",
      "string.min": "Feedback must be at least {#limit} characters long",
      "string.max": "Feedback must not be more than {#limit} characters long",
      "string.pattern.base":
        "Feedback can only contain letters, numbers, properly placed spaces, apostrophes, basic punctuation marks and emoji",
      "any.required": "Feedback is required",
    }),
});