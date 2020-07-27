const express = require('express'),
    app = express(),
    port = 4200,
    content = './content',
    file = '/index.md';

const fs = require('fs');

const showdown = require('showdown');
const converter = new showdown.Converter();

const { JSDOM } = require('jsdom');

app.use(express.static('public')); // serves up the css

/**
* This is loaded syncrounously, as it's only necessary to load once
*/
const templateFile = fs.readFileSync('./template.html', (err, template) => {
    if (err) console.error(err);
    return template.file.toString();
});

app.get('*', (req, res) => {
    // TODO sanitise the URL
    const contentLocation = content + req.url + file;

    fs.readFile(contentLocation, function(err, data) {
        processContent(err, data, res);
    });
});

/**
 * Check if the url provided contains a file, if not return 404, other errors
 * are 500 server errors, otherwise we convert the markdown to html and move
 * on to the next piece of middleware
 */
function processContent(err, data, res) {
    if (err && err.code === 'ENOENT') {
        res.status(404).send('404');
    } else if (err) {
        console.error(err);
        res.status(500).send('500');
    } else {
        res.status(200).send(appendContentToTemplate(data.toString()));
    }
}

/**
 * Adds the passed in content to the placeholder in the body of the template.html file
 */
function appendContentToTemplate(data) {
    const dom = new JSDOM(templateFile);
    dom.window.document.body.innerHTML = converter.makeHtml(data);
    return dom.serialize();
}

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

module.exports = {
    processContent: processContent,
    appendContentToTemplate: appendContentToTemplate
}