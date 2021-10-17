const express = require('express');
const morgan = require('morgan');

const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');

const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://Mateusz:Mongo1234@blogtutorial.e45gp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(443))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});



app.get('*', checkUser);

app.use(authRoutes);
// blog routes
app.use('/blogs', blogRoutes);

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

