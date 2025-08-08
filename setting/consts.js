export const colors = {
    bg: "#101010",
    linkBg: "#ffffffc0",
    secondaryBg: "#282828",
    text: "#fafafa",
    alert: "#ad3c23",
    notify: "#555555",
    bigText: "#fafafa",
};

export const content = {
    addTotpsHint:
        "For add a 2FA TOTP record you must have otpauth:// link or otpauth-migration:// link from Google Authenticator Migration QR-Code",
    totpRecordsHint: "TOTP records:",
    createButton: {
        placeHolder: "otpauth(-migration)://",
        label: "Add new TOTP record",
    },
    instructionLink: {
        label: "Instruction | Report issue (GitHub)",
        source: "https://github.com/Lisoveliy/totpfit/blob/main/docs/guides/how-to-add-totps/README.md",
    },
    changeButton: {
        label: "Change TOTP link",
        placeHolder: "otpauth(-migration)://",
    },
    deleteButton: {
        label: "Delete",
    },
    totpLabelText: {
        eval(issuer, client) {
            return `${issuer}: ${client}`;
        },
    },
    totpDescText: {
        eval(hashType, digits, fetchTime, timeOffset) {
            return `${hashType} | ${digits} digits | ${fetchTime} seconds | ${timeOffset} sec offset`;
        },
    },
};
