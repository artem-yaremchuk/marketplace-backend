export const themeTypes = ["light", "dark"];

export const userTypes = ["guardian", "adopter"];

export const NAME_REGEX =
  /^(?!.*\s{2,})(?!.*-\s)(?!.*\s-)(?!.*'\s)(?!.*\s')(?!.*--)[a-zA-Zа-яА-ЯёЁіІїЇєЄ'-]+(?: [a-zA-Zа-яА-ЯёЁіІїЇєЄ'-]+)*$/;


export const PASSWD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#_\\$%\\^&\\*])(?=.{8,64})/;

export const PHONE_REGEX = /^(\+?38)?0\d{9}$/;