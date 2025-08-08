export class ProtonBackupExport {
    version;
    entries = Array.of(ProtonTotpRecord);
}

export class ProtonTotpRecord {
    content = {
        uri,
        entry_type,
    };
}
