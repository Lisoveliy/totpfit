AppSettingsPage({
  build(props) {
    const storage = props.settingsStorage.getItem('TOTPs')
    //props.settingsStorage.setItem('TOTPS')
    console.log(storage)
    const totpButtons = []
    storage.forEach(element => {
      totpButtons.push(
        View({
          style:
          {
            textAlign: "center",
            marginBottom: "10px"
          }
        },
          [Button({
            style: { width: "95%" },
            label: `${element.issuer}: ${element.client}`,
            onClick: (el) => {
              props.settingsStorage.setItem("TOTPs", storage)
            }
          }), Text({
            align: 'center',
          }, `${element.hashType} | ${element.digits} digits | ${element.fetchTime} seconds | offset ${element.timeOffset} seconds`)]))
    });
    var sec = Section({}, [
      View({
        style: { textAlign: "center" }
      },
        Text({
          align: 'center',
        }, 'TOTPS:'))
      ,
      ...totpButtons])
      return sec;
  }
})