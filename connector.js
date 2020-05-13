
const request = require('request'); 
const validResponseRegex = /(2\d\d)/; 

class ServiceNowConnector { 

  constructor(options) { 
  this.options = options; 
} 
 constructUri(serviceNowTable, query = null) { 
let uri = `/api/now/table/${serviceNowTable}`; 
  if (query) { 
 uri = uri + '?' + query; 
} 
  return uri; 
} 

isHibernating(response) { 
return response.body.includes('Instance Hibernating page') 
 && response.body.includes('<html>') 
 && response.statusCode === 200; 
} 

processRequestResults(error, response, body, callback) { 

let callbackData = null; 
let callbackError = null; 
if (error) { 
      console.error('Error present.'); 
callbackError = error; 
} else if (!validResponseRegex.test(response.statusCode)) { 
 console.error('Bad response code.'); 
callbackError = response; 
} else if (response.body.includes('Instance Hibernating page')) { 
callbackError = 'Service Now instance is hibernating'; 
console.error(callbackError); 
} else { 
callbackData = response; 
} 
 return callback(callbackData, callbackError); 
}
sendRequest(callOptions, callback) { 

let uri; 
 if (callOptions.query) 
 uri = this.constructUri(callOptions.serviceNowTable, callOptions.query); 
else 
 uri = this.constructUri(callOptions.serviceNowTable); 
const requestOptions = { 
 method: callOptions.method, 
auth: { 
 user: this.options.username, 
  pass: this.options.password, 
  }, 
baseUrl: this.options.url, 
 //uri: `/api/now/table/${callOptions.serviceNowTable}?sysparm_limit=1`, 
    uri:uri 
}; 
console.log(uri) 
 request(requestOptions, (error, response, body) => { 
 this.processRequestResults(error, response, body, (processedResults, processedError) => callback(processedResults, processedError)); 
}); 
} 
get(callback) { 
let getCallOptions = this.options; 
     getCallOptions.method = 'GET'; 
getCallOptions.query = 'sysparm_limit=1'; 
 this.sendRequest(getCallOptions, callback) 
} 

post( callback) { 
 let callOptions = this.options; 
callOptions.method = 'POST'; 
this.sendRequest(callOptions, callback); 
} 
} 
module.exports = ServiceNowConnector; 