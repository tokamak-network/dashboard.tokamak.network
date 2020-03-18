const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');

const upload = multer({
  dest: './avatars',
});
app.use('/avatars', express.static(__dirname + '/avatars'));

const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
low(adapter)
  .then(db => {
    app.get('/operators', (_, res) => {
      const operators = db.get('operators')
        .value();

      res.status(200).json(operators);
    });

    app.get('/managers', (_, res) => {
      const managers = db.get('managers')
        .value();

      res.status(200).json(managers);
    });

    app.get('/history/:user', (req, res) => {
      const user = (req.params.user).toLowerCase();
      const history = db.get('history')
        .find({ user })
        .value();

      res.status(200).json({
        history: history === '' ? history : [],
      });
    });

    // only from curl.
    app.post('/managers', (req, res) => {
      db.get('managers')
        .assign(req.body)
        .write()
        .then(managers => res.status(200).json({ managers }));
    });

    // only from curl.
    app.post('/operators', upload.single('avatar'), (req, res) => {
      const operator = db.get('operators').find({ rootchain: req.body.rootchain }).value();
      if (operator) {
        return res.status(500).send({ error: 'duplicated operator' });
      }

      const color = 'rgb(' + (Math.floor(Math.random() * 256)) +',' +
                             (Math.floor(Math.random() * 256)) + ',' +
                             (Math.floor(Math.random() * 256)) + ')';
      db.get('operators')
        .push(req.body)
        .last()
        .assign({ avatar: '' })
        .assign({ background: color })
        .write()
        .then(operators => res.status(200).json({ operators }));
    });

    app.put('/operators/:rootchain', upload.single('avatar'), (req, res) => {
      const operator = db.get('operators').find({ rootchain: req.params.rootchain }).value();

      db.get('operators')
        .find({ rootchain: req.params.rootchain })
        .assign(req.body)
        .assign({ avatar: req.file ? req.file.filename : operator.avatar })
        .write()
        .then(operators => res.status(200).json({ operators }));
    });

    app.post('/history/:user', (req, res) => {
      const user = (req.params.user).toLowerCase();

      db.get('history')
        .push(req.body)
        .last()
        .assign({ user })
        .write()
        .then(history => res.status(200).json({ history }));
    });

    return db.defaults({
      managers: {},
      operators: [],
      history: [],
    }).write();
  })
  .then(() => {
    app.listen(9000, () => console.log('listening on port 9000'));
  });
