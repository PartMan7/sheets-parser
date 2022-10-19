# Database Structure

## Sheets in the spreadsheet

Sheets are considered 'data' sheets (called collections) if the name of the sheet starts with a `#`. No exceptions are currently used, though future versions may allow for finer controls over this.

Do note that `sheetsParser#getCollections` will return the names of the collections with the prefixed `#`, and `#` must be prefixed for `sheetsParser#`

The first two rows of a spreadsheet are called 'header' rows. The first header is the 'name' of the field, while the second row is the 'type' of the field.

## Header Configuration

### Header 1: Labels

The simplest label is just a plain word. If you add in a field like `name`, it uses the value of the cell as the associated value for the 'name' key on your row, so it'll look something like `{ name: value }`.

You can also add in optional fields - if you have a `?` after the field name and the field value is 'falsey' (falsey values are the same as JS Booleans, with the exception that an empty array/object is also considered to be falsey).

You can designate a field as an array by appending a `[]` to it (eg; the field `names?[]` would be read as `{ names: [optional array of elements] }`).

The most important syntax you can add to a field is 'nesting' (indicated by the literal `.`). For example, you can have adjacent fields `score.grade` and `score.marks`, which would be parsed as `{ score: { grade: grade, marks: marks } }`. Again, since these fields can collapse with an optional indicator, you can use `name?.first?` and `name?.last?` to return `{}` if there is no name for either, or `{ last: 'last_name' }` if there's only the last name.

Nesting is infinitely extensible (you can go to any depth you'd like to), so you can have, say, a field `college.administration.head.name.first`. Do note two caveats with nesting:

* A fatal error will be returned if you have a position denoted as both an object (via nesting) and as an entry (via labels) - so two conflicting fields `abilities.boost.type` and `abilities.boost` would fail to resolve.
* An optional indicator on a parent object will NOT automatically extend to all of its children (so having a field `name?.first` would always be `{ first: '' }`, even if the `first` field is empty). This may be changed in a future version.

Note: If a label `_id` is included as a field, the collection is read as an _object_ instead of an _array_, and the value of this field is used as the object key. Uniqueness of this \_id value is NOT validated by the parser.

Note: Reserved characters are `?`, `[`, `]`, and `.`. None of these characters may be used in key names, and all other valid characters (like ` `) are permitted. Escape sequences may be added in a future version.


### Header 2: Typing

The parser currently supports four 'primitive' data types, alongside arrays and objects. These are:

* `Boolean` (Note that the parser supports a wide variety of inputs as false, as opposed to simply an empty cell. These are (case-insensitive): `n`, `no`, `false`, `0`, and `-`. Default: `false`)
* `Integer` (Default: `0`)
* `Number` (Default: `0`)
* `String` (Default: `''`)

Further data types may be added on an as-needed basis.

For arrays, the data type is a simply wrapping `<>` around these: if you wanted, say, an array of strings, the type would be `<String>`. Casting for arrays is done by running the normal typecast on each element of the array produced after splitting the field value by the 'delimiter' (default `,`). The delimiter may be specified after the closing `>` - so to read a field value of `1|2|3|-4` as `[1, 2, 3, -4]`, you would need a typing of the form `<Integer>|`.

Note: The delimiter for array casting may be a space (or any character sequence!), so please ensure that there are no trailing spaces after your type definition if you wish to use the default delimiter.


## Document Population

Each document is mapped according to the rules specified above. Since each typing has its own default values, you may fill them with roughly any values. Document reading is done forgivingly, so no errors will be thrown for mismatching data types and field values (a value of `four` in a field of type `<Number>` would simply be cast to `[0]`). Also do note that the ONLY way to produce an empty array value is to have an empty cell value in a field _without_ an optional indicator (ie, an empty cell on a label `field[]`). This will always produce an empty array.

As mentioned before, to switch between row-like behaviour (arrays of documents) and lookup-like behaviour (object with document properties), use the `_id` field.

Document parsing is ALWAYS done using the _displayed_ value of a cell as opposed to the _true_ value of a cell, which means you can use formulas in collection columns and the output will be used as the field value. This can be used in conjunction with the ARRAYFORMULA function on Google Sheets to have self-populating columns (eg; automatic `damage per second` from the fields `damage per attack` and `attack rate`).

For more complex derivative values (eg; textual descriptions), instead of a long Google Sheets formula, it is recommended to use a custom _mapping_ in calls to `sheetsParser#getDataFromSheet`. This callback has the sole parameter as the document value, and is run before assignment to the returned value. For security reasons, there is no way to specify the mapping within the spreadsheet itself.

## Database Examples

[Pokémon GO Database](https://docs.google.com/spreadsheets/d/1cSm11AfVmMrRIAxDzzCc_G7mFjtIYY0rXRRweZEyEyo) (maintained by Mex and the staff of the Pokémon GO chatroom on Pokémon Showdown)

<small>Please contact me if you have a sample database that you'd like to provide as a demonstration.</small>

