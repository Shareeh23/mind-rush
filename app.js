const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const gameRoutes = require('./routes/game');
const userRoutes = require('./routes/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));

app.use(gameRoutes);
app.use(userRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);

