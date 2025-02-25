import { prop } from "@zos/ui";
import { TOTP } from "../../../lib/totp-quickjs";
import {
    RenderExpireBar,
    RenderOTPValue,
    RenderTOTPContainer,
} from "../totpRenderer";

/**
 *
 * @param {Array<TOTP>} buffer
 */
export function initLoop(buffer) {
    renderContainers(buffer);
    renderTOTPs(buffer);
}

function renderContainers(buffer) {
    for (let i = 0; i < buffer.length; i++) {
        RenderTOTPContainer(i, buffer[i].issuer, buffer[i].client);
    }
}

const renderData = [];
function renderTOTPs(buffer) {
    for (let i = 0; i < buffer.length; i++) {
        let otpData = TOTP.copy(buffer[i]).getOTP();
        renderData[i] = {
            OTP: RenderOTPValue(i, otpData.otp),
            expireBar: RenderExpireBar(
                i,
                otpData.createdTime,
                buffer[i].fetchTime
            ),
        };
        setInterval(() => {
            const expireDif = Math.abs(
                (Date.now() - otpData.createdTime) /
                    1000 /
                    buffer[i].fetchTime -
                    1
            );

            renderData[i].expireBar.setProperty(prop.MORE, {
                end_angle: expireDif * 360 - 90,
                color: expireDif > 0.25 ? 0x1ca9c9 : 0xfa0404,
            });

            if (otpData.expireTime < Date.now()) {
                otpData = TOTP.copy(buffer[i]).getOTP();
                renderData[i].OTP.setProperty(prop.MORE, {
                    text: otpData.otp,
                });
            }
        }, 50);
    }
}
