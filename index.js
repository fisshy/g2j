#! /usr/bin/env node
console.log("start");

const GoogleAuth    = require("google-auth-library");
const google        = require('googleapis');
const readline      = require('readline')
const fs            = require('fs');
const jsonfile      = require('jsonfile')

let auth_client = new GoogleAuth();
let creds       = require(process.cwd() + '\\config.creds.json')
let SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

let clientSecret = creds.installed.client_secret;
let clientId = creds.installed.client_id;
let redirectUrl = creds.installed.redirect_uris[0];
let auth = new GoogleAuth();
let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

let config       = require(process.cwd() + '\\config.generate.json')

authorize = () => {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      store(token);
      sheets(oauth2Client);
    });
  });
}

store = (token) => {
  fs.writeFileSync("config.token.json", JSON.stringify(token));
  console.log('Token stored to token.json');
}

createText = (rows) => {
  var fileNames = rows[0];
  var filesData = [];

  for (var i = 1; i < rows.length; i++) {
    var keyName = rows[i][0]

    for (var j = 1; j < rows[i].length; j++) {
      var value = rows[i][j];

      if(!filesData[j]) {
        filesData[j] = [];
      }

      filesData[j].push({ keyName, value })
    }
  }

  createFiles(fileNames, filesData);
}

createFiles = (fileNames, filesData) => {
  for (var i = 1; i < fileNames.length; i++) {

    var fileName = fileNames[i];

    if(!fileName) {
      continue;
    }

    var filePath = process.cwd() + `\\${fileName}`;
    var fileData = {};
    for (var j = 0; j < filesData[i].length; j++) {
      var keyValue = filesData[i][j];
      fileData[keyValue.keyName] = keyValue.value;
    }

    jsonfile.writeFile(filePath, fileData, 'utf8', function (err) {
      console.error(err)
    });

  }
}

sheets = (client) => {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: client,
    spreadsheetId: creds.spreadsheet_key,
    range: config.range,
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }

    var rows = response.values;
    if (rows.length == 0) {
      console.log('No data found.');
      return;
    }

    console.log("found rows");

    createText(rows);

  });
}

try {
  var token = JSON.parse(fs.readFileSync("config.token.json"));
  oauth2Client.credentials = token;
  sheets(oauth2Client);
} catch (e) {
  authorize();
}
