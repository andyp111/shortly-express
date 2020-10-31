const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // req.body = {username, password};
  // console.log(req.headers.cookie);
  Promise.resolve(req.headers.cookie)
    .then((hash) => {
      return models.Sessions.get({hash})
        .tap((resultSession) => {
          if (!resultSession) {
            throw resultSession;
          }
        });
    }) //when we already have a cookie
    .catch(() => { //need a return statement to give value to resultsObj .then => do something from result from .catch
      return models.Sessions.create()
        .then((resultsObj) => {
          return models.Sessions.get({id: resultsObj.insertId})
            .tap((resultSession) => {
              res.cookie('sid', resultSession.hash);
            });
        });
    })
    .then((resultSession) => {
      req.session = resultSession;

      next();
    });
};

// let q = 'insert into sessions (userid) values (select id from users inner join sessions where sessions.userid = user.id)';



// console.log(models.sessions.get{hash})

// cookie:
// 'notcookie=%7B%22id%22%3A96%2C%22hash%22%3A%224649d9502d6a93d214d975f6d376de13f49f11d11fa98233ef65fb1e0c2c2f68%22%2C%22userId%22%3Anull%7D; user; user=, {"id":110,"hash":"695f270a9e455d1e9a02a81aafacb090dcb5004ad3ea74d880d5169491c455ce","userId":null}=undefined' },



// { hash, userid }







/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

