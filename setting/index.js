import { getTOTPByLink } from "./utils/queryParser.js";

let _props = null;

const colors = {
    bg: "#101010",
    linkBg: "#ffffffc0",
    secondaryBg: "#282828",
    text: "#fafafa",
    alert: "#ad3c23",
    notify: "#555555",
    bigText: "#fafafa",
};

AppSettingsPage({
    build(props) {
        _props = props;
        const storage = JSON.parse(
            props.settingsStorage.getItem("TOTPs") ?? "[]",
        );
        const totpEntrys = GetTOTPList(storage);
        const addTOTPsHint =
            storage.length < 1
                ? Text(
                      {
                          paragraph: true,
                          align: "center",
                          style: {
                              paddingTop: "10px",
                              marginBottom: "10px",
                              color: colors.text,
                              fontSize: 16,
                              verticalAlign: "middle",
                          },
                      },
                      "For add a 2FA TOTP record you must have otpauth:// link or otpauth-migration:// link from Google Authenticator Migration QR-Code",
                  )
                : null;
        const createButton = TextInput({
            placeholder: "otpauth(-migration)://",
            label: "Add new TOTP record",
            onChange: (changes) => {
                let link = getTOTPByLink(changes);
                if (link == null) {
                    console.log("link is invalid");
                    return;
                }

                if (Array.isArray(link)) storage.push(...link);
                else storage.push(link);

                updateStorage(storage);
            },
            labelStyle: {
                backgroundColor: colors.notify,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px",
                fontSize: "20px",
                color: colors.text,
                borderRadius: "5px",
                position: storage.length < 1 ? "absolute" : null, //TODO: Сделать что-то с этим кошмаром
                bottom: storage.length < 1 ? "0px" : null,
                left: storage.length < 1 ? "0px" : null,
                right: storage.length < 1 ? "0px" : null,
            },
        });

        var body = Section(
            {
                style: {
                    backgroundColor: colors.bg,
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
                    storage.length < 1
                        ? addTOTPsHint
                        : Text(
                              {
                                  align: "center",
                                  paragraph: true,
                                  style: {
                                      marginBottom: "10px",
                                      color: colors.bigText,
                                      fontSize: 23,
                                      fontWeight: "500",
                                      verticalAlign: "middle",
                                  },
                              },
                              "TOTP records:",
                          ),
                ),
                ...totpEntrys,
                createButton,
                View(
                    {
                        style: {
                            display: "flex",
                            justifyContent: "center",
                        },
                    },
                    Link(
                        {
                            source: "https://github.com/Lisoveliy/totpfit/blob/main/docs/guides/how-to-add-totps/README.md",
                        },
                        "Instruction | Report issue (GitHub)",
                    ),
                ),
            ],
        );
        return body;
    },
});

function GetTOTPList(storage) {
    let totpEntrys = [];
    let counter = 0;
    storage.forEach((element) => {
        const elementId = counter;
        const textInput = TextInput({
            placeholder: "otpauth(-migration)://",
            label: "Change TOTP link",
            onChange: (changes) => {
                try {
                    let link = getTOTPByLink(changes);
                    if (Array.isArray(link)) return;

                    storage[elementId] = link;
                    updateStorage(storage);
                } catch (err) {
                    console.log(err);
                }
            },
            labelStyle: {
                backgroundColor: colors.notify,
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "10px",
                flexGrow: 1,
                fontSize: "20px",
                color: colors.text,
                borderRadius: "5px",
            },
        });
        const textBig = Text(
            {
                align: "center",
                style: {
                    color: colors.text,
                    fontSize: "18px",
                    fontWeight: "500",
                },
                paragraph: true,
            },
            `${element.issuer}: ${element.client}`,
        );
        const delButton = Button({
            onClick: () => {
                storage = storage.filter(
                    (x) => storage.indexOf(x) != elementId,
                );
                updateStorage(storage);
            },
            style: {
                backgroundColor: colors.alert,
                fontSize: "18px",
                color: colors.text,
                height: "fit-content",
                margin: "10px",
            },
            label: "Delete",
        });
        const text = Text(
            {
                style: {
                    color: colors.text,
                    fontSize: "14px",
                },
                align: "center",
            },
            `${element.hashType} | ${element.digits} digits | ${element.fetchTime} seconds | ${element.timeOffset} sec offset`,
        );
        const view = View(
            {
                style: {
                    textAlign: "center",
                    backgroundColor: colors.secondaryBg,
                    //border: "2px solid white",
                    borderRadius: "5px",
                    margin: "10px",
                },
            },
            [
                textBig,
                text,
                View(
                    {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr 100px",
                        },
                    },
                    [textInput, delButton],
                ),
            ],
        );
        totpEntrys.push({ text: text, view: view });
        counter++;
    });

    return totpEntrys.map((x) => x.view);
}

function updateStorage(storage) {
    _props.settingsStorage.setItem("TOTPs", JSON.stringify(storage));
}
