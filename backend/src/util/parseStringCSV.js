const csvString = `file,text,number,hex
test2.csv,roqoW
test2.csv,uUlQErpNKqMfFduSjcqGaColaeKhW,1059731654,30877b2c4eeb6cdf4ca3309995fb09cb`;

const cleanLine = line => line.trim().split(/\s*,\s*/);

const parseCsvToJson = (csvString, fieldToDelete) => {
    const lines = csvString.split('\n');
    const headers = lines.shift().trim().split(/\s*,\s*/);

    if (lines.length === 0) {
        const emptyRow = {};
        headers.forEach((header, index) => {
            if (header === fieldToDelete) return;
            emptyRow[header] = '';
        });
        return JSON.stringify([emptyRow]);
    }

    const data = lines.map(line => {
        const values = line.trim().split(/\s*,\s*/);
        const row = {};
        headers.forEach((header, index) => {
            if (header === fieldToDelete) return;
            row[header] = values[index] || '';
        });
        return row;
    });

    return JSON.stringify(data);
}
module.exports = { parseCsvToJson };
