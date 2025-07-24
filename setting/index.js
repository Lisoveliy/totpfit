import { getTOTPByLink } from "./utils/queryParser.js";
import { colors, content } from "./consts.js";

let _props = null;

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
                let link = getTOTPByLink(changes);
                if (link == null) {
                    console.log("ERR: link is invalid");
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
                            source: content.instructionLink.source,
                        },
                        content.instructionLink.label,
                    ),
                ),
            ],
        );
        return body;
    },
});

/**
 * Get DOM elements of TOTP records
 * @param {*} storage Array of TOTP objects
 * @returns Array of DOM elements
 */
function GetTOTPList(storage) {
    let totpEntrys = [];
    let counter = 0;
    storage.forEach((element) => {
        const elementId = counter;
        const totpLabelText = Text(
            {
                align: "center",
                style: {
                    color: colors.text,
                    fontSize: "18px",
                    fontWeight: "500",
                },
                paragraph: true,
            },
            content.totpLabelText.eval(element.issuer, element.client),
        );
        const changeButton = TextInput({
            placeholder: content.changeButton.placeHolder,
            label: content.changeButton.label,
            onChange: (changes) => {
                try {
                    let link = getTOTPByLink(changes);
                    if (Array.isArray(link)) return;

                    storage[elementId] = link;
                    updateStorage(storage);
                } catch (err) {
                    console.log(`ERR: ${err}`);
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
        const totpDescText = Text(
            {
                style: {
                    color: colors.text,
                    fontSize: "14px",
                },
                align: "center",
            },
            content.totpDescText.eval(element.hashType, element.digits, element.fetchTime, element.timeOffset),
        );
        const deleteButton = Button({
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
            label: content.deleteButton.label,
        });
        const view = View(
            {
                style: {
                    textAlign: "center",
                    backgroundColor: colors.secondaryBg,
                    borderRadius: "5px",
                    margin: "10px",
                },
            },
            [
                totpLabelText,
                totpDescText,
                View(
                    {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr 100px",
                        },
                    },
                    [changeButton, deleteButton],
                ),
            ],
        );
        totpEntrys.push({ text: totpDescText, view: view });
        counter++;
    });

    return totpEntrys.map((x) => x.view);
}

/**
 * Update 
 * @param {*} storage Array of TOTP objects
 */
function updateStorage(storage) {
    _props.settingsStorage.setItem("TOTPs", JSON.stringify(storage));
}
