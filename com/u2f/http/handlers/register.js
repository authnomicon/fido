/**
 * Public key registration handler.
 */
exports = module.exports = function(ks, RegistrationResponse, parse) {
  var base64url = require('base64url')
    , crypto = require('crypto')
    //, rfc5280 = require('asn1.js-rfc5280')
    //, x509 = require('@fidm/x509')
  
  function hash(data) {
    return crypto.createHash('SHA256').update(data).digest();
  }
  
  function verify(data, cert, signature) {
    return crypto.createVerify("RSA-SHA256")
                .update(data) 
                .verify(cert, signature);
  }
  
  // https://github.com/ashtuchkin/u2f/blob/master/index.js
  function certToPEM(cert) {
    var pem = '-----BEGIN CERTIFICATE-----\n'
      , s;
    for (s = cert.toString('base64'); s.length > 64; s = s.slice(64))
      pem += s.slice(0, 64) + '\n';
    pem += s + '\n';
    pem += '-----END CERTIFICATE-----\n';
    return pem;
  }
  
  function pubkeyToPEM(key) {
    var pubkey = Buffer.concat([
      Buffer.from('3059301306072a8648ce3d020106082a8648ce3d030107034200', 'hex'),
      key
    ]);
    
    var pem = '-----BEGIN PUBLIC KEY-----\n'
      , s;
    for (s = pubkey.toString('base64'); s.length > 64; s = s.slice(64))
      pem += s.slice(0, 64) + '\n';
    pem += s + '\n';
    pem += '-----END PUBLIC KEY-----\n';
    return pem;
  }
  
  
  
  // https://support.yubico.com/support/solutions/articles/15000017511-enabling-u2f-support-in-mozilla-firefoxå
  
  
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
      
      // TODO: Get this from challenge store
      var appId = 'https://a5e092b7af7f.ngrok.io';
      
      
      
      //var clientData = JSON.parse(base64url.decode(req.body.clientData));
      
      var clientData = base64url.decode(req.body.clientData);
      console.log(JSON.parse(clientData));
      
      var registrationData = RegistrationResponse.parse(base64url.toBuffer(req.body.registrationData));
      console.log(registrationData);
      
      //console.log(base64url.decode(req.body.clientData));
      //console.log(base64url.decode(req.body.registrationData));
      
      
      var rfu = new Buffer.from('00', 'hex');
      var applicationParameter = hash(appId);
      var challengeParameter = hash(clientData);
      
      
      var base = Buffer.concat([
        rfu,
        applicationParameter,
        challengeParameter,
        registrationData.keyHandle,
        registrationData.userPublicKey
      ]);
      
      // https://developers.yubico.com/U2F/Attestation_and_Metadata/
      
      var cert = certToPEM(registrationData.attestationCertificate)
      
      var ok = verify(base, cert, registrationData.signature);
      
      // TODO: Implement all the necessary checks on client data.
      
      // TODO: Implement a way to pull authenticator info from cert, and validate trust.
      // openssl x509 -in cert.pem -text -noout
      /*
      var res = rfc5280.Certificate.decode(cert, 'pem', { partial: true, label: 'CERTIFICATE' });
      //var res = rfc5280.Certificate.decode(registrationData.attestationCertificate, 'der', { partial: true });
      console.log(res);
      
      //var c = x509.Certificate.fromPEM(cert);
      //console.log(c);
      
      //console.log('CRED ID: ' + Buffer.from(attestation.authData.attestedCredentialData.credentialId).toString('base64'))
      */
      
      var key = {
        id: base64url.encode(registrationData.keyHandle),
        pubkey: pubkeyToPEM(registrationData.userPublicKey)
      };
      
      // TODO: Authenticate the user and pass it as an argument here
      ks.create(key, function(err) {
        next();
      });
    },
    function(req, res, next) {
      res.json({ todo: true })
    }
  ];
  
  // TODO: csrf protection ?
  // TODO: ceremony support ?
  
};

exports['@require'] = [
  'http://i.authnomicon.org/credentials/KeyService',
  'http://i.authnomicon.org/fido/u2f/RegistrationResponse',
  'http://i.bixbyjs.org/http/middleware/parse'
];
