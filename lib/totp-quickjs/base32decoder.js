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