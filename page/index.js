import { getDeviceInfo } from '@zos/device'
import { push } from '@zos/router'
import { setStatusBarVisible, createWidget, widget, align, prop, text_style, event } from '@zos/ui'

import { TOTPBuffer } from './totplogic/totps.js'

Page({
  build() {
    setStatusBarVisible(false);
    buf = new TOTPBuffer();

    const { width, height } = getDeviceInfo()
    buffer = buf.getTOTPs();
    if(buffer.length < 1){
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
    }else{
      const buttonWidth = width - width / 20;
      const buttonHeight = height / 4;
      const margin = 10;
      let totpHeight = margin;

      for(let i = 0; i < buffer.length; i++){
        createWidget(widget.FILL_RECT, {
          x: width / 2 - buttonWidth / 2,
          y: totpHeight,
          w: buttonWidth,
          h: buttonHeight,
          color: 0x303030,
          radius: 20
        })
        createWidget(widget.TEXT, {
          x: 0,
          y: totpHeight + 10,
          w: width,
          h: 26,
          color: 0xa0a0a0,
          text_size: 24,
          align_h: align.CENTER_H,
          align_v: align.CENTER_V,
          text_style: text_style.NONE,
          text: buffer[i].name
        })
        createWidget(widget.TEXT, {
          x: 0,
          y: totpHeight + 60,
          w: width,
          h: 36,
          color: 0xffffff,
          text_size: 36,
          align_h: align.CENTER_H,
          align_v: align.CENTER_V,
          text_style: text_style.NONE,
          text: buffer[i].data
        })

        totpHeight += margin + buttonHeight;
      }
    }
  }
})
