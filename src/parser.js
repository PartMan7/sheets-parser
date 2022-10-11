function generateParser (rawHeaders) {
	const headers = rawHeaders[0].map((header, i) => [header, rawHeaders[1][i]]);
	const typeID = headers.find(header => header[0] === '_id')?.[1];
	if (!['String', 'Integer'].includes(typeID)) throw new Error(`_id must be a String/Integer, not ${typeID}`);
	function dataFromRow (row) {
		const obj = {};
		const typeMap = {
			Boolean: input => ['n', 'no', 'false', '0', '-', ''].includes(input.toLowerCase()) ? false : true,
			Integer: input => parseInt(input) || 0,
			Number: input => Number(input) || 0,
			String: input => String(input)
		};
		function getType (type) {
			const validTypes = ['Boolean', 'String', 'Number'];
			if (typeMap.hasOwnProperty(type)) return typeMap[type];
			const arrType = Object.keys(typeMap).find(vType => type.startsWith(`<${vType}>`));
			if (arrType) return [typeMap[arrType], type.substr(arrType.length + 2) || ','];
			return false;
		}
		headers.forEach(([label, rawType], index) => {
			// parse label
			const hierarchy = label.split('.');
			let parent = obj;
			let key = hierarchy[hierarchy.length - 1];
			for (let i = 0; i < hierarchy.length - 1; i++) {
				const hierarKey = hierarchy[i].replace(/\?$/, '');
				if (!parent.hasOwnProperty(hierarKey)) parent[hierarKey] = {};
				if (typeof parent[hierarKey] !== 'object') throw new Error(`Path ${hierarchy.slice(0, i + 1).join('.')} already exists as ${parent[hierarchy[i]]}`);
				parent = parent[hierarKey];
			}
			const isArray = key.endsWith('[]');
			if (isArray) key = key.slice(0, -2);
			const isOptional = key.endsWith('?');
			if (isOptional) key = key.slice(0, -1);
			if (parent.hasOwnProperty(key)) throw new Error(`Error parsing ${label}: Property '${key}' already exists on object as ${parent[key]}`);
			// parse value
			const type = getType(rawType);
			if (!type) throw new Error(`Unrecognized type ${rawType}`);
			if (Array.isArray(type)) {
				if (!isArray) throw new Error(`Header conflict (label indicates array while typedef does not)`);
				const val = (row[index] === '' ? [] : row[index].split(type[1])).map(type[0]);
				if (!isOptional || val.length) parent[key] = val;
			} else {
				if (isArray) throw new Error(`Header conflict (label does not indicate array while typedef does)`);
				const val = type(row[index]);
				if (!isOptional || val) parent[key] = val;
			}
			// trim optional nests
			for (let i = hierarchy.length - 2; i >= 0; i--) {
				const subArchy = hierarchy.slice(0, i + 1).map(path => ({ path: path.replace(/\?$/, ''), optional: path.endsWith('?') }));
				let lastChild = obj, secondLastChild;
				for (let path of subArchy) [secondLastChild, lastChild] = [lastChild, lastChild[path.path]];
				if (Object.keys(lastChild).length === 0) delete secondLastChild[subArchy[subArchy.length - 1].path];
			}
		});
		return obj;
	}
	return dataFromRow;
}

module.exports = { generateParser };
