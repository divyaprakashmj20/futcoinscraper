const admin = require("firebase-admin");

let initialized = false;

function getFirebase() {
    if (!initialized) {
        const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
        const databaseURL = process.env.FIREBASE_DATABASE_URL;

        if (!json) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON (GitHub Secret)");
        if (!databaseURL) throw new Error("Missing FIREBASE_DATABASE_URL (GitHub Secret)");

        const serviceAccount = JSON.parse(json);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://futcoin-scraper-default-rtdb.firebaseio.com"
        });

        initialized = true;
    }

    return { admin, db: admin.database() };
}

module.exports = { getFirebase };
