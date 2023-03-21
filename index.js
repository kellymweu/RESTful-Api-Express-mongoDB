const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// configure the app to use bodyParser to parse JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connect to MongoDB
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true });

// define the schema for the data to be stored in the database
const MyModelSchema = new mongoose.Schema({
  name: String,
  age: Number
});

// create a mongoose model from the schema
const MyModel = mongoose.model('MyModel', MyModelSchema);

// define the routes for the API
const router = express.Router();

// create a new data item
router.post('/data', (req, res) => {
  const myData = new MyModel(req.body);
  myData.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.json(myData);
    }
  });
});

// get all data items
router.get('/data', (req, res) => {
  MyModel.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
});

// get a single data item by ID
router.get('/data/:id', (req, res) => {
  MyModel.findById(req.params.id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  });
});

// update a data item by ID
router.put('/data/:id', (req, res) => {
  MyModel.findById(req.params.id, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      data.name = req.body.name || data.name;
      data.age = req.body.age || data.age;

      data.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.json(data);
        }
      });
    }
  });
});

// delete a data item by ID
router.delete('/data/:id', (req, res) => {
  MyModel.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: 'Data item deleted' });
    }
  });
});

// default route
router.get('/', (req, res) => {
    res.send('Welcome to my API!');
  });
  
  // register the routes
  app.get('/', (req, res) => {
    res.send('Welcome to my API!');
  });
  
  app.use('/api', router);
  
// start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
