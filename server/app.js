const express = require('express');
const path = require('path');
const utils = require('./lib/hashUtils');
const partials = require('express-partials');
const bodyParser = require('body-parser');
const Auth = require('./middleware/auth.js');
const models = require('./models');
const parseCookies = require('./middleware/cookieParser.js');


const app = express();

app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(parseCookies);
app.use(Auth.createSession);


app.get('/',
  (req, res) => {
    res.render('index');
    // console.log(req.get('Cookie'));
  });

app.get('/create',
  (req, res) => {
    res.render('index');
  });

app.get('/links',
  (req, res, next) => {
    models.Links.getAll()
      .then(links => {
        res.status(200).send(links);
      })
      .error(error => {
        res.status(500).send(error);
      });
  });

app.post('/links',
  (req, res, next) => {
    var url = req.body.url;
    if (!models.Links.isValidUrl(url)) {
      // send back a 404 if link is not valid
      return res.sendStatus(404);
    }

    return models.Links.get({ url })
      .then((link) => {
        if (link) {
          throw link;
        }
        return models.Links.getUrlTitle(url);
      })
      .then((title) => {
        return models.Links.create({
          url: url,
          title: title,
          baseUrl: req.headers.origin,
        });
      })
      .then((results) => {
        return models.Links.get({ id: results.insertId });
      })
      .then((link) => {
        throw link;
      })
      .error((error) => {
        res.status(500).send(error);
      })
      .catch((link) => {
        res.status(200).send(link);
      });
  });

/************************************************************/
// Write your authentication routes here
/************************************************************/

// '/signup'
app.post('/signup', (req, res) => {
  // console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  return models.Users.get({username})
    .then((user) => {
      if (user) {
        throw user;
      } else {
        return models.Users.create({username, password});
      }
    })
    .then(() => {
      res.redirect('/');
    })
    .catch(() => {
      res.redirect('/signup');
    })
    // .then(() => {
    //   redirect('/signup');
    // })
    .error((error) => {
      res.status(500).send(error);
    });
});

app.get('/signup', (req, res) => {
  console.log('signup page');
  res.status(200);
  res.render('signup');
});
// '/login'
// app.use(parseCookies());


app.get('/login', (req, res) => {
  console.log('req', req);
  // console.log('req.cookies', req.cookie);
  res.status(200);
  res.render('login');

});

app.post('/login', (req, res) => {
  // console.log(req.cookies);
  let username = req.body.username;
  let password = req.body.password;
  // console.log('Cookies:', req.cookies);
  return models.Users.get({username})
    .then(user => {
      if (!user || !models.Users.compare(password, user.password, user.salt)) {
        throw new Error ('username and password do not match');
      }
    })
    // .tap(() => {
    //   req.session.name = {username: req.body.username};
    //   // console.log(req.session.name);
    // })
    .then(() => {
      res.redirect('/');
    })
    .catch(() => {
      res.redirect('/login');
    });
});

/************************************************************/
// Handle the code parameter route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/:code', (req, res, next) => {

  return models.Links.get({ code: req.params.code })
    .tap(link => {

      if (!link) {
        throw new Error('Link does not exist');
      }
      return models.Clicks.create({ linkId: link.id });
    })
    .tap(link => {
      return models.Links.update(link, { visits: link.visits + 1 });
    })
    .then(({ url }) => {
      res.redirect(url);
    })
    .error(error => {
      res.status(500).send(error);
    })
    .catch(() => {
      res.redirect('/');
    });
});

module.exports = app;
