import { decodeProto, TYPES } from "../../lib/protobuf-decoder/protobufDecoder";
import { TOTP } from "../../lib/totp-quickjs";
import { base64decode, encode } from "../../lib/totp-quickjs/base32decoder";

const otpauthScheme = "otpauth://";
const googleMigrationScheme = "otpauth-migration://";

function _parseSingleMigrationEntry(part) {
    const totpProto = decodeProto(part.value);
    const otpData = {};

    const protoPartHandlers = {
        1: (p) => { otpData.secret = encode(p.value); },
        2: (p) => { otpData.name = bytesToString(p.value); },
        3: (p) => { otpData.issuer = bytesToString(p.value); },
        4: (p) => { otpData.algorithm = p.value; },
        5: (p) => { otpData.digits = p.value; },
        6: (p) => { otpData.type = p.value; },
    };

    totpProto.parts.forEach(p => {
        const handler = protoPartHandlers[p.index];
        if (handler) {
            handler(p);
        }
    });

    if (otpData.type !== '2') {
        return null;
    }

    const digitsMap = { '1': 6, '2': 8 };
    const algoMap = { '1': 'SHA-1', '2': 'SHA-256', '3': 'SHA-512' };

    const finalDigits = digitsMap[otpData.digits] || 6;
    const finalAlgo = algoMap[otpData.algorithm] || 'SHA-1';
    const finalIssuer = otpData.issuer || otpData.name;
    const finalName = otpData.name;

    if (!otpData.secret || !finalName) {
        throw new Error("Skipping record with missing secret or name.");
    }

    return new TOTP(
        otpData.secret,
        finalIssuer,
        finalName,
        finalDigits,
        30,
        0,
        finalAlgo
    );
}


function getByGoogleMigrationScheme(link) {
	try {
		const data = link.split("data=")[1];
		if (!data) return null;

		const decodedData = decodeURIComponent(data);
		const buffer = base64decode(decodedData);
		const proto = decodeProto(buffer);

		const totps = [];
		const otpParameters = proto.parts.filter(p => p.index === 1 && p.type === TYPES.LENDELIM);

		otpParameters.forEach(part => {
			const totp = _parseSingleMigrationEntry(part);
			if (totp) {
				totps.push(totp);
			}
		});

		return totps.length > 0 ? totps : null;

	} catch (err) {
		console.log("Failed to parse Google Migration scheme:", err);
		throw new Error("Invalid otpauth-migration:// link. Failed to parse migration data.");
	}
}

export function getTOTPByLink(link) {
	if (link.startsWith(googleMigrationScheme)) {
		return getByGoogleMigrationScheme(link);
	}
	if (link.startsWith(otpauthScheme)) {
		return getByOtpauthScheme(link);
	}

	return null;
}

function getHashType(algorithm) {
	if (algorithm == "SHA1") return "SHA-1";
	if (algorithm == "SHA256") return "SHA-256";
	if (algorithm == "SHA512") return "SHA-512";
	else return "SHA-1";
}

function getByOtpauthScheme(link) {
	try {
		let args = link.split("?");
		let path = args[0];
		let params = args[1];

		let pathParts = path.split("/");
		let type = pathParts[2];
		let label = decodeURIComponent(pathParts[3]);

		let issuerFromLabel = label.includes(':') ? label.split(':')[0] : null;
		let client = label.includes(':') ? label.split(':')[1].trim() : label;

		let secret = params.match(/secret=([^&]*)/)?.[1];
		let issuerFromParams = params.match(/issuer=([^&]*)/)?.[1];

		let issuer = issuerFromParams ? decodeURIComponent(issuerFromParams) : issuerFromLabel;
		if (!issuer) issuer = client;

		let period = params.match(/period=([^&]*)/)?.[1];
		let digits = params.match(/digits=([^&]*)/)?.[1];
		let algorithm = params.match(/algorithm=([^&]*)/)?.[1];
		let offset = params.match(/offset=([^&]*)/)?.[1] ?? 0;

		if (type.toLowerCase() != "totp")
			throw new Error("Type is not valid, requires 'TOTP'");

		if (!secret) throw new Error("Secret not defined");

		return new TOTP(
			secret,
			issuer,
			client,
			Number(digits) || 6,
			Number(period) || 30,
			Number(offset),
			getHashType(algorithm)
		);
	} catch (err) {
		console.log("Failed to parse otpauth scheme:", err);
		throw new Error("Invalid otpauth:// link. Please check the link and try again.");
	}
}

function bytesToString(bytes) {
	let str = '';
	for (let i = 0; i < bytes.length; i++) {
		str += String.fromCharCode(bytes[i]);
	}
	return str;
}