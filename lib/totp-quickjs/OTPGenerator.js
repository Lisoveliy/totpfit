import { decode } from "./base32decoder.js";
import jsSHA from "jssha";
"use bigint"
/**
 * get HOTP based on counter
 * @param {BigInt} counter BigInt counter of HOTP
 * @param {string} secret base32 encoded string 
 * @param {number} [digits=6] number of digits in OTP token
 * @param {string} [hashType='SHA-1'] type of hash (more in jsSHA documentation)
 * @returns HOTP string
 */
export function getHOTP(counter, secret, digits = 6, hashType = 'SHA-1'){

    //Stage 1: Prepare data
    const rawDataCounter = new DataView(new ArrayBuffer(8))
    rawDataCounter.setUint32(4, counter)
    
    const bCounter = new Uint8Array(rawDataCounter.buffer)
    const bSecret = new Uint8Array(decode(secret).match(/.{1,2}/g).map(chunk => parseInt(chunk, 16))); //confirmed
    
    //Stage 2: Hash data
    const jssha = new jsSHA(hashType, 'UINT8ARRAY')
    jssha.setHMACKey(bSecret, 'UINT8ARRAY')
    jssha.update(bCounter)
    const hmacResult = jssha.getHMAC('UINT8ARRAY') //confirmed
    
    //Stage 3: Dynamic truncate
    const offsetB = hmacResult[19] & 0xf;
    const P = hmacResult.slice(offsetB, offsetB + 4)
    P[0] = P[0] & 0x7f;
    
    //Stage 4: Format string
    let res = (new DataView(P.buffer).getInt32(0) % Math.pow(10, digits)).toString()
    while(res.length < digits)
        res = '0' + res;
    return res.substring(0, 3) + " " + res.substring(3);
}

/**
 * get OTP based on current time
 * @param {string} secret base32 encoded string 
 * @param {number} [digits=6] digits in OTP
 * @param {number} [time=Date.now()] time for counter (default unix time epoch)
 * @param {number} [fetchTime=30] period of token in seconds
 * @param {number} [timeOffset=0] time offset for token in seconds 
 * @param {string} [hashType='SHA-1'] type of hash (more in jsSHA documentation)
 * @returns TOTP string
 */
export function getTOTP(secret, digits = 6, time = Date.now(), fetchTime = 30, timeOffset = 0, hashType = 'SHA-1')
{
    const unixTime = Math.round((time / 1000 + timeOffset) / fetchTime)
    return getHOTP(BigInt(unixTime), secret, digits)
}
