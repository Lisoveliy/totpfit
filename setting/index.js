import { getTOTPByLink } from "./utils/queryParser.js";
import { createTOTPCard } from "./ui/card.js";

let _props = null;
let editingIndex = -1;
let tempIssuer = "";
let tempClient = "";
let errorMessage = "";

const colors = {
    bg: "#101010",
    linkBg: "#ffffffc0",
    secondaryBg: "#282828",
    text: "#fafafa",
    alert: "#ad3c23",
    notify: "#555555",
    bigText: "#fafafa",
};

function updateStorage(storage) {
    _props.settingsStorage.setItem("TOTPs", JSON.stringify(storage));
}

function GetTOTPList(storage) {
    return storage.map((element, index) => {
        return createTOTPCard({
            element,
            index,
            storage,
            isEditing: editingIndex === index,
            tempIssuer,
            tempClient,
            onIssuerChange: (val) => {
                tempIssuer = val;
            },
            onClientChange: (val) => {
                tempClient = val;
            },
            onRename: () => {
                editingIndex = index;
                tempIssuer = element.issuer;
                tempClient = element.client;
                updateStorage(storage);
            },
            onSave: () => {
                storage[index].issuer = tempIssuer;
                storage[index].client = tempClient;
                editingIndex = -1;
                updateStorage(storage);
            },
            onDelete: () => {
                storage.splice(index, 1);
                updateStorage(storage);
            },
            onMoveUp: () => {
                if (index > 0) {
                    [storage[index], storage[index - 1]] = [
                        storage[index - 1],
                        storage[index],
                    ];
                    updateStorage(storage);
                }
            },
            onMoveDown: () => {
                if (index < storage.length - 1) {
                    [storage[index], storage[index + 1]] = [
                        storage[index + 1],
                        storage[index],
                    ];
                    updateStorage(storage);
                }
            },
        });
    });
}

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
                try {
                    errorMessage = "";
                    let link = getTOTPByLink(changes);
                    if (link == null) {
                        throw new Error(
                            "Unsupported link type. Please use an otpauth:// or otpauth-migration:// link.",
                        );
                    }

                    if (Array.isArray(link)) {
                        storage.push(...link);
                    } else {
                        storage.push(link);
                    }
                    updateStorage(storage);
                } catch (e) {
                    errorMessage = e.message;
                    updateStorage(storage);
                }
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
                width: "100%",
                height: "45px",
            },
        });

        const errorText = errorMessage
            ? Text(
                  {
                      style: {
                          color: colors.alert,
                          textAlign: "center",
                          margin: "5px",
                      },
                  },
                  errorMessage,
              )
            : null; //TODO: Check for work

        const bottomContainer = View(
            {
                style: {
                    padding: "5px 0px",
                    backgroundColor: colors.bg,
                },
            },
            [errorText, createButton].filter(Boolean),
        );

        const pageContainer = View(
            {
                style: {
                    backgroundColor: colors.bg,
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                },
            },
            [
                View(
                    {
                        style: {
                            textAlign: "center",
                        },
                    },
                    [
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
                    ],
                ),

                View(
                    {
                        style: {
                            flexGrow: 1,
                            overflow: "scroll",
                        },
                    },
                    [
                        ...totpEntrys,
                        View(
                            {
                                style: {
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: "20px",
                                    marginBottom: "20px",
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
                ),

                bottomContainer,
            ],
        );

        return pageContainer;
    },
});
