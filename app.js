import { TOTP } from "./lib/totp-quickjs"
import { LocalStorage } from "@zos/storage"

const localStorage = new LocalStorage()
App({
  globalData: {
    TOTPS: localStorage.getItem('TOTPs') || []
  },
  onCreate(options) {
     localStorage.setItem('TOTPs', [
      new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'Iasd')
    ])
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})