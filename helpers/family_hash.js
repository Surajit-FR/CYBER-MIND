// Utility function to generate unique family hash
exports.generateUniqueFamilyHash = (familyName) => {
    // const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
    const randomChars = generateRandomCharacters(5); // Generate random characters with a maximum length of 5

    // Combine family name, timestamp, and random characters to create hash
    const hash = familyName.replace(/\s+/g, '') + '#' + randomChars;

    return hash;
};

// Utility function to generate random characters
const generateRandomCharacters = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};