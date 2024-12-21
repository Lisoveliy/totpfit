AppSettingsPage({
  build(props) {
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
    const textInput = TextInput({
      placeholder: "otplink",
      label: "Change OTP link",
      labelStyle: {
        backgroundColor: "#14213D",
        textAlign: "center",
        width: "70vw",
        margin: "10px",
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
          storage = storage.filter(x => storage.indexOf(x) != counter - 1)
        },
        style: {
          backgroundColor: "#ba181b",
          fontSize: "20px",
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
        display: "flex"
      }}, [textInput, delButton])]
    );
    totpEntrys.push({ text: text, view: view });
    counter++;
  });

  return totpEntrys.map(x => x.view);
}