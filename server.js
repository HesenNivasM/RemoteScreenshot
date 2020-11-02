const http = require('http');
const express = require('express');
const path = require('path');
const Pageres = require('pageres');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

let filename;

app.post('/submit', (req, res) => {
    console.log('====================' + req.body['url'] + "====================")
    let date = new Date();
    let minutes =
        date.getMinutes() < 10
            ? '0' + String(date.getMinutes())
            : date.getMinutes();
    let seconds =
        date.getSeconds() < 10
            ? '0' + String(date.getSeconds())
            : date.getSeconds();
    filename =
        date.toISOString().slice(0, 10) +
        '-' +
        date.getHours() +
        '-' +
        minutes +
        '-' +
        seconds +
        '.png';

    (async () => {
        await new Pageres({ delay: 5 })
            .src('https://' + req.body.url, ['1024x768'], {
                crop: true,
                filename: '<%= date %>-<%= time %>',
            })
            .dest(__dirname + '/public/images')
            .run();

        console.log('Finished generating screenshots!');
    })();
    res.redirect('/');
});

app.use('/', (req, res) => {
    res.render('index.html', { targetURL: filename });
    console.log('Gottt');
});

const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
