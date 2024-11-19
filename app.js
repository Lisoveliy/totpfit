import { TOTP } from "./lib/totp-quickjs"
import { LocalStorage } from "@zos/storage"

const localStorage = new LocalStorage()
App({
  globalData: {
    TOTPS: localStorage.getItem('TOTPs') || [
      new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'I', 6, 30, 0, 'SHA-1')
    ]
  },
  onCreate(options) {
     localStorage.setItem('TOTPs', [
      
    ])
   },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})