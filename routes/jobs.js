const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// TEST ROUTE
router.get('/test', (req, res) => {
    res.send('TEST ROUTE FUNCIONANDO!!!');
});

// DETAIL OPPORTUNITY
router.get('/view/:id', (req, res) => Job.findOne({
    where: { id: req.params.id }
}).then(job => {
    res.render('view', {
        job
    });
}).catch(err => console.log(err)));

// FORM SEND ROUTE
router.get('/add', (req, res) => {
    res.render('add');
});

// ADD JOB BY POST
router.post('/add', (req, res) => {

    let { title, salary, company, description, email, new_job } = req.body;

    // INSERT
    Job.create({
        title,
        description,
        salary,
        company,
        email,
        new_job
    })
        .then(() => res.redirect('/'))
        .catch(err => console.log('ERRO!!!', err));

});

module.exports = router;
