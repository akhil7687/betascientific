/**
 * BETA SCIENTIFIC — Google Apps Script
 * ======================================
 * Receives form submissions, saves to Google Sheet, sends email notification.
 *
 * SETUP STEPS:
 * 1. Go to https://script.google.com → New project
 * 2. Paste this entire file (replace the default code)
 * 3. Set SHEET_ID below (from your Google Sheet URL:
 *    https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit)
 *    OR leave as '' to auto-create a new spreadsheet.
 * 4. Confirm NOTIFY_EMAIL is correct.
 * 5. Click Deploy → New deployment
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Click Deploy, authorize when prompted.
 * 7. Copy the Web app URL (looks like https://script.google.com/macros/s/.../exec)
 * 8. Paste it as SCRIPT_URL in reach-us.js and script.js
 */

var SHEET_ID     = '';                        // paste your Google Sheet ID here, or leave blank to auto-create
var SHEET_NAME   = 'Leads';                   // tab name inside the sheet
var NOTIFY_EMAIL = 'sunil@betascientific.com'; // where to send email alerts

// ---- Column headers (written once on first submission) ----
var HEADERS = ['Timestamp (IST)', 'Name', 'Phone', 'Email', 'Company', 'Service', 'Message', 'Source'];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    saveToSheet(data);
    sendEmail(data);
    return ok();
  } catch (err) {
    return ok(); // always return 200 so the browser doesn't retry
  }
}

// Needed for CORS preflight (some browsers send OPTIONS first)
function doGet(e) {
  return ok();
}

/* ---- Save row to Google Sheet ---- */
function saveToSheet(data) {
  var ss;
  if (SHEET_ID) {
    ss = SpreadsheetApp.openById(SHEET_ID);
  } else {
    // Auto-create a sheet named "Beta Scientific Leads" in your Drive
    ss = SpreadsheetApp.create('Beta Scientific — Leads');
    SHEET_ID = ss.getId();
  }

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Write headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#FFD900')
      .setFontColor('#000000');
    sheet.setFrozenRows(1);
  }

  var ist = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy HH:mm:ss');

  sheet.appendRow([
    ist,
    data.name    || '',
    data.phone   || '',
    data.email   || '',
    data.company || '',
    data.service || '',
    data.message || '',
    data.source  || 'website'
  ]);
}

/* ---- Send email alert ---- */
function sendEmail(data) {
  var subject = 'New Quote Request — ' + (data.name || 'Unknown') + ' [Beta Scientific]';

  var html = '<div style="font-family:Arial,sans-serif;max-width:600px;">'
    + '<div style="background:#FFD900;padding:20px 24px;">'
    + '<h2 style="margin:0;color:#000;font-size:18px;">New Quote Request — Beta Scientific</h2>'
    + '</div>'
    + '<div style="background:#f9f9f9;padding:24px;border:1px solid #eee;">'
    + row('Name',    data.name)
    + row('Phone',   data.phone)
    + row('Email',   data.email ? '<a href="mailto:' + data.email + '">' + data.email + '</a>' : '')
    + row('Company', data.company)
    + row('Service', data.service)
    + row('Message', data.message)
    + row('Source',  data.source)
    + '</div>'
    + '<div style="padding:16px 24px;font-size:12px;color:#888;">'
    + 'Submitted via Beta Scientific website'
    + '</div>'
    + '</div>';

  MailApp.sendEmail({
    to:       NOTIFY_EMAIL,
    subject:  subject,
    htmlBody: html
  });
}

function row(label, value) {
  if (!value) return '';
  return '<div style="margin-bottom:12px;">'
    + '<span style="font-size:11px;font-weight:bold;text-transform:uppercase;color:#888;letter-spacing:.06em;">' + label + '</span>'
    + '<div style="margin-top:4px;font-size:15px;color:#111;">' + value + '</div>'
    + '</div>';
}

function ok() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
