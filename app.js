import { TOTP } from "./lib/totp-quickjs"
import { LocalStorage } from "@zos/storage"

const localStorage = new LocalStorage()
App({
  globalData: {
    TOTPS: localStorage.getItem('TOTPs') || []
  },
  onCreate(options) {
    //  localStorage.setItem('TOTPs', [
    //   new TOTP('JBSWY3DPEHPK3PXP', 'totp.danhersam.com', 'I1', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXP', 'totp.danhersam.com', 'I2', 6, 30, 5, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXP', 'totp.danhersam.com', 'I3', 6, 30, -5, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXP', 'totp.danhersam.com', 'I4', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXP', 'totp.danhersam.com', 'I5', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXP', 'totp.danhersam.com', 'I6', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXP', 'totp.danhersam.com', 'I7', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXP', 'totp.danhersam.com', 'I8', 6, 30, 0, 'SHA-1')
    // ])
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})