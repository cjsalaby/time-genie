const {isValid, parse} = require("./date-fns-helper");
const puppeteer = require('puppeteer');

function generateHTMLTable(data) {
    let html = '<table border="1">';
    const headers = getHeaders(data);
    // Generate table header row
    html += '<tr>';
    for (let i in headers) {
        html += `<th>${headers[i]}</th>`;
    }
    html += '</tr>';

    // Generate table rows
    data.forEach(obj => {
        html += '<tr>';
        for (let i in headers) {
            const header = headers[i];
            const content = obj[header];
            if (!content && isValid(parse(header, 'yyyy-mm-dd', new Date()))) {
                html += `<td>00:00:00</td>`;
                continue;
            }
            html += `<td>${content}</td>`;
        }
        html += '</tr>';
    });

    html += '</table>';
    return html;
}

function getHeaders(jsonData) {
    let headers = [];
    jsonData.forEach(obj => {
        Object.keys(obj).forEach(key => {
            if (!headers.includes(key)) {
                headers.push(key);
            }
        });
    });
    return headers;
}

const jsonToHTML = (jsonData) => {
    // Generate HTML table from the data array
    const htmlTable = generateHTMLTable(jsonData);
    // HTML content to be converted to PDF
    return `
    <html lang="en">
        <head>
            <title>Timesheet Export</title>
        </head>
        <body>
            ${htmlTable} 
        </body>
    </html>
    `;
}

const getPdfBuffer = async (htmlData) => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(htmlData);

    const pdfBuffer  = await page.pdf({format: "A4"});
    await browser.close();
    return pdfBuffer;
}

module.exports = {
    jsonToHTML,
    getPdfBuffer
}
