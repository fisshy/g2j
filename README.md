## Googledocs to JSON
- One simple way to sync google rows/columns values to JSON files.

### Install
```bash
$ npm install g2j
```

### Authorization / Config

Authorization is done using OAuth2, please get your client/secret key at [https://console.developers.google.com]( https://console.developers.google.com),

Select your project -> Credentials  -> Create Credentials -> OAuth client ID.
Download the JSON-file and rename it to *config.creds.json*

#### config.creds.json

Save this file to the folder you want to generate the files in.

```bash
{
    "installed":
    {
        "client_id":"your_client_id",
        "project_id":"your_projectId",
        "auth_uri":"https://accounts.google.com/o/oauth2/auth",
        "token_uri":"https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
        "client_secret":"your_secret_key",
        "redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]
    },
    "spreadsheet_key" : "your spreadsheet key"
}
```

#### config.generate.json

Create this file in the folder you want to generate the files in.

- Range -> See Google Spreadsheet API v4 for more info.
```bash
{
  "range": "Sheet1!A1:C"
}
```

#### config.token.json
Stores your token after authentication

### Example

#### Input

| Key                             | en.json                           | sv.json                                          |
|---------------------------------|-----------------------------------|--------------------------------------------------|
| Car expenses                    | Cost for passenger cars           | Personbilskostnader                              |
| Computers, advertisement and PR | Advertising and PR                | Reklam och PR                                    |
| Building costs                  | Property Cost                     | Fastighetskostnader                              |
| Freight and transport           | Freight and transport             | Frakter och transporter                          |
| Supplies and inventory          | Consumable equipment and supplies | Förbrukningsmaterial och Förbrukningsinventarier |

#### Run
```
$ g2j
```

#### Output

Two files were created.
en.json and sv.json

```bash
{
  "Car expenses":"Cost for passenger cars",
  "Computers, advertisement and PR":"Advertising and PR",
  "Building costs":"Property Cost",
  "Freight and transport":"Freight and transport",
  "Supplies and inventory":"Consumable equipment and supplies"
}
```

![alt tag](output.PNG)
