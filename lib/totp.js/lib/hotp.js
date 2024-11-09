import { encode, decode } from '../../base32/index.js'
import jsSHA from 'jssha'

export class HOTP {

  /**
   *
   * @param {string} key secret key
   * @param {*} digit lenth of otp code
   */
  constructor(key, digit = 6) {
    this.key = key;
    this.digit = digit;
  }
  static encode(data){
    return encode(data)
  }
  /**
   * generate secret key
   * @param {int} len
   */
  static randomKey(len = 16) {
    const str = Math.random().toString(36);
    return encode(str).toString().substr(0, len);
  }

  /**
   * generate a OTP base on HMAC-SHA-1
   * @param {int} movingFactor counter
   */
  genOTP(movingFactor) {
    const hmacSha = new jsSHA('SHA-1', 'BYTES');
    hmacSha.setHMACKey(decode(this.key).toString(), 'BYTES');

    const factorByte = this._factor2ByteText(movingFactor);
    hmacSha.update(factorByte);

    const hmac_result = hmacSha.getHMAC('BYTES');
    return this._truncat(hmac_result);
  }

  /**
   * verify a OPT code
   * @param {string} opt opt code
   * @param {int} movingFactor counter
   */
  verify(opt, movingFactor) {
    return opt === this.genOTP(movingFactor);
  }

  _truncat(hmac_result) {
    const offset = hmac_result[19].charCodeAt() & 0xf;
    const bin_code = (hmac_result[offset].charCodeAt() & 0x7f) << 24
      | (hmac_result[offset + 1].charCodeAt() & 0xff) << 16
      | (hmac_result[offset + 2].charCodeAt() & 0xff) << 8
      | (hmac_result[offset + 3].charCodeAt() & 0xff);
    let otp = (bin_code % 10 ** this.digit).toString();
    while (otp.length < this.digit) {
      otp = '0' + otp;
    }
    return otp;
  }

  _factor2ByteText(movingFactor) {
    const text = new Array(8);
    for (let i = text.length - 1; i >= 0; i--) {
      text[i] = String.fromCharCode(movingFactor & 0xFF);
      movingFactor >>= 8;
    }
    return text.join('');
  }
}