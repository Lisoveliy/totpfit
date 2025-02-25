import { BaseSideService } from "@zeppos/zml/base-side"

AppSideService(
  BaseSideService(
    {
      onInit(){

      },
      onRequest(request, response){
        if(request.method === 'totps'){
          response(null, settings.settingsStorage.getItem('TOTPs'))
        }
      },
      onSettingsChange(){ }
    }
  )
)