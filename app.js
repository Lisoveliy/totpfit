import { TOTP } from "./lib/totp-quickjs"
import { LocalStorage } from "@zos/storage"

const localStorage = new LocalStorage()
App({
  globalData: {
    TOTPS: localStorage.getItem('TOTPs') || []
  },
  onCreate(options) {
    //  localStorage.setItem('TOTPs', [
    //   new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'Iasd', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'Isgfsd', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'Idfklgj', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'Ibcopiu', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'Ioprfhujoidkfmv', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'If', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'I2', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'I3', 6, 30, 0, 'SHA-1'),
    //   new TOTP('JBSWY3DPEHPK3PXPQ', 'totp.danhersam.com', 'I4', 6, 30, 0, 'SHA-1')
    // ])
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})