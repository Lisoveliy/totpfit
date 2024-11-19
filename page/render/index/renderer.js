import { deleteWidget } from "@zos/ui";
import { TOTP } from "../../../lib/totp-quickjs";
import { RenderAddButton, RenderExpireBar, RenderOTPValue, RenderTOTPContainer } from '../totpRenderer'

/**
 * 
 * @param {Array<TOTP>} buffer 
 */
export function initLoop(buffer) {
    renderContainers(buffer)
    renderTOTPs(buffer)
}

function renderContainers(buffer) {
    for (let i = 0; i < buffer.length; i++) {
        RenderTOTPContainer(i, buffer[i].issuer, buffer[i].client)
    }
}
const renderData = []

function renderTOTPs(buffer) {
    for (let i = 0; i < buffer.length; i++) {
        let otpData = TOTP.copy(buffer[i]).getOTP(Date.now())
        console.log(otpData.otp)
        renderData[i] = {}
        renderData[i].OTP = RenderOTPValue(i, otpData.otp),
        renderData[i].expireBar = RenderExpireBar(i, otpData.createdTime, buffer[i].fetchTime)
        setInterval(() => {
            deleteWidget(renderData[i].expireBar)
            renderData[i].expireBar = RenderExpireBar(i, otpData.createdTime, buffer[i].fetchTime)
            if(otpData.expireTime < Date.now()){
                otpData = TOTP.copy(buffer[i]).getOTP(Date.now())
                deleteWidget(renderData[i].OTP)
                renderData[i].OTP = RenderOTPValue(i, otpData.otp)
            }
        }, 500)
    }
}