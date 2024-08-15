export const REGEX = {
  // Check email have @ symbol, a string precedes it and the following string needs to contain a period, followed by 2-3 characters.
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,

  // Check regex for avatar url
  AVATAR_URL: /^https?:\/\/.*\.(png|gif|webp|jpe?g)(\?.*)?$/i,

  // Check characters with strings or numbers between 6 and 20 characters in length
  CHARACTER: /[0-9a-zA-Z]{4,20}/,

  // Keyword
  KEYWORD: /\s/g,
};
