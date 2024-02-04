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

const PasswordCategoryChars = {
    Uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    Lowercase: "abcdefghijklmnopqrstuvwxyz",
    Numbers: "0123456789",
    SpecialChars: "!@#$%^&*",
}

function generatePassword(length, uppercase, lowercase, numbers, specialChars) {
    const UppercasePasswordPool = new PasswordCategoryPool(PasswordCategoryChars.Uppercase);
    const LowercasePasswordPool = new PasswordCategoryPool(PasswordCategoryChars.Lowercase);
    const NumbersPasswordPool = new PasswordCategoryPool(PasswordCategoryChars.Numbers);
    const SpecialCharsPasswordPool = new PasswordCategoryPool(PasswordCategoryChars.SpecialChars);

    // Create a character pool based on options
    let allCharPoolChars = "";
    if (uppercase) allCharPoolChars += PasswordCategoryChars.Uppercase;
    if (lowercase) allCharPoolChars += PasswordCategoryChars.Lowercase;
    if (numbers) allCharPoolChars += PasswordCategoryChars.Numbers;
    if (specialChars) allCharPoolChars += PasswordCategoryChars.SpecialChars;

    // Check if any options are provided
    if (allCharPoolChars.length === 0) {
        console.error("Please select at least one option for the password.");
        return "";
    }

    const AllCharPool = new PasswordCategoryPool(allCharPoolChars);
    let password = "";

    // Ensure at least one character from each selected character set is included
    if (uppercase) password += UppercasePasswordPool.genRandomChar();
    if (lowercase) password += LowercasePasswordPool.genRandomChar();
    if (numbers) password += NumbersPasswordPool.genRandomChar();
    if (specialChars) password += SpecialCharsPasswordPool.genRandomChar();

    // Generate the remaining characters
    for (let i = password.length; i < length; i++) {
        password += AllCharPool.genRandomChar();
    }

    // Shuffle the password characters to make it more random
    password = password.split("").sort(() => Math.random() - 0.5).join("");

    return password;
}
