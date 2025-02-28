import Joi from "joi";

export const createAnimalSchema = Joi.object({
  animalName: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Animal name cannot be empty",
    "string.min": "Animal name must be at least {#limit} characters long",
    "string.max": "Animal name must not be more than {#limit} characters long",
    "any.required": "Animal name is required",
  }),
  animalType: Joi.string().required().messages({
    "string.empty": "Animal type cannot be empty",
    "any.required": "Animal type is required",
  }),
  breed: Joi.string().required().messages({
    "string.empty": "Breed cannot be empty",
    "any.required": "Breed is required",
  }),
  age: Joi.string().required().messages({
    "string.empty": "Age cannot be empty",
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
  adTitle: Joi.string().trim().min(5).max(100).required().messages({
    "string.empty": "Ad title cannot be empty",
    "string.min": "Ad title must be at least {#limit} characters long",
    "string.max": "Ad title must not be more than {#limit} characters long",
    "any.required": "Ad title is required",
  }),
  adText: Joi.string().trim().min(10).max(1000).required().messages({
    "string.empty": "Ad text cannot be empty",
    "string.min": "Ad text must be at least {#limit} characters long",
    "string.max": "Ad text must not be more than {#limit} characters long",
    "any.required": "Ad text is required",
  }),
});
