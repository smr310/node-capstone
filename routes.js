let UpcomingEvent = require('./upcomingModel').UpcomingEvent;
let RegisteredEvent = require('./registeredModel').RegisteredEvent;
let User = require('./users/models').User

const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });


function routes(app) {

    app.get('/upcomingEvents', jwtAuth, (req, res) => {
        //console.log('HITTING THE ENDPOINT');
        UpcomingEvent.find(function (err, docs) {
            if (!err) {
                //console.log('this is docs from GET /upcomingEvents', docs);
                let myObj = {
                    events: docs
                }
                res.send(myObj)
            } else { throw err; }
        });
    })

    app.get('/registeredEvents', jwtAuth, (req, res) => {
        User.findById(req.user.id)
            .populate('registeredEvents').
            exec(function (err, docs) {
                if (!err) {
                    //console.log('this is docs from GET /registeredEvents', docs);
                    let myObj = {
                        events: docs.registeredEvents
                    }
                    res.send(myObj)
                } else { throw err; }
            });    
    })


    app.post('/registeredEvents/:id', jwtAuth, (req, res) => {

        let needToRentBike = false;
        let needToRentHelmet = false;
        let needToRentBoots = false;
        let needToRentGloves = false;
        let needToRentSuit = false;

        if (req.body.motorcycleRentalAnswer === 'Yes') {
            needToRentBike = true;
        } else {
            needToRentBike = false;
        }

        req.body.gearRental.forEach((item) => {
            if (item === 'Helmet') {
                needToRentHelmet = true
            } else if (item === 'Boots') {
                needToRentBoots = true
            } else if (item === 'Gloves') {
                needToRentGloves = true
            } else if (item === 'Leather-Racing-Suit') {
                needToRentSuit = true
            }
        });

        // console.log('this is passports req.user', req.user);
        // console.log('this is req.param.id', req.params.id);

      
            User.findByIdAndUpdate(req.user.id,
                {
                    $push: {
                        registeredEvents: [{
                            trackName: req.body.trackName,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            eventDate: req.body.eventDate,
                            needToRentBike: needToRentBike,
                            needToRentHelmet: needToRentHelmet,
                            needToRentSuit: needToRentSuit,
                            needToRentGloves: needToRentGloves,
                            needToRentBoots: needToRentBoots,
                        }]
                    }
                }).then(function (doc) {
                    let myObj = {
                        events: doc
                    }
                    res.send(myObj)
                })
    })


    app.put('/registeredEvents:id', jwtAuth, (req, res) => {

        let id = req.params.id
        //console.log('this is the id of the event to change', id)


        let needToRentBike = false;
        let needToRentHelmet = false;
        let needToRentBoots = false;
        let needToRentGloves = false;
        let needToRentSuit = false;

        let firstName = req.body.firstName;
        let lastName = req.body.lastName;

        if (req.body.motorcycleRentalAnswer === 'Yes') {
            needToRentBike = true;
        } else {
            needToRentBike = false;
        }

        req.body.gearRental.forEach((item) => {
            if (item === 'Helmet') {
                needToRentHelmet = true
            } else if (item === 'Boots') {
                needToRentBoots = true
            } else if (item === 'Gloves') {
                needToRentGloves = true
            } else if (item === 'Leather-Racing-Suit') {
                needToRentSuit = true
            }
        });


        User.update({ "_id": req.user.id, "registeredEvents._id": id },
            {
                $set:
                    {
                        "registeredEvents.$.needToRentBike": needToRentBike,
                        "registeredEvents.$.needToRentHelmet": needToRentHelmet,
                        "registeredEvents.$.needToRentBoots": needToRentBoots,
                        "registeredEvents.$.needToRentGloves": needToRentGloves,
                        "registeredEvents.$.needToRentSuit": needToRentSuit,
                        "registeredEvents.$.firstName": firstName,
                        "registeredEvents.$.lastName": lastName
                    }
            }).then(function (doc) { });
        res.end();
    })


    app.delete('/registeredEvents:id', jwtAuth, (req, res) => {
        let id = req.params.id;
        //console.log('this is the id', id)

        User.findOne({ "_id": req.user.id }, function (err, result) {
            //console.log('this is result', result)
            result.registeredEvents.id(id).remove();
            result.save();
            let myObj = {
                events: result.registeredEvents
            }
            res.send(myObj)
        });
    })
}


function findById(id, arr) {
    let _index;
    arr.some((registeredEvent, index) => {
        if (registeredEvent.id === id) {
            _index = index
            return true;
        }
    })
    return _index
}

module.exports = routes;


