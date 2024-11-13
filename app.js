import { TOTP } from "./lib/totp-quickjs"
import { LocalStorage } from "@zos/storage"

const localStorage = new LocalStorage()
App({
  globalData: {
    TOTPS: localStorage.getItem('TOTPs') || []
  },
  onCreate(options) {
     localStorage.setItem('TOTPs', [
       new TOTP('JBSWY3DPEHPK3PXP', 'GitHub', 'Lisoveliy'),
       new TOTP('JBSWY3DPEHPK3PXP', 'GitHub', 'Lisoveliy'),
       new TOTP('JBSWY3DPEHPK3PXP', 'GitHub', 'Lisoveliy'),
       new TOTP('JBSWY3DPEHPK3PXP', 'GitHub', 'Lisoveliy'),
       new TOTP('JBSWY3DPEHPK3PXP', 'GitHub', 'Lisoveliy'),
       new TOTP('JBSWY3DPEHPK3PXPAF', 'my.contabo.com', 'Contabo-Customer-Control-Panel-11755808'),
       new TOTP('JBSWY3DPEHPK3PXP', 'GitHub', 'Lisoveliy'),
       new TOTP('JBSWY3DPEHPK3PXPAF', 'my.contabo.com', 'Contabo-Customer-Control-Panel-11755808')])
   },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})