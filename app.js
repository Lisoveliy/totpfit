import { BaseApp } from "@zeppos/zml/base-app"
import { TOTP } from "./lib/totp-quickjs"

App(
  BaseApp(
    {
      globalData: {
        TOTPS: []
      },
      onCreate() {
      },    
      onDestroy() {
      }
    })
)