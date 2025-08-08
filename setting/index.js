import { getTOTPByLink } from "./utils/queryParser.js";
import { createTOTPCard } from "./ui/card.js";
import { colors, content } from "./consts.js";

let _props = null;
let editingIndex = -1;
let tempIssuer = "";
let tempClient = "";
let errorMessage = "";

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
                      content.addTotpsHint,
                  )
                : null;

        const createButton = TextInput({
            placeholder: content.createButton.placeHolder,
            label: content.createButton.label,
            onChange: (changes) => {
                try {
                    errorMessage = "";
                    let link = getTOTPByLink(changes);
                    if (link == null) {
                        throw new Error(
                            "Unsupported link type. Please use an otpauth:// or otpauth-migration:// link",
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
                height: "45px",
            },
        });

        const errorText = errorMessage
            ? Text(
                  {
                      style: {
                          color: colors.alert,
                          textAlign: "center",
                      },
                  },
                  errorMessage,
              )
            : null; //TODO: Check for work

        const bottomContainer = View(
            {
                style: {
                    backgroundColor: colors.bg,
                },
            },
            [
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
                            source: content.instructionLink.source,
                        },
                        content.instructionLink.label,
                    ),
                ),
                errorText,
                createButton,
            ].filter(Boolean),
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
                                          marginTop: "10px",
                                          marginBottom: "10px",
                                          color: colors.bigText,
                                          fontSize: 23,
                                          fontWeight: "500",
                                          verticalAlign: "middle",
                                      },
                                  },
                                  content.totpRecordsHint,
                              ),
                    ],
                ),

                View(
                    {
                        style: {
                            height: "100%",
                            overflowX: "hidden",
                            overflowY: "auto",
                            backgroundColor: colors.bg,
                        },
                    },
                    [...totpEntrys],
                ),

                bottomContainer,
            ],
        );

        return pageContainer;
    },
});
