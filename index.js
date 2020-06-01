const express = require('express');
const fs = require('fs');
const formidable = require('formidable');

const app = express();
var cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.send('Table Data is at /tableData');
});

// To get the table data
app.get('/tableData', (req, res) => {
  fs.readFile('./tableDataFile.txt', 'UTF8', (err, data) => {
    if (err) throw err;
    res.send(data.split(/\r?\n/));
  });
});

// to set the uploaded file data in tableDataFile
app.post('/uploadData', (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, fileR) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    const { file } = fileR;

    fs.readFile(file.path, 'UTF8', (err, data) => {
      if (err) throw err;
      fs.writeFileSync('./tableDataFile.txt', data);
    });

    res.send({ uploadComplete: true });
  });
});

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`Listening on port ${port}`));
