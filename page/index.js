import { RenderAddButton } from './render/totpRenderer'
import { initLoop } from './render/index/renderer'
import { BasePage } from '@zeppos/zml/base-page'

const app = getApp()
let waitForFetch = true;
Page(
	BasePage({
		onInit() {
			this.getTOTPData().then((x) => {
				console.log(x)
				app._options.globalData.TOTPS = x ?? []
				this.initPage()
			})
			.catch(() => {
			 	app._options.globalData.TOTPS = []
				this.initPage()
			 })
		},
		build() {
			let fetch = setInterval(() => {
				if(waitForFetch)
					return;

				clearInterval(fetch);
				const buffer = app._options.globalData.TOTPS
				if (buffer.length < 1){
					RenderAddButton('page/tip')
				}
				else {
					initLoop(buffer)
				}
			}, 100);
		},
		initPage() {
			waitForFetch = false;
		},
		getTOTPData() {
			return this.request({
				method: 'totps'
			})
		}
	})
)