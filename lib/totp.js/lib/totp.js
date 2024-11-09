import { HOTP } from "./hotp.js";

export class TOTP extends HOTP {
  constructor(key) {
    super(key)
  }

  genOTP(timeStep = 30, t0 = 0) {
    const T = Math.floor((Date.now() / 1000 - t0) / timeStep);
    return super.genOTP(T);
  }

  verify(otp, timeStep = 30, t0 = 0) {
    return otp === this.genOTP(timeStep, t0);
  }
}