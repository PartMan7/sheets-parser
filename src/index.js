const { sheets } = require('@googleapis/sheets');
const { generateParser } = require('./parser.js');

function sheetParser (auth_key) {
	const auth = auth_key || process.env.GOOGLE_API_KEY;
	if (!auth) throw new Error('Missing API access key');
	const Sheets = sheets({
		version: 'v4',
		auth
	});

	async function getRanges (spreadsheetId) {
		const metaData = await Sheets.spreadsheets.get({ spreadsheetId });
		return metaData.data.sheets.map(sheet => sheet.properties.title);
	}

	async function getCollections (spreadsheetId) {
		if (arguments.length !== 1) throw new TypeError('getCollections accepts only 1 parameter');
		const ranges = await getRanges(spreadsheetId);
		return ranges.filter(range => range.startsWith('#'));
	}

	async function getDataFromSheet (spreadsheetId, givenRanges, mapping) {
		if (arguments.length < 1 || arguments.length > 3) throw new TypeError('getDataFromSheet accepts only 1-3 parameters');
		const ranges = await getRanges(spreadsheetId);
		if (givenRanges && !Array.isArray(givenRanges)) givenRanges = [givenRanges];
		const extraRange = givenRanges?.find(range => !ranges.includes(range));
		if (extraRange) throw new Error(`Range '${extraRange}' not in spreadsheet`);
		const finalRanges = (givenRanges || ranges.filter(sheet => sheet.startsWith('#'))).filter(sheet => !['constructor', '#constructor'].includes(sheet));
		const res = await Sheets.spreadsheets.values.batchGet({ spreadsheetId, ranges: finalRanges.map(sheet => `'${sheet}'`) });
		const loaded = res.data.valueRanges.map(sheet => sheet.values);
		const stores = [];
		loaded.forEach((sheet, i) => {
			const headers = sheet.splice(0, 2);
			try {
				const parser = generateParser(headers);
				let data = sheet.map(parser);
				if (typeof mapping === 'function') data = data.map((value, index) => mapping(value, headers[index], res.data.valueRanges[i].range, index));
				if (!headers[0].includes('_id')) stores.push(data); // Array-like
				else stores.push(Object.fromEntries(data.map(doc => [doc._id, doc]))); // _id-based
			} catch (err) {
				throw new Error(`Error parsing database: ${err.message}`);
			}
		});
		return Object.fromEntries(stores.map((store, index) => [finalRanges[index].replace(/^#/, ''), store]));
	}
	return { getCollections, getDataFromSheet };
}

module.exports = sheetParser;
