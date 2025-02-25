import { BaseSideService } from "@zeppos/zml/base-side"

AppSideService(
  BaseSideService(
    {
      onInit(){

      },
      onRequest(req, res){
        if(req.method === 'totps'){
          console.log(req)
          console.log(`sending response: ${settings.settingsStorage.getItem('TOTPs')}`)
          res(null, settings.settingsStorage.getItem('TOTPs'))
        }
      },
      onSettingsChange(set){
        console.log(set)
      }
    }
  )
)