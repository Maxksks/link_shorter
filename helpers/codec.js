const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
const base = alphabet.length;

function encode(num) {
    let encoded = '';
    let number = num;

    while (number) {
        const remainder = number % base;
        encoded = `${alphabet[remainder]}${encoded}`;
        number = Math.floor(number / base);
    }

    return encoded;
}

function decode(str) {
    let string = str;
    let decoded = 0;

    while (string) {
        const index = alphabet.indexOf(string[0]);
        const power = string.length - 1;
        decoded += index * Math.pow(base, power);
        string = string.substring(1);
    }

    return decoded;
}

module.exports = {
    encode,
    decode
};