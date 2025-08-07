import { decode } from "./base32decoder.js";
import jsSHA from "jssha";
"use bigint"

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
    return res;
}

export function getTOTP(secret, digits = 6, time = Date.now(), fetchTime = 30, timeOffset = 0, hashType = 'SHA-1')
{
    const unixTime = Math.round((time / 1000 + timeOffset) / fetchTime)
    return getHOTP(BigInt(unixTime), secret, digits)
}
