/* global describe, it, expect */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/u2f/http/handlers/register');
var RegistrationResponse = require('../../../../com/u2f/registrationresponse')();


describe('u2f/http/handlers/register', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    function parse(type) {
      return function(req, res, next) {
        req.__ = req.__ || {};
        req.__.supportedMediaType = type;
        next();
      };
    }
    
    
    describe('registering Yubikey 4 from Firefox', function() {
      var keys = new Object();
      keys.create = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
      });
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(keys, RegistrationResponse, parse);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            request.body = {
              clientData: "eyJjaGFsbGVuZ2UiOiJSZWdpc3RlckNoYWxsZW5nZSIsIm9yaWdpbiI6Imh0dHBzOi8vYTVlMDkyYjdhZjdmLm5ncm9rLmlvIiwidHlwIjoibmF2aWdhdG9yLmlkLmZpbmlzaEVucm9sbG1lbnQifQ",
              registrationData: "BQQCwPZ6Q1R60N1b3FhdTFxprOFalF38FPUxMShYlpmEDpFzKV-0nIVOn-bSiwk_B20Q0HUd1OPhtrdE7LOgECblQBc5Y_ezL7D9Q0FIrq29zOscbXpfx5rdvHS3YwBB66iugag4cc39q6s-rrOQa1bfd5h9a0yZQzjK40vYYqW_iHMwggJPMIIBN6ADAgECAgQSNtF_MA0GCSqGSIb3DQEBCwUAMC4xLDAqBgNVBAMTI1l1YmljbyBVMkYgUm9vdCBDQSBTZXJpYWwgNDU3MjAwNjMxMCAXDTE0MDgwMTAwMDAwMFoYDzIwNTAwOTA0MDAwMDAwWjAxMS8wLQYDVQQDDCZZdWJpY28gVTJGIEVFIFNlcmlhbCAyMzkyNTczNDEwMzI0MTA4NzBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABNNlqR5emeDVtDnA2a-7h_QFjkfdErFE7bFNKzP401wVE-QNefD5maviNnGVk4HJ3CsHhYuCrGNHYgTM9zTWriGjOzA5MCIGCSsGAQQBgsQKAgQVMS4zLjYuMS40LjEuNDE0ODIuMS41MBMGCysGAQQBguUcAgEBBAQDAgUgMA0GCSqGSIb3DQEBCwUAA4IBAQAiG5uzsnIk8T6-oyLwNR6vRklmo29yaYV8jiP55QW1UnXdTkEiPn8mEQkUac-Sn6UmPmzHdoGySG2q9B-xz6voVQjxP2dQ9sgbKd5gG15yCLv6ZHblZKkdfWSrUkrQTrtaziGLFSbxcfh83vUjmOhDLFC5vxV4GXq2674yq9F2kzg4nCS4yXrO4_G8YWR2yvQvE2ffKSjQJlXGO5080Ktptplv5XN4i5lS-AKrT5QRVbEJ3B4g7G0lQhdYV-6r4ZtHil8mF4YNMZ0-RaYPxAaYNWkFYdzOZCaIdQbXRZefgGfbMUiAC2gwWN7fiPHV9eu82NYypGU32OijG9BjhGt_MEUCIHDMSXhC5e3ulNXJpGmT8Zap_WEF3uNfAVdpZQm8qUyBAiEAzQOsWy29ZMoQoWFQ2S58XxlcGtxuVqzrUtDGnJe3W-c",
              version: "U2F_V2"
            };
            request.session = {};
          })
          .res(function(res) {
            response = res;
          })
          .end(function() {
            done();
          })
          .dispatch();
      });
      
      it('should parse media types', function() {
        expect(request.__.supportedMediaType).to.equal('application/json');
      });
      
      it('should register key', function() {
        expect(keys.create).to.have.been.calledOnceWith({
          id: 'Fzlj97MvsP1DQUiurb3M6xxtel_Hmt28dLdjAEHrqK6BqDhxzf2rqz6us5BrVt93mH1rTJlDOMrjS9hipb-Icw',
          pubkey: '-----BEGIN PUBLIC KEY-----\n' +
'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEAsD2ekNUetDdW9xYXUxcaazhWpRd\n' +
'/BT1MTEoWJaZhA6RcylftJyFTp/m0osJPwdtENB1HdTj4ba3ROyzoBAm5Q==\n' +
'-----END PUBLIC KEY-----\n'
        });
      });
      
    });
    
  });
  
});
