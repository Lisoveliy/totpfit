import { TOTP } from "../../lib/totp.js/lib/totp";

export class TOTPBuffer{
    constructor(){

    }

    getTOTPs(){
        return [new TOTPData("Contabo-Customer-Control-Panel-11755808: my.contabo.com", new TOTP(TOTP.encode('UU5WIIWKDNAHUNNL')).genOTP()), 
            new TOTPData("OTPData", new TOTP(TOTP.encode('LCHJZO23LT3Z2QYNYAYAJXH5HFDZ5YI2')).genOTP()),
            new TOTPData("test", new TOTP(TOTP.encode('GAXHMZDEGJVG64LP')).genOTP())]
    }
}

export class TOTPData{
    constructor(name, data){
        this.name = name;
        this.data = data;
    }
}