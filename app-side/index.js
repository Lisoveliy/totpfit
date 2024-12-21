AppSideService(
    {
      onInit(){
        settings.settingsStorage.addListener('change', async ({ key, newValue, oldValue }) => {
             console.log(key)
             console.log(newValue)
             const totps = settings.settingsStorage.getItem('TOTPs')
             const dataBuffer = Buffer.from(totps)
             messaging.peerSocket.send(dataBuffer.buffer)
        })
      }
    }
  )