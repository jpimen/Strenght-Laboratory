const LETTERS_IN_ALPHABET = 26;

export const getSpreadsheetColumnLabel = (index: number): string => {
  let label = "";
  let value = index + 1;

  while (value > 0) {
    const remainder = (value - 1) % LETTERS_IN_ALPHABET;
    label = String.fromCharCode(65 + remainder) + label;
    value = Math.floor((value - 1) / LETTERS_IN_ALPHABET);
  }

  return label;
};
