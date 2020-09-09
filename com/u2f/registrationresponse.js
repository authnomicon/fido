exports = module.exports = function() {
  var u2f = require('passport-u2f').u2f;
  
  return u2f.RegistrationResponse;
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.authnomicon.org/fido/u2f/RegistrationResponse';
exports['@require'] = [];
