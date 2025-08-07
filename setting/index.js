import { getTOTPByLink } from "./utils/queryParser.js";

let _props = null;
// Индекс редактируемого элемента. -1 означает, что ничего не редактируется.
let editingIndex = -1;
// Временные значения для полей ввода при редактировании
let tempIssuer = "";
let tempClient = "";

const colors = {
    bg: "#101010",
    linkBg: "#ffffffc0",
    secondaryBg: "#282828",
    text: "#fafafa",
    alert: "#ad3c23",
    notify: "#555555",
    bigText: "#fafafa"
};

AppSettingsPage({
    build(props) {
        _props = props;
        const storage = JSON.parse(
            props.settingsStorage.getItem("TOTPs") ?? "[]"
        );
        const totpEntrys = GetTOTPList(storage);
        const addTOTPsHint = Text({
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
            "Для добавления записи вставьте ссылку."
        );

        // Кнопка "Добавить", переименована
        const createButton = TextInput({
            placeholder: "otpauth(-migration)://",
            label: "Добавить",
            onChange: (changes) => {
                let link = getTOTPByLink(changes);
                if (link == null) {
                    console.log("link is invalid");
                    return;
                }

                if (Array.isArray(link))
                    storage.push(...link);
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
                width: "100%",
                height: "45px"
            },
        });

        // Контейнер для кнопки, закрепленный внизу
        const bottomContainer = View({
            style: {
                // Стили для закрепления внизу
                padding: '5px 0px',
                backgroundColor: colors.bg,
            }
        }, [createButton]);

        // Основной контейнер страницы, который не прокручивается
        const pageContainer = View({
            style: {
                backgroundColor: colors.bg,
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }
        }, [
            // Верхняя часть (заголовок)
            View({
                style: {
                    textAlign: "center",
                },
            }, [
                storage.length < 1 ? addTOTPsHint : Text(
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
                    "TOTP records:"
                )
            ]),

            // Контейнер для списка, который будет прокручиваться
            View({
                style: {
                    flexGrow: 1,
                    overflow: 'scroll'
                }
            }, [
                ...totpEntrys,
                View({
                    style: {
                        display: "flex",
                        justifyContent: "center",
                        marginTop: '20px',
                        marginBottom: '20px'
                    }
                },
                    Link({
                        source: "https://github.com/Lisoveliy/totpfit/blob/main/docs/guides/how-to-add-totps/README.md"
                    },
                        "Instruction | Report issue (GitHub)")
                ),
            ]),

            // Нижняя часть (закрепленная кнопка)
            bottomContainer
        ]);

        // Возвращаем единый контейнер для всей страницы
        return pageContainer;
    },
});

function GetTOTPList(storage) {
    let totpEntrys = [];
    storage.forEach((element, index) => {
        const isEditing = editingIndex === index;

        // --- Элементы для отображения ---
        const issuerText = Text({ style: { color: colors.text, marginBottom: '2px' } }, `Issuer: ${element.issuer}`);
        const clientText = Text({ style: { color: colors.text } }, `Client: ${element.client}`);

        // --- Элементы для редактирования ---
        const issuerInput = TextInput({
            label: "Issuer",
            value: isEditing ? tempIssuer : element.issuer,
            onChange: (val) => { tempIssuer = val; }
        });
        const clientInput = TextInput({
            label: "Client",
            value: isEditing ? tempClient : element.client,
            onChange: (val) => { tempClient = val; }
        });

        // --- Кнопки ---
        const renameButton = Button({
            label: "Rename",
            style: { margin: "5px", backgroundColor: colors.notify, color: colors.text },
            onClick: () => {
                editingIndex = index;
                tempIssuer = element.issuer;
                tempClient = element.client;
                updateStorage(storage);
            }
        });

        const saveButton = Button({
            label: "Save",
            style: { margin: "5px", backgroundColor: '#28a745', color: colors.text },
            onClick: () => {
                storage[index].issuer = tempIssuer;
                storage[index].client = tempClient;
                editingIndex = -1;
                updateStorage(storage);
            }
        });

        const delButton = Button({
            label: "Delete",
            style: { margin: "5px", backgroundColor: colors.alert, color: colors.text },
            onClick: () => {
                storage.splice(index, 1);
                updateStorage(storage);
            },
        });

        // --- Кнопки перемещения ---
        const upButton = Button({
            label: "↑",
            disabled: index === 0,
            style: { width: '50px', margin: '2px' },
            onClick: () => {
                if (index > 0) {
                    [storage[index], storage[index - 1]] = [storage[index - 1], storage[index]];
                    updateStorage(storage);
                }
            }
        });

        const downButton = Button({
            label: "↓",
            disabled: index === storage.length - 1,
            style: { width: '50px', margin: '2px' },
            onClick: () => {
                if (index < storage.length - 1) {
                    [storage[index], storage[index + 1]] = [storage[index + 1], storage[index]];
                    updateStorage(storage);
                }
            }
        });

        const infoView = View({ style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' } }, isEditing ? [issuerInput, clientInput] : [issuerText, clientText]);
        const buttonsView = View({ style: { display: 'flex', flexDirection: 'row' } }, isEditing ? [saveButton] : [renameButton, delButton]);
        const reorderView = View({ style: { display: 'flex', flexDirection: 'column' } }, [upButton, downButton]);

        const mainContent = View(
            { style: { flexGrow: 1, padding: '5px' } },
            [
                infoView,
                Text({ style: { color: colors.text, fontSize: "14px", marginTop: '5px' } },
                    `${element.hashType} | ${element.digits} digits | ${element.fetchTime} seconds | ${element.timeOffset} sec offset`
                ),
                buttonsView
            ]
        );

        const card = View({
            style: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.secondaryBg,
                borderRadius: "5px",
                margin: "10px",
                padding: "5px"
            }
        }, [mainContent, reorderView]);


        totpEntrys.push(card);
    });

    return totpEntrys;
}

function updateStorage(storage) {
    _props.settingsStorage.setItem("TOTPs", JSON.stringify(storage));
}
