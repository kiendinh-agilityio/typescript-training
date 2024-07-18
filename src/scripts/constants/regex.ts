export const REGEX = {
  // Check email have @ symbol, a string precedes it and the following string needs to contain a period, followed by 2-3 characters.
  EMAIL:
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/,

  // Check regex for avatar url
  AVATAR_URL:
    /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+(\.[a-zA-Z]{2,})?([/?].*)?$/,

  // Check characters with strings or numbers between 6 and 20 characters in length
  CHARACTER: /[0-9a-zA-Z]{4,20}/,

  // Keyword
  KEYWORD: /\s/g,
};
