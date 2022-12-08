const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.use(cors({ origin: true }));

const db = admin.firestore();

//routes
app.get("/", (req, res) => {
  return res.status(200).send("hello world");
});

app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection("mamamia").doc(`/${Date.now()}/`).create({
        id: Date.now(),
        input: req.body.input,
      });
      return res.status(200).send({ status: "success", msg: "data saved" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: "failed", msg: "save failed" });
    }
  })();
});

app.delete("/api/delete/:id", (req, res) => {
  console.log(req.params.id);
  (async () => {
    try {
      await db.collection("mamamia").doc(req.params.id).delete();
      return res.status(200).send({ status: "success", msg: "data deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ status: "failed", msg: "delete failed" });
    }
  })();
});
// exports.handleInput = functions.https.onRequest(async (req, res) => {
//   res.set("Access-Control-Allow-Origin", "*");
//   res.set("Access-Control-Allow-Methods", "GET");
//   res.set("Access-Control-Allow-Headers", "Content-Type");
//   res.set("Access-Control-Max-Age", "3600");
//   const post = req.body;
//   console.log(post);
//   const result = await admin.firestore().collection("mamamia").add(post);
//   res.json({ result: `Post with ID: ${result.id} added.` });
// });

exports.app = functions.https.onRequest(app);
