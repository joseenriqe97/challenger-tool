import axios from 'axios';
const url = "http://localhost:3001";

axios.defaults.validateStatus = () => true;
axios.defaults.timeout = 15000;

export const getFiles = async () => {
    const {data} = await axios.get(`${url}/files/data`, { timeout: 15000 });
    console.log(data, "response")
    const outputArray = data.flatMap(item => {
        return item.lines.map(line => {
            return {
                file: item.file,
                text: line.text,
                number: line.number,
                hex: line.hex
            };
        });
    });
    return outputArray;
};
