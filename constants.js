export const themeTypes = ["light", "dark"];

export const userTypes = ["guardian", "adopter"];

export const animalGender = ["male", "female", "unknown"];

export const NAME_REGEX =
  /^(?!.*\s{2,})(?!.*-\s)(?!.*\s-)(?!.*'\s)(?!.*\s')(?!.*--)[a-zA-Zа-яА-ЯёЁіІїЇєЄ'-]+(?: [a-zA-Zа-яА-ЯёЁіІїЇєЄ'-]+)*$/;

export const PASSWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_\\$%\\^&\\*])(?=.{8,30})/;

export const PHONE_REGEX = /^(\+?38)?0\d{9}$/;

export const ANIMAL_TYPE_REGEX = /^(?!.*\s{2,})[a-zA-Zа-яА-ЯіІїЇєЄ\s]+$/;

export const BREED_REGEX = /^[A-Za-zА-Яа-яІЇЄҐієїґ'-]+(?:\s[A-Za-zА-Яа-яІЇЄҐієїґ'-]+)*$/;

export const ANIMAL_AGE_REGEX = /^\d+$/;

export const ANIMAL_AD_TEXT_REGEX = /^[A-Za-zА-Яа-яЇїЄєІіҐґ\s'’\-\.,!?():;"&]+$/;
