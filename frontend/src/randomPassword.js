function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}

class PasswordCategoryPool {
    characters;
    constructor(characters) {
        this.characters = characters;
    }
    genRandomChar() {
        return this.characters.charAt(getRandomInt(this.characters.length));
    }
}

function generatePassword(length, uppercase, lowercase, numbers, specialChars) {
    const UppercasePasswordPool = new PasswordCategoryPool("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    const LowercasePasswordPool = new PasswordCategoryPool("abcdefghijklmnopqrstuvwxyz");
    const NumbersPasswordPool = new PasswordCategoryPool("0123456789");
    const SpecialCharsPasswordPool = new PasswordCategoryPool("!@#$%^&*");

    // Create a character pool based on options
    let charPool = [];
    if (uppercase) charPool.push(UppercasePasswordPool);
    if (lowercase) charPool.push(LowercasePasswordPool);
    if (numbers) charPool.push(NumbersPasswordPool);
    if (specialChars) charPool.push(SpecialCharsPasswordPool);

    // Check if any options are provided
    if (charPool.length === 0) {
        console.error("Please select at least one option for the password.");
        return "";
    }

    let password = "";

    // Ensure at least one character from each selected character set is included
    if (uppercase) password += UppercasePasswordPool.genRandomChar();
    if (lowercase) password += LowercasePasswordPool.genRandomChar();
    if (numbers) password += NumbersPasswordPool.genRandomChar();
    if (specialChars) password += SpecialCharsPasswordPool.genRandomChar();

    // Generate the remaining characters
    for (let i = password.length; i < length; i++) {
        let randomPoolIndex = getRandomInt(charPool.length);
        password += charPool[randomPoolIndex].genRandomChar();
    }

    // Shuffle the password characters to make it more random
    password = password.split("").sort(() => Math.random() - 0.5).join("");

    return password;
}
