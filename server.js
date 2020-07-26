const express = require('express'),
    app = express(),
    port = 4200,
    content = './content',
    file = '/index.md';

const fs = require('fs');

const showdown = require('showdown');
const converter = new showdown.Converter();

const { JSDOM } = require('jsdom');

app.use(express.static(__dirname + 'public'));

/**
* This is loaded syncrounously, as it's only necessary to load once
*/
const templateFile = fs.readFileSync('./template.html', (err, template) => {
   if (err) console.error(err);
   return template.file.toString();
});

app.get('*', (req, res, next) => {
    // TODO sanitise the URL, check if a file exists at that url, otherwise redirect
    const contentLocation = content + req.url + file;

    fs.readFile(contentLocation, (err, data) => {
        processContent(err, data, res, next);
    });
}, (req, res) => {
    res.type('html');
    res.status(200);
    res.send(appendContentToTemplate(res.content));
});

/**
 * Check if the url provided contains a file, if not return 404, other errors
 * are 500 server errors, otherwise we convert the markdown to html and move
 * on to the next piece of middleware
 */
function processContent(err, data, res, next) {
    if (err && err.errno === -4058) {
        res.status(404).send('404');
    } else if (err) {
        console.error(err);
        res.status(500).send('500');
    } else {
        res.content = converter.makeHtml(data.toString());
        next();
    }
}

/**
 * Adds the passed in content to the placeholder in the body of the template.html file
 */
function appendContentToTemplate(content) {
    let dom = new JSDOM(templateFile);
    dom.window.document.body.innerHTML = new JSDOM(content).serialize();
    return converter.makeHtml(dom.serialize());
}

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});