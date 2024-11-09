import { getDeviceInfo } from '@zos/device'
import { push } from '@zos/router'
import { createWidget, widget } from '@zos/ui'

import {TOTP} from '../lib/totp.js/lib/totp.js'

Page({
  build() {
    
    const totp = new TOTP('asdasd')

    const {width, height} = getDeviceInfo()
    createWidget(widget.TEXT, {
      x: width / 2 - 30,
      y: height / 2 - 60,
      text: totp.genOTP()
    })
    createWidget(widget.BUTTON,{
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
  }
})
