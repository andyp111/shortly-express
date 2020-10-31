

const parseCookies = (req, res, next) => {
  const cookies = {};
  let loginCookie = req.headers.cookie || '';
  // console.log(loginCookie);
  // console.log('req.headers cookie', req.headers);

  let splitCookies = loginCookie.split('='); //becomes an array

  // console.log(splitCookies);
  cookies[splitCookies[0].toString()] = splitCookies[1];
  req.cookie = cookies;
  // res.cookie(cookie);
  // console.log(cookies);
  // console.log('parseCookies', req.headers.cookie.sid);
  // console.log(splitCookies);
  // req.cookies = cookies;
  // let splitByEqual = splitCookies.split('=');
  // splitCookies.forEach(item => {
  //   // splitByEqual = [];
  //   // splitByEqual.push(item.split('='));
  //   let splitByEqual = item.split('=');
  //   cookies[splitByEqual[0]] = splitByEqual[1];
  // });
  next();
};

module.exports = parseCookies;



// cookies[splitByEqual[1][0]] = splitByEqual[1][1];
// req.cookies = cookies;
// return req.cookies;
// return req.cookies;
// Perhaps implied?
// next();
// 1st [user=someone, session=QyhYzXhkTZawIb5qSl3KKyPVN]
// 2nd [[user, someone], [session, Qyh..]]
// 3rd: {user: someone}
// cookies[arr[0][0]] = arr[0][1]

// const app = require('express')();
// app.use('/', (req, res) => {
//   var cookie = getcookie(req);
//     console.log(cookie);
// });

// function getcookie(req) {
//   var cookie = req.headers.cookie;
//   // user=someone; connect.sid=QyhYzXhkTZawIb5qSl3KKyPVN
//(this is my cookie i get)
//     return cookie.split('; ');
// }

// cookie example:
// In response header:
// set-cookie: connect.sid=s%3AL46Hr5Crb...; Path =/; HttpOnly

// var get_cookies = function(request) {
//   var cookies = {};
//   request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
//     var parts = cookie.match(/(.*?)=(.*)$/)
//     cookies[ parts[1].trim() ] = (parts[2] || '').trim();
//   });
//   return cookies;
// };