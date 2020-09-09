/**
 * Public key authentication handler.
 */
exports = module.exports = function(parse, csrfProtection, authenticate, ceremony) {
  var base64url = require('base64url');
  
  
  function establishSession(req, res, next) {
    req.login(req.user, req.authInfo, function(err) {
      if (err) { return next(err); }
      return next();
    });
  }
  
  
  // TODO: Investigate using a cookie-less CSRF protection mechanism, such
  //       as checking referrer headers, per 
  //       https://seclab.stanford.edu/websec/csrf/csrf.pdf
  
  return [
    parse('application/json'),
    /*
    function(req, res, next) {
      console.log('LOGIN U2F');
      console.log(req.headers);
      console.log(req.body);
      
      var sigData = AuthenticationResponse.parse(base64url.toBuffer(req.body.signatureData));
      console.log(sigData);
      
    },
    function(req, res, next) {
      console.log('LOGIN WEBAUTHN');
      console.log(req.headers);
      console.log(req.body);
      
      
      var clientData = JSON.parse(Buffer.from(req.body.clientDataJSON, 'base64').toString());
      console.log(clientData);
      
      var authenticatorData = AuthenticatorData.parse(Buffer.from(req.body.authenticatorData, 'base64'));
      console.log(authenticatorData);
      
    },
    */
    //csrfProtection(), FIXME: put this back in
    ceremony(
      authenticate('x-www-u2f'),
      function(req, res, next) {
        console.log('AUTHENTICATED!');
      },
      [ establishSession ]
    )
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/csrfProtection',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
