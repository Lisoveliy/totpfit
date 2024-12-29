import { TOTP } from "../../lib/totp-quickjs";

const otpScheme = "otpauth:/";

export function getTOTPByLink(link){
    try{
    let args = link.split("/", otpScheme.length)
    let type = args[2] //Returns 'hotp' or 'totp'
    let issuer = args[3].split(':')[0]?.split('?')[0] //Returns issuer
    let client = args[3].split(':')[1]?.split('?')[0] ?? args[3].split(':')[0]?.split('?')[0] //Returns client
    let secret = args[3].split('secret=')[1]?.split('&')[0] //Returns secret
    let period = args[3].split('period=')[1]?.split('&')[0] //Returns period
    let digits = args[3].split('digits=')[1]?.split('&')[0] //Returns digits
    let algorithm = args[3].split('algorithm=')[1]?.split('&')[0] //Returns algorithm
    }
    catch(err){
        throw new Error("Link is not valid")
    }
    if(type.toLowerCase() != 'totp')
        throw new Error("Type is not valid, requires 'TOTP'")

    if(secret === undefined)
        throw new Error("Secret not defined")

    issuer = issuer.replace("%20", " ")
    client = client.replace("%20", " ")

    return new TOTP(secret, issuer, client, digits, period, 0, getHashType(algorithm))
}

function getHashType(algorithm){
    if(algorithm == "SHA1")
        return "SHA-1"
    if(algorithm == "SHA256")
        return "SHA-256"
    if(algorithm == "SHA512")
        return "SHA-512"
    else
        return null
}
