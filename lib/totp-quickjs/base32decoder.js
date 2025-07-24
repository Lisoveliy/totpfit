export function decode(base32) {
    for (
        var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
            bits = "",
            hex = "",
            i = 0;
        i < base32.length;
        i++
    ) {
        var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, "0");
    }
    for (i = 0; i + 4 <= bits.length; i += 4) {
        var chunk = bits.substr(i, 4);
        hex += parseInt(chunk, 2).toString(16);
    }
    return hex;
}

function leftpad(str, len, pad) {
    return (
        len + 1 >= str.length &&
            (str = new Array(len + 1 - str.length).join(pad) + str),
        str
    );
}

export function encode(bytes) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = 0;
    let value = 0;
    let output = "";

    for (let i = 0; i < bytes.length; i++) {
        value = (value << 8) | bytes[i];
        bits += 8;

        while (bits >= 5) {
            output += alphabet[(value >>> (bits - 5)) & 0x1f];
            bits -= 5;
        }
    }

    if (bits > 0) {
        output += alphabet[(value << (5 - bits)) & 0x1f];
    }

    const paddingLength = (8 - (output.length % 8)) % 8;
    output += "=".repeat(paddingLength);

    return output;
}

export function base64decode(base64) {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let result = [];
    let i = 0,
        j = 0;
    let b1, b2, b3, b4;

    while (i < base64.length) {
        b1 = chars.indexOf(base64.charAt(i++));
        b2 = chars.indexOf(base64.charAt(i++));
        b3 = chars.indexOf(base64.charAt(i++));
        b4 = chars.indexOf(base64.charAt(i++));

        if (b1 === -1 || b2 === -1) break;

        result[j++] = (b1 << 2) | (b2 >> 4);

        if (b3 !== -1) {
            result[j++] = ((b2 & 15) << 4) | (b3 >> 2);
        }

        if (b4 !== -1) {
            result[j++] = ((b3 & 3) << 6) | b4;
        }
    }

    return result.slice(0, j);
}
