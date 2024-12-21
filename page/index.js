import { setStatusBarVisible } from '@zos/ui'
import { RenderAddButton } from './render/totpRenderer'
import { initLoop } from './render/index/renderer'

const app = getApp()

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
		if (buffer.length < 1)
			RenderAddButton('page/tip')
		else{
			initLoop(buffer)
		}
	}
})