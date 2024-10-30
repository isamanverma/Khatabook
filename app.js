const express = require('express')
const morgan = require('morgan')
const path = require('path')
const fs = require('fs')

const app = express();

app.use(morgan('dev'));
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            res.status(500).send("Error reading the files")
            return;
        }
        else {
            console.log(files)
            res.render('index', { files: files })
        }
    })
})

app.post('/create', (req, res) => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedToday = `${day}-${month}-${year}`;

    if (!req.body.date) {
        fs.writeFile(`./files/${formattedToday}.txt`, req.body.data, (err) => {
            if (err) {
                res.status(500).send("Error creating the file")
                return;
            }
            else {
                res.redirect('/')
            }
        })
    } else {
        const inputDate = new Date(req.body.date);
        const inputDay = String(inputDate.getDate()).padStart(2, '0');
        const inputMonth = String(inputDate.getMonth() + 1).padStart(2, '0');
        const inputYear = inputDate.getFullYear();
        const formattedInputDate = `${inputDay}-${inputMonth}-${inputYear}`;

        fs.writeFile(`./files/${formattedInputDate}.txt`, req.body.data, (err) => {
            if (err) {
                res.status(500).send("Error creating the file")
                return;
            }
            else {
                res.redirect('/')
            }
        });
    }
})

app.get('/view/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send("Error viewing the file")
            return;
        }
        else {
            res.render('view', { filename: req.params.filename, data: data })
        }
    })
})

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send("Error reading the file")
            return;
        }
        else {
            res.render('edit', { filename: req.params.filename, data: data })
        }
    })
})

app.post('/update/:filename', (req, res) => {
    fs.writeFile(`./files/${req.params.filename}`, req.body.filedata, (err) => {
        if (err) {
            res.status(500).send("Error Update the File")
        }
        res.redirect('/')
    })
})

app.get('/delete/:filename', (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        if (err) {
            res.status(500).send("Error deleting file")
            return;
        }
        else {
            res.redirect('/')
        }
    })
})

const port = 3000
app.listen(port, console.log(`Listening: http://localhost:3000`))