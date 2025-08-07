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
    const colors = {
        secondaryBg: "#282828",
        text: "#fafafa",
        alert: "#ad3c23",
        notify: "#555555",
    };

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
                      label: "Issuer",
                      value: tempIssuer,
                      onChange: onIssuerChange,
                  }),
                  TextInput({
                      label: "Client",
                      value: tempClient,
                      onChange: onClientChange,
                  }),
              ]
            : [
                  Text(
                      { style: { color: colors.text, marginBottom: "2px" } },
                      `Issuer: ${element.issuer}`,
                  ),
                  Text(
                      { style: { color: colors.text } },
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
                label: "↑",
                disabled: index === 0,
                style: { width: "50px", margin: "2px" },
                onClick: onMoveUp,
            }),
            Button({
                label: "↓",
                disabled: index === storage.length - 1,
                style: { width: "50px", margin: "2px" },
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
            `${element.hashType} | ${element.digits} digits | ${element.fetchTime} seconds | ${element.timeOffset} sec offset`,
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
