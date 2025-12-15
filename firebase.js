const admin = require("firebase-admin");

let initialized = false;

function getFirebase() {
    if (!initialized) {
        const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

        if (!json){
            var serviceAccount = require("./serviceAccountKey.json");
        } else{
        const serviceAccount = JSON.parse(json);
        }


        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://futcoin-scraper-default-rtdb.firebaseio.com"
        });

        initialized = true;
    }

    return { admin, db: admin.database() };
}

module.exports = { getFirebase };
