/**
 * Public key authentication handler.
 */
exports = module.exports = function(RegistrationResponse, parse, csrfProtection, authenticate, ceremony) {
  var base64url = require('base64url');
  
  
  // https://support.yubico.com/support/solutions/articles/15000017511-enabling-u2f-support-in-mozilla-firefox
  
  
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
    function(req, res, next) {
      console.log('REGISTER U2F');
      console.log(req.headers);
      console.log(req.body);
      
      console.log(base64url.decode(req.body.clientData));
      
      //var clientData = JSON.parse(base64url.decode(req.body.clientData));
      
      var regData = RegistrationResponse.parse(base64url.toBuffer(req.body.registrationData));
      console.log(regData);
      
      console.log(regData.keyHandle.toString('base64'));
      console.log(base64url.encode(regData.keyHandle));
      
      //console.log(base64url.decode(req.body.clientData));
      //console.log(base64url.decode(req.body.registrationData));
      
      //console.log('CRED ID: ' + Buffer.from(attestation.authData.attestedCredentialData.credentialId).toString('base64'))
      
    },
    
    function(req, res, next) {
      console.log('REGISTER WEBAUTHN');
      console.log(req.headers);
      console.log(req.body);
      
      var clientData = JSON.parse(Buffer.from(req.body.clientDataJSON, 'base64').toString());
      console.log(clientData);
      
      var attestation = Attestation.parse(Buffer.from(req.body.attestationObject, 'base64'), true);
      console.log(attestation);
      
      //console.log('CRED ID: ' + Buffer.from(attestation.authData.attestedCredentialData.credentialId).toString('base64'))
      
    },
    //csrfProtection(),
    ceremony(
      authenticate('x-www-publickey'),
      [ establishSession ]
    )
  ];
};

exports['@require'] = [
  'http://i.authnomicon.org/fido/u2f/RegistrationResponse',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/csrfProtection',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/ceremony'
];
