let _props = null;

AppSettingsPage({
  build(props) {
    _props = props;
    const storage = props.settingsStorage.getItem("TOTPs");
    const totpEntrys = GetTOTPList(storage);

    var body = Section(
      {
        style: {
          backgroundColor: "black",
          minHeight: "100vh",
        },
      },
      [
        View(
          {
            style: {
              textAlign: "center",
            },
          },
          Text(
            {
              align: "center",
              paragraph: true,
              style: {
                marginBottom: "10px",
                color: "#fff",
                fontSize: 23,
                verticalAlign: "middle",
              },
            },
            "TOTPS:"
          )
        ),
        ...totpEntrys
      ]
    );
    return body;
  },
});

function GetTOTPList(storage){
  let totpEntrys = [];
  let counter = 0;
  storage.forEach((element) => {
    const elementId = counter;
    const textInput = TextInput({
      placeholder: "otplink",
      label: "Change OTP link",
      labelStyle: {
        backgroundColor: "#14213D",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px",
        flexGrow: 1,
        fontSize: "20px",
        color: "#E5E5E5",
        borderRadius: "5px"
      },
    });
    const textBig = Text(
      {
        align: "center",
        style: {
          color: "#ffffff",
          fontSize: "16px"
        },
        paragraph: true,
      },
      `${element.issuer}: ${element.client}`
    );
    const delButton = Button(
      {
        onClick: (el) => {
          storage = storage.filter(x => storage.indexOf(x) != elementId)
          updateStorage(storage)
        },
        style: {
          backgroundColor: "#ba181b",
          fontSize: "18px",
          color: "#ffffff",
          height: "fit-content",
          margin: "10px"
        },
        label: "DEL"
      }
    );
    const text = Text(
      {
        style: {
          color: "#ffffff",
          fontSize: "14px"
        },
        align: "center"
      },
      `${element.hashType} | ${element.digits} digits | ${element.fetchTime} seconds | offset ${element.timeOffset} seconds`
    );
    const view = View(
      {
        style: {
          textAlign: "center",
          border: "2px solid white",
          borderRadius: "5px",
          margin: "10px"
        },
      },
      [textBig, text, View({style: {
        display: "grid",
        gridTemplateColumns: "1fr 100px"
      }}, [textInput, delButton])]
    );
    totpEntrys.push({ text: text, view: view });
    counter++;
  });

  return totpEntrys.map(x => x.view);
}

function updateStorage(storage){
  _props.settingsStorage.setItem('TOTPs', storage)
}