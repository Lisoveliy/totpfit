import { getHOTP } from "./OTPGenerator.js";
/**
 * TOTP instance
 */
export class TOTP {
    /**
     *
     * @param {string} secret base32 encoded string
     * @param {string} issuer issuer of TOTP
     * @param {string} client client of TOTP
     * @param {number} [digits=6] number of digits in OTP token
     * @param {number} [fetchTime=30] period of token in seconds
     * @param {number} [timeOffset=0] time offset for token in seconds
     * @param {string} [hashType='SHA-1'] type of hash (more in jsSHA documentation)
     */
    constructor(
        secret,
        issuer,
        client,
        digits = 6,
        fetchTime = 30,
        timeOffset = 0,
        hashType = "SHA-1",
    ) {
        this.secret = secret;
        this.issuer = issuer;
        this.client = client;
        this.digits = digits;
        this.fetchTime = fetchTime;
        this.timeOffset = timeOffset;
        this.hashType = hashType;
    }
    static copy(totp) {
        return new TOTP(
            (secret = totp.secret),
            (issuer = totp.TOTPissuer),
            (client = totp.client),
            (digits = totp.digits),
            (fetchTime = totp.fetchTime),
            (timeOffset = totp.timeOffset),
            (hashType = totp.hashType),
        );
    }
    /**
     *
     * @param {number} time time for counter (default unix time epoch)
     * @returns OTP instance
     */
    getOTP(time = Date.now()) {
        const unixTime = (time / 1000 + this.timeOffset) / this.fetchTime;
        const otp = getHOTP(
            Math.floor(unixTime),
            this.secret,
            this.digits,
            this.hashType,
        );
        const expireTime =
            time +
            (this.fetchTime -
                ((time / 1000 + this.timeOffset) % this.fetchTime)) *
                1000;
        const createdTime =
            time - ((time / 1000 + this.timeOffset) % this.fetchTime) * 1000;

        return new OTP(otp, createdTime, expireTime);
    }
}

/**
 * Class for TOTP.getOTP result
 */
export class OTP {
    /**
     *
     * @param {string} otp OTP string
     * @param {number} createdTime time in unix epoch created OTP
     * @param {number} expireTime time in unix epoch to expire OTP
     */
    constructor(otp, createdTime, expireTime) {
        this.otp = otp;
        this.createdTime = createdTime;
        this.expireTime = expireTime;
    }
}
