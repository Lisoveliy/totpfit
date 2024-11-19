import { getDeviceInfo } from '@zos/device'
import { TOTP } from '../lib/totp-quickjs'
import { setStatusBarVisible, createWidget, widget, align, prop, text_style, event, deleteWidget } from '@zos/ui'
import { RenderAddButton, RenderExpireBar, RenderOTPValue, RenderTOTPContainer } from './render/totpRenderer'

const app = getApp()
const { width, height } = getDeviceInfo()

const renderWidgets = []

Page({
	onInit() {
		//If app has no saved TOTPs
		if (app._options.globalData.TOTPS.length < 1)
			setStatusBarVisible(true)
		else
			setStatusBarVisible(false)
	},
	build() {
		const buffer = app._options.globalData.TOTPS
		if (buffer.length < 1) {
			RenderAddButton('page/tip')
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
	for (let i = 0; i < buffer.length; i++) {
		RenderTOTPContainer(i, buffer[i].issuer, buffer[i].client)
	}
}
function renderTOTPs(buffer) {
	for (let i = 0; i < buffer.length; i++) {
		const otpData = TOTP.copy(buffer[i]).getOTP()
		renderWidgets.push(
			RenderOTPValue(i, otpData.otp))
		renderWidgets.push(
			RenderExpireBar(i, otpData.createdTime, buffer[i].fetchTime)
		)
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
