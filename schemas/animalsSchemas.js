import Joi from "joi";
import { NAME_REGEX, ANIMAL_TYPE_REGEX, BREED_REGEX, ANIMAL_AGE_REGEX, animalGender, ANIMAL_AD_TEXT_REGEX } from "../constants.js"

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
  age: Joi.string().trim().pattern(ANIMAL_AGE_REGEX).required().messages({
    "string.empty": "Age cannot be empty",
    "string.pattern.base": "Age must contain only digits",
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
  adText: Joi.string().trim().min(100).max(500).pattern(ANIMAL_AD_TEXT_REGEX).required().messages({
    "string.empty": "Ad text cannot be empty",
    "string.min": "Ad text must be at least {#limit} characters long",
    "string.max": "Ad text must not be more than {#limit} characters long",
    "string.pattern.base": "Ad text can only contain letters, numbers, properly placed spaces, apostrophes, and basic punctuation marks",
    "any.required": "Ad text is required",
  }),
});