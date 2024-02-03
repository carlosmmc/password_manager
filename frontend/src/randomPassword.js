// This function is created by AI and is reviewed and modified by Zhimei
function generateNonDuplicateNumbersInRange(x, max) {
    // Create an array containing numbers from min to max
    const numbers = Array.from({length: max}, (_, index) => index);

    // Shuffle the array using the Fisher-Yates shuffle algorithm
    for (let i = numbers.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Return the first x elements of the shuffled array
    return numbers.slice(0, x);
}

// This function is created by AI and is reviewed and modified by Zhimei
export function generateRandomPassword (length=8, uppercase=true, lowercase=true, numbers=true, specialChars=false) {
    // Define character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialCharChars = '!@#$%^&*';

    // Create a character pool based on options
    let charPool = '';
    if (uppercase) charPool += uppercaseChars;
    if (lowercase) charPool += lowercaseChars;
    if (numbers) charPool += numberChars;
    if (specialChars) charPool += specialCharChars;

    // Check if any options are provided
    if (!charPool) {
        console.error('Please select at least one option for the password.');
        return '';
    }

    let password = Array(length).fill(undefined);

    // randomly select a list of index numbers that will fill the minimum special character requirement
    const indexList = generateNonDuplicateNumbersInRange(4, length)

    // Ensure at least one character from each selected character set is included
    if (uppercase) password[indexList[0]] = uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length))
    if (lowercase) password[indexList[1]] = lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    if (numbers) password[indexList[2]] = numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    if (specialChars) password[indexList[3]] = specialCharChars.charAt(Math.floor(Math.random() * specialCharChars.length));

    // fill the list with random strings, skip the index that is already filled
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        if (password[i] !== undefined) continue
        password[i] = charPool.charAt(randomIndex);
    }

    return password.join("");
    
}

