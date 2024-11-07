const {Parser}  =  require('@json2csv/plainjs');

const jsonToCSV = (jsonData) => {
    const opts = {};
    const parser = new Parser(opts);
    return parser.parse(jsonData);
}

module.exports = {
    jsonToCSV
}
