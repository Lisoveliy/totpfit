import { BaseSideService } from "@zeppos/zml/base-side"

AppSideService(
  BaseSideService(
    {
      onInit(){

      },
      onRequest(req, res){
        if(req.method === 'totps'){
          res(null, settings.settingsStorage.getItem('TOTPs'))
        }
      }
    }
  )
)