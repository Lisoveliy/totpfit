import { colors, content } from "../consts";

export function createTOTPCard({
    element,
    index,
    storage,
    isEditing,
    tempIssuer,
    tempClient,
    onRename,
    onSave,
    onDelete,
    onMoveUp,
    onMoveDown,
    onIssuerChange,
    onClientChange,
}) {
    const infoView = View(
        {
            style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            },
        },
        isEditing
            ? [
                  TextInput({
                      label: "Rename Issuer",
                      value: tempIssuer,
                      onChange: onIssuerChange,
                      labelStyle: {
                          backgroundColor: colors.notify,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "10px",
                          fontSize: "20px",
                          color: colors.text,
                          borderRadius: "5px",
                          height: "40px",
                          width: "200px"
                      },
                      subStyle: {
                          display: "none",
                      },
                  }),
                  TextInput({
                      label: "Rename client",
                      value: tempClient,
                      onChange: onClientChange,
                      labelStyle: {
                          backgroundColor: colors.notify,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "10px",
                          fontSize: "20px",
                          color: colors.text,
                          borderRadius: "5px",
                          height: "40px",
                          width: "200px"
                      },
                      subStyle: {
                          display: "none",
                      },
                  }),
              ]
            : [
                  Text(
                      {
                          style: {
                              color: colors.text,
                              marginBottom: "2px",
                              fontWeight: "600",
                          },
                      },
                      `Issuer: ${element.issuer}`,
                  ),
                  Text(
                      { style: { color: colors.text, fontWeight: "600" } },
                      `Client: ${element.client}`,
                  ),
              ],
    );

    const buttonsView = View(
        { style: { display: "flex", flexDirection: "row" } },
        isEditing
            ? [
                  Button({
                      label: "Save",
                      style: {
                          margin: "5px",
                          backgroundColor: "#28a745",
                          color: colors.text,
                      },
                      onClick: onSave,
                  }),
              ]
            : [
                  Button({
                      label: "Rename",
                      style: {
                          margin: "5px",
                          backgroundColor: colors.notify,
                          color: colors.text,
                      },
                      onClick: onRename,
                  }),
                  Button({
                      label: "Delete",
                      style: {
                          margin: "5px",
                          backgroundColor: colors.alert,
                          color: colors.text,
                      },
                      onClick: onDelete,
                  }),
              ],
    );

    const reorderView = View(
        { style: { display: "flex", flexDirection: "column" } },
        [
            Button({
                label: "⬆",
                disabled: index === 0,
                style: {
                    width: "50px",
                    margin: "2px",
                    color: colors.text,
                    backgroundColor: colors.notify,
                },
                onClick: onMoveUp,
            }),
            Button({
                label: "⬇",
                disabled: index === storage.length - 1,
                style: {
                    width: "50px",
                    margin: "2px",
                    color: colors.text,
                    backgroundColor: colors.notify,
                },
                onClick: onMoveDown,
            }),
        ],
    );

    const mainContent = View({ style: { flexGrow: 1, padding: "5px" } }, [
        infoView,
        Text(
            {
                style: {
                    color: colors.text,
                    fontSize: "14px",
                    marginTop: "5px",
                },
            },
            content.totpDescText.eval(
                element.hashType,
                element.digits,
                element.fetchTime,
                element.timeOffset,
            ),
        ),
        buttonsView,
    ]);

    return View(
        {
            style: {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: colors.secondaryBg,
                borderRadius: "5px",
                margin: "10px",
                padding: "5px",
            },
        },
        [mainContent, reorderView],
    );
}
