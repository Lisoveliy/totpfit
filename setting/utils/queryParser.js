import { decodeProto, TYPES } from "../../lib/protobuf-decoder/protobufDecoder";
import { TOTP } from "../../lib/totp-quickjs";
import { base64decode, encode } from "../../lib/totp-quickjs/base32decoder";

const otpauthScheme = "otpauth://";
const googleMigrationScheme = "otpauth-migration://";

/**
 * Parses a URI link to extract TOTP data.
 * @param {string} link The otpauth or otpauth-migration link.
 * @returns {TOTP|TOTP[]|null} A single TOTP object, an array of TOTP objects, or null if parsing fails.
 */
export function getTOTPByLink(link) {
	// FIX: Check for the more specific migration scheme first to avoid incorrect parsing.
	// Using startsWith for more precise matching.
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
		let type = pathParts[2]; // 'totp' or 'hotp'
		let label = decodeURIComponent(pathParts[3]);

		let issuerFromLabel = label.includes(':') ? label.split(':')[0] : null;
		let client = label.includes(':') ? label.split(':')[1].trim() : label;

		let secret = params.match(/secret=([^&]*)/)?.[1];
		let issuerFromParams = params.match(/issuer=([^&]*)/)?.[1];

		let issuer = issuerFromParams ? decodeURIComponent(issuerFromParams) : issuerFromLabel;
		if (!issuer) issuer = client; // Fallback if issuer is not found

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
		console.log("Failed to parse otpauth scheme:", err)
		return null;
	}
}

function getByGoogleMigrationScheme(link) {
	try {
		const data = link.split("data=")[1];
		if (!data) return null;

		const decodedData = decodeURIComponent(data);
		const buffer = base64decode(decodedData);
		const proto = decodeProto(buffer);

		const totps = [];

		// Filter for the otp_parameters field which is repeated and contains the actual data
		const otpParameters = proto.parts.filter(p => p.index === 1 && p.type === TYPES.LENDELIM);

		otpParameters.forEach(part => {
			try {
				const totpProto = decodeProto(part.value);
				const otpData = {};

				totpProto.parts.forEach(p => {
					switch (p.index) {
						case 1: // secret
							otpData.secret = encode(p.value);
							break;
						case 2: // name (client)
							otpData.name = bytesToString(p.value);
							break;
						case 3: // issuer
							otpData.issuer = bytesToString(p.value);
							break;
						case 4: // algorithm
							otpData.algorithm = p.value;
							break;
						case 5: // digits
							otpData.digits = p.value;
							break;
						case 6: // type
							otpData.type = p.value;
							break;
					}
				});

				// Ensure it's a TOTP record (type 2)
				if (otpData.type !== '2') {
					console.log("Skipping non-TOTP record");
					return; // continue to next record
				}

				// Map protobuf enum values to actual values
				const digitsMap = { '1': 6, '2': 8 };
				const algoMap = { '1': 'SHA-1', '2': 'SHA-256', '3': 'SHA-512' };

				const finalDigits = digitsMap[otpData.digits] || 6;
				const finalAlgo = algoMap[otpData.algorithm] || 'SHA-1';
				const finalIssuer = otpData.issuer || otpData.name; // Use name as a fallback for issuer
				const finalName = otpData.name;

				if (!otpData.secret || !finalName) {
					console.log("Skipping record with missing secret or name.");
					return;
				}

				totps.push(new TOTP(
					otpData.secret,
					finalIssuer,
					finalName,
					finalDigits,
					30, // Period is not in the migration payload, default to 30s
					0,
					finalAlgo
				));
			} catch (e) {
				console.log("Failed to parse one of the TOTP entries in migration data:", e);
			}
		});

		return totps.length > 0 ? totps : null;

	} catch (err) {
		console.log("Failed to parse Google Migration scheme:", err);
		return null;
	}
}

function bytesToString(bytes) {
	let str = '';
	for (let i = 0; i < bytes.length; i++) {
		str += String.fromCharCode(bytes[i]);
	}
	return str;
}
