import { TOTP } from "../../lib/totp-quickjs";

export class TOTPBuffer{
    constructor(){

    }

    getTOTPs(){
        return [new TOTP('JBSWY3DPEHPK3PXP').getOTP()]
    }
}