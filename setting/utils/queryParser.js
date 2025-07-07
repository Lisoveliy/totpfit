import { decodeProto, TYPES } from "../../lib/protobuf-decoder/protobufDecoder";
import { TOTP } from "../../lib/totp-quickjs";
import { base64decode, encode } from "../../lib/totp-quickjs/base32decoder";

const otpauthScheme = "otpauth:/";
const googleMigrationScheme = "otpauth-migration:/";

export function getTOTPByLink(link) {
	if(link.includes(otpauthScheme))
		return getByOtpauthScheme(link)
	if(link.includes(googleMigrationScheme))
		return getByGoogleMigrationScheme(link)

	return null;
}

function getHashType(algorithm) {
	if (algorithm == "SHA1") return "SHA-1";
	if (algorithm == "SHA256") return "SHA-256";
	if (algorithm == "SHA512") return "SHA-512";
	else return "SHA-1";
}

function getByOtpauthScheme(link){
	try {
		let args = link.split("/", otpauthScheme.length);
		let type = args[2]; //Returns 'hotp' or 'totp'
		let issuer = args[3].split(":")[0]?.split("?")[0]; //Returns issuer
		let client =
			args[3].split(":")[1]?.split("?")[0] ??
			args[3].split(":")[0]?.split("?")[0]; //Returns client
		let secret = args[3].split("secret=")[1]?.split("&")[0]; //Returns secret
		let period = args[3].split("period=")[1]?.split("&")[0]; //Returns period
		let digits = args[3].split("digits=")[1]?.split("&")[0]; //Returns digits
		let algorithm = args[3].split("algorithm=")[1]?.split("&")[0]; //Returns algorithm
		let offset = args[3].split("offset=")[1]?.split("&")[0] ?? 0; //Returns offset

		if (type.toLowerCase() != "totp")
			throw new Error("Type is not valid, requires 'TOTP'");

		if (secret === undefined) throw new Error("Secret not defined");

        if(issuer == client){
            issuer = args[3].split("issuer=")[1]?.split("&")[0];
        }

		issuer = decodeURIComponent(issuer);
		client = decodeURIComponent(client);

		return new TOTP(
			secret,
			issuer,
			client,
			digits,
			period,
			Number(offset),
			getHashType(algorithm)
		);
	} catch (err) {
        console.log(err)
		return null;
	}
}

function getByGoogleMigrationScheme(link){

    let data = link.split("data=")[1]; //Returns base64 encoded data
    data = decodeURIComponent(data);
    let decode = base64decode(data);
    let proto = decodeProto(decode);

    let protoTotps = [];

    proto.parts.forEach(part => {
        if(part.type == TYPES.LENDELIM){
            protoTotps.push(decodeProto(part.value));
        }
    });

    let totps = [];
    protoTotps.forEach(x => {
        let type = x.parts.filter(x => x.index == 6)[0]; //find type of OTP
        if(type.value !== '2'){
            console.log("ERR: it's a not TOTP record")
            return;
        }
        let secret = x.parts.filter(x => x.index == 1)[0].value;
        secret = encode(secret);

        let name = bytesToString(x.parts.filter(x => x.index == 2)[0].value);
        let issuer = bytesToString(x.parts.filter(x => x.index == 3)[0].value);
        
        totps.push(new TOTP(
			secret,
			issuer,
			name,
			6,
			30,
			0,
            "SHA-1"
		));
    });

    return totps;
    
}

function bytesToString(bytes) {
    let str = '';
    for (let i = 0; i < bytes.length; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return str;
}