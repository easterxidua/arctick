const Database =
    require("better-sqlite3");

const db =
    new Database("./backend/vault.db");

db.exec(`
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    address TEXT NOT NULL,

    type TEXT NOT NULL,

    amount TEXT,

    keyHash TEXT,

    txHash TEXT NOT NULL,

    blockNumber INTEGER,

    timestamp INTEGER
);

ALTER TABLE history
ADD COLUMN encryptedSecret TEXT;

CREATE INDEX IF NOT EXISTS idx_history_address
ON history(address);

CREATE INDEX IF NOT EXISTS idx_history_timestamp
ON history(timestamp);
`);

module.exports = db;