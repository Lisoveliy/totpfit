import { createWidget, widget, align } from "@zos/ui";
import { getDeviceInfo } from "@zos/device";
import { onGesture, GESTURE_LEFT } from '@zos/interaction'
import { back } from "@zos/router";
import { BasePage } from "@zeppos/zml/base-page";
Page(
    BasePage({
        onInit() {
            onGesture({
                callback(event) {
                    if (event === GESTURE_LEFT) {
                        back()
                    }
                }
            })
        },
        build() {
            const { width, height } = getDeviceInfo()
            createWidget(widget.TEXT, {
                x: 0,
                w: width,
                h: height,
                color: 0xffffff,
                text_size: 30,
                align_h: align.CENTER_H,
                align_v: align.CENTER_V,
                text: 'To add TOTP record open\n settings on Zepp app'
            })
        }
    })
)