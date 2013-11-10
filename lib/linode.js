var async = require('async');
var request = require('request');
var config = require('../config.json');

var baseUrl = 'https://api.linode.com/?api_key=' + config.linode.key +
    '&api_responseFormat=json';

// Helper to run HTTP requests, check status code
// and parse JSON response.

function executeRequest(url, cb) {
    
    request(url, function(err, response, body) {
        
        if (err) {
            
            cb(err);
            
        } else if (response.statusCode === 200) {
            
            cb(null, JSON.parse(body));
            
        } else {
            
            cb(new Error('Status code ' + response.statusCode));
        }
    });
}

// Retrieves the list of domain.

exports.domainList = function(cb) {
    
    var url = baseUrl + '&api_action=domain.list';
    
    async.waterfall([
    
        async.apply(executeRequest, url),
    
        function(result, cb) {
            
            cb(null, result.DATA);
        }
        
    ], cb);
};

// Retrieves the list of resources (entries)
// for a given domain.

exports.resourceList = function(domainId, cb) {
    
    var url = baseUrl + '&api_action=domain.resource.list&domainID=' + domainId;
    
    async.waterfall([
    
        async.apply(executeRequest, url),
    
        function(result, cb) {
            
            cb(null, result.DATA);
        }
        
    ], cb);
};

// Updates resource Target.
// For more info, see: https://www.linode.com/api/dns/domain.resource.update

exports.updateTarget = function(domainId, resourceId, target, cb) {
    
    var url = baseUrl + '&api_action=domain.resource.update&domainID=' + domainId +
        '&resourceId=' + resourceId + '&target=' + target;
        
    executeRequest(url, cb);
}
