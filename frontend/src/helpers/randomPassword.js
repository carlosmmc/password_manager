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
    const indexArr = new Uint32Array(length)
    crypto.getRandomValues(indexArr)

    // Ensure at least one character from each selected character set is included
    if (uppercase) password += uppercaseChars.charAt(indexArr[0] % uppercaseChars.length)
    if (lowercase) password += lowercaseChars.charAt(indexArr[1] % lowercaseChars.length);
    if (numbers) password += numberChars.charAt(indexArr[2] % numberChars.length);
    if (specialChars) password += specialCharChars.charAt(indexArr[3] % specialCharChars.length);

    // Generate the remaining characters
    for (let i = password.length; i < length; i++) {
        const randomIndex = indexArr[i] % charPool.length;
        password += charPool.charAt(randomIndex);
    }

    const randomSort = new Uint32Array(1)
    crypto.getRandomValues(randomSort)
    const randomFloat = randomSort[0] / Math.pow(2, 32)

    // Shuffle the password characters to make it more random
    password = password.split("").sort(() => randomFloat - 0.5).join("");

    return password;
}