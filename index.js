const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/occupancy', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const occupancySchema = new mongoose.Schema({
    name: String,
    description: String,
    occupancy: Number,
    createdAt: Date,
    updatedAt: Date
});

occupancySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

occupancySchema.pre('findOneAndUpdate', function (next) {
    this.updatedAt = Date.now();
    next();
});

occupancySchema.pre('findOneAndRemove', function (next) {
    this.updatedAt = Date.now();
    next();
});

let Occupancy = mongoose.model('Occupancy', occupancySchema);

// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/api/occupancy', function (req, res) {
    Occupancy.find({}, function (err, occupancy) {
        if (err) {
            res.send(err);
        } else {
            res.send(occupancy);
        }
    });
});

function createOccupancy(occupancy, res) {
    Occupancy.create(occupancy, function (err, occupancy) {
        if (err) {
            res.send(err);
        } else {
            res.send(occupancy);
        }
    });
}

var occupancy = {
    name: 'occupancy',
    description: 'occupancy',
    occupancy: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
};

app.post('/api/occupancy', function (req, res) {
    createOccupancy(occupancy, res);
});

app.put('/api/occupancy', function (req, res) {
    Occupancy.findOneAndUpdate({ name: req.body.name }, req.body, function (err, occupancy) {
        if (err) {
            res.send(err);
        } else {
            res.send(occupancy);
        }
    });
});

app.delete('/api/occupancy', function (req, res) {
    Occupancy.findOneAndRemove({ name: req.body.name }, function (err, occupancy) {
        if (err) {
            res.send(err);
        } else {
            res.send(occupancy);
        }
    });
});


app.listen(port, function () {
    console.log('Listening on port ' + port);
});
