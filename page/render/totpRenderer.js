import { getDeviceInfo } from "@zos/device";
import { push } from "@zos/router";
import { createWidget, widget, align, text_style } from "@zos/ui";

//Renderer module for TOTPs page

const { width, height } = getDeviceInfo();
const buttonWidth = width - width / 20; //Width of container
const buttonHeight = height / 4; //Height of container

const containerColor = 0x303030; //Color of container
const containerRadius = 20; //Corner radius of container

const textColor = 0xa0a0a0; //Color of TOTP description text
const textSize = 24; //Size of TOTP description text
const statusBarPading = 65;

/** Function for render box container for TOTP values
 *
 * @param {number} position position offset of container
 * @param {string} issuer issuer of TOTP
 * @param {string} client client of TOTP
 */
export function RenderTOTPContainer(position, issuer, client) {
    const yPos = getYPos(position);
    createWidget(widget.FILL_RECT, {
        x: width / 2 - buttonWidth / 2,
        y: yPos,
        w: buttonWidth,
        h: buttonHeight,
        color: containerColor,
        radius: containerRadius,
    });
    createWidget(widget.TEXT, {
        x: 0 + (width - buttonWidth) / 2,
        y: yPos + 10,
        w: width - (width - buttonWidth),
        h: 26,
        color: textColor,
        text_size: textSize,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.NONE,
        text: issuer + ": " + client,
    });
}

/** Render OTP Value on container
 *
 * @param {number} position position offset of container
 * @param {string} otpValue value to display
 * @returns widget with OTP
 */
export function RenderOTPValue(position, otpValue) {
    const yPos = getYPos(position);
    return createWidget(widget.TEXT, {
        x: 0,
        y: yPos + 50,
        w: width,
        h: 40,
        color: 0xffffff,
        text_size: 40,
        align_h: align.CENTER_H,
        align_v: align.CENTER_V,
        text_style: text_style.NONE,
        text: otpValue,
    });
}

/** Render expire bar
 *
 * @param {} position position offset of container
 * @param {*} createdTime UNIX epoch time of creation
 * @param {*} fetchTime time in seconds to fetch value
 * @returns widget with bar
 */
export function RenderExpireBar(position, createdTime, fetchTime) {
    const yPos = getYPos(position);
    const expireDif = Math.abs(
        (Date.now() - createdTime) / 1000 / fetchTime - 1
    );
    return createWidget(widget.ARC, {
        x: buttonWidth - 50,
        y: yPos + 52,
        w: 40,
        h: 40,
        line_width: 5,
        color: expireDif > 0.25 ? 0x1ca9c9 : 0xfa0404,
        start_angle: -90,
        end_angle: expireDif * 360 - 90,
        text: expireDif,
    });
}

/** Function for render 'Add' button on center of screen
 *
 * @param {string} pagePath destination to page onClick ex: 'page/index'
 */
export function RenderAddButton(pagePath) {
    createWidget(widget.BUTTON, {
        x: width / 2 - 40,
        y: height / 2 - 20,
        w: 80,
        h: 80,
        text: "+",
        radius: 50,
        text_size: 40,
        normal_color: 0x303030,
        press_color: 0x181c18,
        click_func: () => {
            push({
                url: pagePath,
            });
        },
    });
}

function getYPos(position) {
    return position * (buttonHeight + 10) + statusBarPading;
}
