// Generated by CoffeeScript 1.4.0
(function() {
  var app, calculator, engines, express, fs, merchants, path, route, routes, view, _fn;

  fs = require('fs');

  express = require('express');

  path = require('path');

  engines = require('consolidate');

  merchants = require("./routes/merchants");

  calculator = require("./routes/calculator");

  app = express();

  app.enable('trust proxy');

  app.engine('html', require('mmm').__express);

  app.set('view engine', 'html');

  app.set('views', __dirname + '/views');

  app.use(express["static"](__dirname + '/public'));

  app.use(require('connect-assets')({
    src: 'public'
  }));

  app.use(express.bodyParser());

  app.use(express.cookieParser());

  app.use(app.router);

  routes = {
    "/": 'index',
    "/about": 'about',
    "/education": 'education',
    "/coinos": 'coinos',
    "/exchangers": 'exchangers',
    "/exchangers/join": 'join',
    "/membership": 'membership',
    "/merchants": 'merchants',
    "/merchants/signup": 'signup',
    "/contact": 'contact',
    "/partners": 'partners',
    "/coinfest": 'coinfest'
  };

  _fn = function(route, view) {
    return app.get(route, function(req, res) {
      return res.render(view, {
        js: (function() {
          return global.js;
        }),
        css: (function() {
          return global.css;
        }),
        layout: 'layout'
      });
    });
  };
  for (route in routes) {
    view = routes[route];
    _fn(route, view);
  }

  app.get('/bc/*', function(req, res) {
    res.send(req.path);
    return res.end();
  });

  app.get('/merchants2', merchants.list);

  app.get('/claim/:id', function(req, res) {
    var account, i;
    account = ((function() {
      var _i, _len, _ref, _results;
      _ref = require('./accounts.json').accounts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (i.id === req.params.id) {
          _results.push(i);
        }
      }
      return _results;
    })())[0];
    return res.render('claim', {
      js: (function() {
        return global.js;
      }),
      css: (function() {
        return global.css;
      }),
      layout: 'layout',
      address: account.address,
      amount: account.amount,
      rupees: 500,
      url: account.link
    });
  });

  app.post('/contact', function(req, res) {
    var mailOptions, nodemailer, transport;
    nodemailer = require("nodemailer");
    transport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");
    mailOptions = {
      from: "The Bitcoin Co-op <info@bitcoincoop.org>",
      to: "info@bitcoincoop.org",
      subject: "Contact Form",
      html: JSON.stringify(req.body)
    };
    transport.sendMail(mailOptions, function(error, response) {
      if (error) {
        console.log(error);
      }
      return smtpTransport.close();
    });
    return res.render('thanks', {
      js: (function() {
        return global.js;
      }),
      css: (function() {
        return global.css;
      }),
      layout: 'layout'
    });
  });

  app.get('/ticker', calculator.ticker);

  app.use(function(err, req, res, next) {
    res.status(500);
    console.log(err);
    return res.end();
  });

  app.listen(3002);

}).call(this);