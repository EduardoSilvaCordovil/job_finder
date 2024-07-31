const express    = require('express');
const exphbs     = require('express-handlebars');
const app        = express();
const path       = require('path');
const db         = require('./db/connection');
const bodyParser = require('body-parser');
const Job        = require('./models/Job');
const Sequelize  = require('sequelize');
const Op         = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function () {
    console.log(`EXPRESS NA PORTA: ${PORT}`);
});

// BODY PARSER
app.use(bodyParser.urlencoded({ extended: false }));

// HANDLE BARS
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// DB CONECTION
db
    .authenticate()
    .then(() => {
        console.log("Conectado ao banco");
    })
    .catch(err => {
        console.log("Erro ao conectar", err);
    });

// ROUTES
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%'+search+'%';

    if (!search) {
        Job.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        })
            .then(jobs => {
                res.render('index', {
                    jobs
                });
            }).catch(err => console.log(err));
    } else {
        Job.findAll({
            where: {title: {[Op.like]: search}},
            order: [
                ['createdAt', 'DESC']
            ]
        })
            .then(jobs => {
                res.render('index', {
                    jobs, search
                });
            }).catch(err => console.log(err));
    }
});

// JOBS ROUTES
app.use('/jobs', require('./routes/jobs'));
