const axios = require('axios');
const { parseCsvToJson } = require('../util/parseStringCSV');
const { url, secretKey } = require('../../config.json');

axios.defaults.validateStatus = (status) => {
    return true;
};

const isNumeric = n => !!Number(n);

const getFiles = async (req, res) => {
    const results = [];

    try {
        const files = await axios.get(`${url}/v1/secret/files`, {
            headers: {
                Authorization: `Bearer ${secretKey}`
            }
        });


        for (const file of files.data.files) {
            const data = await fetchFileByName(file);

            if (data.status && data.status !== 200) {
                break;
            }

            const parsed = JSON.parse(parseCsvToJson(data, 'file'));

            const filtered = parsed.filter(line => {
                return line.text !== ''
                    && isNumeric(line.number)
                    && line.hex.length <= 32 && line.hex.length > 0;
            });

            if (filtered.length > 0) {
                results.push({
                    file,
                    lines: filtered
                });
            }
        }
        res.send(results);

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

const fetchFileByName = async (fileName) => {
    const response = await axios.get(`${url}/v1/secret/file/${fileName}`, {
        headers: {
            Authorization: `Bearer ${secretKey}`
        }
    });

    return response.data;
}

module.exports = {
    getFiles
};
