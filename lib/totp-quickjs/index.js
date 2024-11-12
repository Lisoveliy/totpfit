import { getHOTP } from "./OTPGenerator.js"
"use bigint"
/**
 * TOTP instance
 */
export class TOTP{
    /**
     * 
     * @param {string} secret base32 encoded string 
     * @param {string} issuer issuer of TOTP
     * @param {number} [digits=6] number of digits in OTP token
     * @param {number} [fetchTime=30] period of token in seconds
     * @param {number} [timeOffset=0] time offset for token in seconds 
     * @param {string} [hashType='SHA-1'] type of hash (more in jsSHA documentation)
     */
    constructor(secret, 
                issuer,
                digits = 6,
                fetchTime = 30, 
                timeOffset = 0, 
                hashType = 'SHA-1')
        {
            this.secret = secret
            this.issuer = issuer
            this.digits = digits
            this.fetchTime = fetchTime
            this.timeOffset = timeOffset
            this.hashType = hashType
        }
    /**
     * 
     * @param {number} time time for counter (default unix time epoch)
     * @returns OTP instance
     */
    getOTP(time = Date.now()){
        const unixTime = (time / 1000 + this.timeOffset) / this.fetchTime
        const otp = getHOTP(Math.floor(unixTime), this.secret, this.digits)
        const expireTime = time + 
                                (this.fetchTime - 
                                (time / 1000 + this.timeOffset) % 
                                this.fetchTime) * 1000

        return new OTP(otp, expireTime)
    }
}

/**
 * Class for TOTP.getOTP result
 */
export class OTP{
    /**
     * 
     * @param {string} otp OTP string
     * @param {number} expireTime time in seconds to reset OTP 
     */
    constructor(otp, expireTime)
    {
        this.otp = otp
        this.expireTime = expireTime
    }
}