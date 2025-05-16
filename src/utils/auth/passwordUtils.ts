
/**
 * Generate a secure random password
 * @returns A random password string
 */
export function generatePassword(): string {
  // Define character sets
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // removed I and O as they can be confused
  const lowercaseChars = 'abcdefghijkmnpqrstuvwxyz'; // removed l and o as they can be confused
  const numberChars = '23456789'; // removed 0 and 1 as they can be confused
  const specialChars = '!@#$%^&*';
  
  // Generate one character from each set
  const getRandomChar = (charset: string) => charset.charAt(Math.floor(Math.random() * charset.length));
  
  const uppercase = getRandomChar(uppercaseChars);
  const lowercase = getRandomChar(lowercaseChars);
  const number = getRandomChar(numberChars);
  const special = getRandomChar(specialChars);
  
  // Generate the rest of the password from all character sets
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  let password = uppercase + lowercase + number + special;
  
  // Add more random characters to reach a length of 10
  for (let i = 0; i < 6; i++) {
    password += getRandomChar(allChars);
  }
  
  // Shuffle the password characters
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}
