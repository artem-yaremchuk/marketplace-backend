import Joi from "joi";
import { NAME_REGEX, ANIMAL_TYPE_REGEX, BREED_REGEX, animalGender, ANIMAL_AD_TEXT_REGEX } from "../constants.js"

export const createAnimalSchema = Joi.object({
  animalName: Joi.string().trim().min(2).max(50).pattern(NAME_REGEX).required().messages({
    "string.empty": "Animal name cannot be empty",
    "string.min": "Animal name must be at least {#limit} characters long",
    "string.max": "Animal name must not be more than {#limit} characters long",
    "string.pattern.base": "Animal name can only contain letters, properly placed hyphens, apostrophes, and spaces",
    "any.required": "Animal name is required",
  }),
  animalType: Joi.string().trim().min(2).max(30).pattern(ANIMAL_TYPE_REGEX).required().messages({
    "string.empty": "Animal type cannot be empty",
    "string.min": "Animal type must be at least {#limit} characters long",
    "string.max": "Animal type must not be more than {#limit} characters long",
    "string.pattern.base": "Animal type must contain only letters and properly placed spaces, without special characters or HTML tags",
    "any.required": "Animal type is required",
  }),
  breed: Joi.string().trim().max(50).pattern(BREED_REGEX).required().messages({
    "string.empty": "Breed cannot be empty",
    "string.max": "Breed must not be more than {#limit} characters long",
    "string.pattern.base": "Breed name must consist only of letters, single spaces, properly placed hyphens, and apostrophes. Special characters and numbers are not allowed",
    "any.required": "Breed is required",
  }),
  age: Joi.object({
    years: Joi.number().integer().min(0).required().messages({
      "number.base": "Years must be a number",
      "number.integer": "Years must be an integer",
      "number.min": "Years cannot be negative",
      "any.required": "Years is required",
    }),
    months: Joi.number().integer().min(0).max(11).required().messages({
      "number.base": "Months must be a number",
      "number.integer": "Months must be an integer",
      "number.min": "Months cannot be negative",
      "number.max": "Months must be between 0 and 11",
      "any.required": "Months is required",
    }),
  }).required().messages({
    "any.required": "Age is required",
  }),
  gender: Joi.string().valid(...animalGender).required().messages({
    "any.only": `Animal gender must be one of: ${animalGender.join(", ")}`,
    "any.required": "Gender is required",
  }),
  animalLocation: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Animal location cannot be empty",
    "string.min": "Animal location must be at least {#limit} characters long",
    "string.max": "Animal location must not be more than {#limit} characters long",
    "any.required": "Animal location is required",
  }),
  adText: Joi.string().trim().min(50).max(500).pattern(ANIMAL_AD_TEXT_REGEX).required().messages({
    "string.empty": "Ad text cannot be empty",
    "string.min": "Ad text must be at least {#limit} characters long",
    "string.max": "Ad text must not be more than {#limit} characters long",
    "string.pattern.base": "Ad text can only contain letters, numbers, properly placed spaces, apostrophes, basic punctuation marks and emoji",
    "any.required": "Ad text is required",
  }),
});