import { getDeviceInfo } from '@zos/device'
import { TOTP } from '../lib/totp-quickjs'
import { push } from '@zos/router'
import { setStatusBarVisible, createWidget, widget, align, prop, text_style, event, deleteWidget } from '@zos/ui'

const app = getApp()
const renderWidgets = []

Page({
	onInit() {
		const buffer = app._options.globalData.TOTPS
		console.log(buffer.length)
		if (buffer.length < 1)
			setStatusBarVisible(true)
		else
			setStatusBarVisible(false)
	},
	build() {
		const buffer = app._options.globalData.TOTPS
		if (buffer.length < 1) {

			createWidget(widget.BUTTON, {
				x: width / 2 - 40,
				y: height / 2 - 20,
				w: 80,
				h: 80,
				text: '+',
				radius: 50,
				text_size: 40,
				normal_color: 0x303030,
				press_color: 0x181c18,
				click_func: () => {
					push({
						url: 'page/tip'
					})
				}
			})

		} else {
			renderContainers(buffer)
			renderTOTPs(buffer)
			setInterval(() => {
				renderWidgets.forEach(x => deleteWidget(x))
				renderTOTPs(buffer)
			}, 500)
		}
	}
})

function renderContainers(buffer) {
	const { width, height } = getDeviceInfo()
	const buttonWidth = width - width / 20;
	const buttonHeight = height / 4;
	const margin = 10;
	let totpHeight = margin;

	for (let i = 0; i < buffer.length; i++) {
		const otpData = TOTP.copy(buffer[i]).getOTP()
		createWidget(widget.FILL_RECT, {
			x: width / 2 - buttonWidth / 2,
			y: totpHeight,
			w: buttonWidth,
			h: buttonHeight,
			color: 0x303030,
			radius: 20
		})
		createWidget(widget.TEXT, {
			x: 0 + (width - buttonWidth) / 2,
			y: totpHeight + 10,
			w: width - (width - buttonWidth),
			h: 26,
			color: 0xa0a0a0,
			text_size: 24,
			align_h: align.CENTER_H,
			align_v: align.CENTER_V,
			text_style: text_style.NONE,
			text: buffer[i].issuer + ': ' + buffer[i].client
		})

		totpHeight += margin + buttonHeight;
	}
}
function renderTOTPs(buffer) {
	const { width, height } = getDeviceInfo()
	const buttonWidth = width - width / 20;
	const buttonHeight = height / 4;
	const margin = 10;
	let totpHeight = margin;

	for (let i = 0; i < buffer.length; i++) {
		const otpData = TOTP.copy(buffer[i]).getOTP()
		renderWidgets.push(
			createWidget(widget.TEXT, {
				x: 0,
				y: totpHeight + 50,
				w: width,
				h: 40,
				color: 0xffffff,
				text_size: 40,
				align_h: align.CENTER_H,
				align_v: align.CENTER_V,
				text_style: text_style.NONE,
				text: otpData.otp
			}))

		const expireDif = Math.abs((((Date.now() - otpData.createdTime) / 1000)
			/ buffer[i].fetchTime) - 1)
		renderWidgets.push(
			expireTimeWg = createWidget(widget.ARC, {
				x: buttonWidth - 50,
				y: totpHeight + 52,
				w: 40,
				h: 40,
				line_width: 5,
				color: 0x1ca9c9,
				start_angle: -90,
				end_angle: (expireDif * 360) - 90,
				text: expireDif
			})
		)

		totpHeight += margin + buttonHeight;
	}
}

function RenderExpireWg(otpData, totpHeight, buttonWidth, buffer, i) {
	const interval = setInterval(() => {
		const expireDif = Math.abs((((Date.now() - otpData.createdTime) / 1000)
			/ buffer[i].fetchTime) - 1)
		if (Date.now() > otpData.expireTime) {
			clearInterval(interval)
			return
		}

		deleteWidget(expireTimeWg)
		expireTimeWg = createWidget(widget.ARC, {
			x: buttonWidth - 50,
			y: totpHeight + 52,
			w: 40,
			h: 40,
			line_width: 5,
			color: 0x1ca9c9,
			start_angle: -90,
			end_angle: (expireDif * 360) - 90,
			text: expireDif
		})
	}, 100)
}
