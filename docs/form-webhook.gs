/**
 * Google Apps Script: receives newsletter submissions from /api/newsletter and appends
 * them to a Google Sheet, so non-developers can see sign-ups without logging into anything else.
 *
 * Setup (5 minutes):
 *  1. Create a Google Sheet. Extensions → Apps Script → paste this file.
 *  2. Project Settings → Script properties → add WEBHOOK_SECRET (any long random string).
 *  3. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
 *  4. In Vercel (and .env.local), set FORM_WEBHOOK_URL to the web-app URL and
 *     FORM_WEBHOOK_SECRET to the same secret as step 2. Redeploy.
 */
function doPost(e) {
  var body = JSON.parse(e.postData.contents);
  var secret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");

  if (!secret || body.secret !== secret) {
    return json({ ok: false, error: "unauthorised" });
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Submitted at", "Email", "Consent", "Source", "Page URL", "Submission ID"]);
  }
  sheet.appendRow([body.submittedAt, body.email, body.consent, body.source, body.pageUrl || "", body.id]);

  return json({ ok: true });
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
