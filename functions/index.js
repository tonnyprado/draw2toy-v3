/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");
exports.contactEmail = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    if (req.method !== "POST") return res.status(405).json({ ok:false });
    const { name="", email="", subject="", message="", hp="" } = req.body || {};
    if (hp) return res.status(200).json({ ok:true });

    const user = functions.config().gmail?.user;
    const pass = functions.config().gmail?.pass;
    const to = functions.config().email?.to;
    if (!user || !pass || !to) return res.status(500).json({ ok:false, error:"Config faltante" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass }
    });

    await transporter.sendMail({
      from: `"Contacto Draw2Toy" <${user}>`,
      to,
      replyTo: email,
      subject: `[Contacto] ${subject || "Mensaje"}`,
      html: `<b>Nombre:</b> ${name}<br/><b>Email:</b> ${email}<br/><pre>${message}</pre>`
    });

    return res.status(200).json({ ok:true });
  });
});

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
