/* global describe, it */

var expect = require('chai').expect;


describe('@authnomicon/fido', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
  
    it('should have component metadata', function() {
      expect(json.namespace).to.equal('org.authnomicon/fido');
      expect(json.components).to.have.length(4);
      expect(json.components).to.include('u2f/authenticationresponse');
      expect(json.components).to.include('u2f/registrationresponse');
      expect(json.components).to.include('u2f/http/service');
      expect(json.components).to.include('u2f/http/scheme');
    });
  });
  
});
