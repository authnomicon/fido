exports = module.exports = function() {
  var Strategy = require('passport-u2f');
  
  return new Strategy(function(_, cb) {
    
    console.log('SK VERIFY CALLBACK');
  });
};

exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@scheme'] = 'x-www-u2f';
exports['@require'] = [
];
