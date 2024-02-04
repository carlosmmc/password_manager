export function generatePassword(length, uppercase, lowercase, numbers, specialChars) {
    // Define character sets
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const specialCharChars = "!@#$%^&*";

    // Create a character pool based on options
    let charPool = "";
    if (uppercase) charPool += uppercaseChars;
    if (lowercase) charPool += lowercaseChars;
    if (numbers) charPool += numberChars;
    if (specialChars) charPool += specialCharChars;

    // Check if any options are provided
    if (!charPool) {
        console.error("Please select at least one option for the password.");
        return "";
    }

    let password = "";

    // Ensure at least one character from each selected character set is included
    if (uppercase) password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    if (lowercase) password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    if (numbers) password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    if (specialChars) password += specialCharChars.charAt(Math.floor(Math.random() * specialCharChars.length));

    // Generate the remaining characters
    for (let i = password.length; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charPool.length);
        password += charPool.charAt(randomIndex);
    }

    // Shuffle the password characters to make it more random
    password = password.split("").sort(() => Math.random() - 0.5).join("");

    return password;
}