const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const path = require('path');
const db = require('./db/connection');
const bodyParser = require('body-parser');
const { handle } = require('express/lib/application');
const Job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function() {
    console.log(`O Express está rodando na porta ${PORT}`);
});

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));

// handle-bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// Conexão do Banco de Dados
db
    .authenticate()
    .then(() => {
        console.log("Banco de Dados conectado com sucesso :)");
    })
    .catch(err => {
        console.log("Erro ao conectar com o Banco de Dados :(");
    });

// Rotas
app.get('/', (req, res) => {

    let search = req.query.job;
    let query = '%' + search + '%' // PH -> PHP, exemplo de busca

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

            })
            .catch(err => console.log(err));
    } else {
        Job.findAll({
                where: {
                    title: {
                        [Op.like]: query
                    }
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            })
            .then(jobs => {

                res.render('index', {
                    jobs,
                    search
                });

            })
            .catch(err => console.log(err));;
    }
});

// Jobs Routes
app.use('/jobs', require('./routes/jobs'));