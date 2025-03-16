import Joi from "joi";
import { NAME_REGEX, ANIMAL_TYPE_REGEX, BREED_REGEX, ANIMAL_AGE_REGEX, ANIMAL_AD_TITLE_TEXT_REGEX } from "../constants.js"

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
  breed: Joi.string().trim().pattern(BREED_REGEX).required().messages({
    "string.empty": "Breed cannot be empty",
    "string.pattern.base": "Breed must contain only letters, single spaces, properly placed hyphens and apostrophes, without special characters or numbers",
    "any.required": "Breed is required",
  }),
  age: Joi.string().trim().pattern(ANIMAL_AGE_REGEX).required().messages({
    "string.empty": "Age cannot be empty",
    "string.pattern.base": "Age must contain only digits",
    "any.required": "Age is required",
  }),
  gender: Joi.string().valid("male", "female").required().messages({
    "any.only": "Gender must be either 'male' or 'female'",
    "any.required": "Gender is required",
  }),
  animalLocation: Joi.string().required().messages({
    "string.empty": "Location cannot be empty",
    "any.required": "Animal location is required",
  }),
  adTitle: Joi.string().trim().min(5).max(100).pattern(ANIMAL_AD_TITLE_TEXT_REGEX).required().messages({
    "string.empty": "Ad title cannot be empty",
    "string.min": "Ad title must be at least {#limit} characters long",
    "string.max": "Ad title must not be more than {#limit} characters long",
    "string.pattern.base": "Ad title can only contain letters, numbers, spaces, apostrophes, and basic punctuation marks",
    "any.required": "Ad title is required",
  }),
  adText: Joi.string().trim().min(10).max(1000).pattern(ANIMAL_AD_TITLE_TEXT_REGEX).required().messages({
    "string.empty": "Ad text cannot be empty",
    "string.min": "Ad text must be at least {#limit} characters long",
    "string.max": "Ad text must not be more than {#limit} characters long",
    "string.pattern.base": "Ad text can only contain letters, numbers, spaces, apostrophes, and basic punctuation marks",
    "any.required": "Ad text is required",
  }),
});
