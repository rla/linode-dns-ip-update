var async = require('async');
var config = require('./config.json');
var linode = require('./lib/linode');

var ip, domainList, domainId, resourceList, resourceId;

async.series([

    function(cb) {
        
        // Retrieves the list of domains.
        
        linode.domainList(function(err, list) {
            
            domainList = list;
            
            cb(err);
        });        
    },
    
    function(cb) {
        
        // Finds the given domain id.
        
        domainList.forEach(function(domain) {
            
            if (domain.DOMAIN === config.linode.domain) {
                
                domainId = domain.DOMAINID;
            }
        });
        
        if (typeof domainId === 'undefined') {
            
            cb(new Error('Domain ' + name + ' not found.'));
            
        } else {
            
            cb();
        }
    },
    
    function(cb) {
        
        // Retrieves the list of resources on
        // the previously found domain.
        
        linode.resourceList(domainId, function(err, list) {
            
            resourceList = list;
            
            cb(err);
        });        
    },
    
    function(cb) {
        
        // Finds the resource id.
        
        resourceList.forEach(function(res) {
            
            if (res.NAME === config.linode.resource && res.TYPE.toUpperCase() === 'A') {
                
                resourceId = res.RESOURCEID;
            }                        
        });
        
        if (typeof resourceId === 'undefined') {
            
            cb(new Error('Resource ' + resourceName + ' not found.'));
            
        } else {
            
            cb();
        }        
    },
    
    function(cb) {
        
        // Updates resource with the request IP.
        
        linode.updateTarget(domainId, resourceId, '[remote_addr]', cb);
    }
    
], function(err) {
    
    if (err) {
        
        console.error(err);
        process.exit(1);
    }
});
