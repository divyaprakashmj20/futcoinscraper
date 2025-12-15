const admin = require("firebase-admin");

let app;

function getFirebase() {
    if (!app) {
        var serviceAccount = require("./serviceAccountKey.json");
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://futcoin-scraper-default-rtdb.firebaseio.com"
        });
    }

    return {
        admin,
        db: admin.database(),
    };
}

module.exports = { getFirebase };
