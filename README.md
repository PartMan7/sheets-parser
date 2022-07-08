# sheets-parser
Parsing module for effortless Sheets-to-data conversion.

Unlike conventional database systems, sheets-parser is a read-only database module with an emphasis on simplicity of use. It takes exactly _one_ line of code to get started with a sheets-parser database:
```js
require('sheets-parser')(API_KEY).getDataFromSheet(SHEET_ID).then(res => console.log(res));
```
...and it's up and running.

## Configuration and Usage

To start a sheets-parser client, simply call the module as a function and pass it your [API access key](https://console.cloud.google.com/home/dashboard). Make sure to grant this API key access to the Sheets API.

Once you have your API key, you can use it in one of two ways. The first way is to simply pass it directly:
```js
const API_KEY = '5u6aF578gyAH9f7tklH9v9CVT8';
const sheetsParser = require('sheets-parser')(API_KEY);
```

Alternatively, you can store it in the environment as `process.env.GOOGLE_API_KEY`.
```js
const sheetsParser = require('sheets-parser')();
```

## Using the Parser

Once you have the sheetsParser client ready, you can start using it straight away! Currently, sheetsParser has two available methods:

* `sheetsParser.getCollections(sheetId: String)`: Returns a promise that resolves with a list of all available [collections](#collections) in the spreadsheet.
* `sheetsParser.getDataFromSheet(sheetId: String, collections?: [String], mapping?: mapFunction)`: Returns a promise that resolves with the data requested.
