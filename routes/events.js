var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Event = require('../models/event');


/*Ajouter event */

router.post("/add2", (req, res) => {
    var e = new Event({
        user: req.body.user,
        title : req.body.title,
        location: req.body.location,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
		outfit: req.body.outfit
    });
    e.save((err, event) => {
        if (err) res.json(err);
        else res.json(event);
        User.findOne({_id:req.body.user},(err,u)=>{
            if (err) res.json(err)
                else u.evs.push(event)
            u.save();
        })
    });
});

/* GET events  */
router.get('/all', (req,res) => {

    Event.find((err, events) => {
        if (err) res.json(err)
        else res.json(events)
        console.log(events);
    })
});



/* GET event by userId  */
router.get('/:id', (req,res) => {
    Event.find({user:req.params.id},(err, events) => {
        if (err) res.json(err)
        else res.json(events)
        console.log(events);
    })
});


/* Modifier event */
router.post("/update", (req, res) => {
    Event.findOneAndUpdate({_id:req.body._id},req.body,(err, event) => {
        if (err) res.json(err);
        else res.json('event updated successfully'+event);
    });
});

/* Supprimer event */
router.get('/delete/:id', (req,res) => {
    Event.deleteOne({_id:req.params.id},(err,ev) => {
        if (err) res.json(err)
        else res.json(ev+'deleted')
        console.log(ev);
    })
});

module.exports = router;

