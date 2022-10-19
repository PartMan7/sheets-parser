# sheets-parser
Parsing module for effortless Sheets-to-data conversion.

Unlike conventional database systems, sheets-parser is a read-only database module with an emphasis on simplicity of use. It takes exactly _one_ line of code to get started with a sheets-parser database:
```js
require('sheets-parser')(API_KEY).getDataFromSheet(SHEET_ID).then(res => console.log(res));
```
...and it's up and running.

## Usecase

So, why use sheets-parser if it's read-only? The simplest answer - you can now deploy public read-only databases for larger datasets while keeping with Google's advanced permissions API to restrict who can manually edit stuff, and since it's in a Google Sheet, you don't need to restrict it to programmers.

As an example, check out this [Pokémon GO Database](https://docs.google.com/spreadsheets/d/1cSm11AfVmMrRIAxDzzCc_G7mFjtIYY0rXRRweZEyEyo/edit#gid=668259038), maintained by the staff of the Pokémon GO chatroom on Pokémon Showdown (shoutouts Mex for their efforts). This resource is updated regularly with no programming knowledge, and is hard to mess up - while anyone can simply read and use this data with a single line of code!

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

Do note that you can also supply an OAuth2 client instead of an API key to the parser - it'll still work!

## Using the Parser

Once you have the sheetsParser client ready, you can start using it straight away! Currently, sheetsParser has two available methods:

* `sheetsParser.getCollections(sheetId: String)`: Returns a promise that resolves with a list of all available collections in the spreadsheet.
* `sheetsParser.getDataFromSheet(sheetId: String, collections?: [String], mapping?: mapFunction)`: Returns a promise that resolves with the data requested.

## Database Layout

Please refer to [this link](/DATABASE.md) for details on how databases are formatted.


## Planned features

* Add in write methods for users with an API client (as opposed to a simple API key).
