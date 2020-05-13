
// Import built-in Node.js package path. 


 

const path = require('path'); 

const ServiceNowConnector = require(path.join(__dirname, '/connector.js')); 

const EventEmitter = require('events').EventEmitter; 

class ServiceNowAdapter extends EventEmitter { 
constructor(id, adapterProperties) { 

super(); 
this.id = id; 
this.props = adapterProperties; 
 this.connector = new ServiceNowConnector({ 
 url: this.props.url, 
 username: this.props.auth.username, 
 password: this.props.auth.password, 
 serviceNowTable: this.props.serviceNowTable 
}); 

} 

  connect() { 

    this.healthcheck(); 
} 

healthcheck(callback) { 

this.getRecord((result, error) => { 

   if (error) { 

      log.error(`External system ${this.id} is temporarily down for maintenance`); 
     this.emitOffline() 
   }  

   else { 
log.debug("Calling ServiceNowAdaptor system's method healthcheck().") 
console.log("I am inside else block ...................") 
this.emitOnline() 
 } 
}); 
this.postRecord((result, error) => { 
     if (error) { 
  log.error(`External system ${this.id} is temporarily down for maintenance`); 
this.emitOffline() ;
if(callback){ 
 callback(error) 
          } 
}  
 else { 
log.debug("Calling ServiceNowAdaptor system's method healthcheck().") 
this.emitOnline() 
if(callback){ 
 callback(result) 
  } } 
 });
} 
emitOffline() { 
      this.emitStatus('OFFLINE'); 
  log.warn('ServiceNow: Instance is unavailable.'); 
     } 

  emitOnline() { 
      this.emitStatus('ONLINE'); 
 log.info('ServiceNow: Instance is available.'); 
} 
  emitStatus(status) { 
this.emit(status, { id: this.id }); 
  } 
  getRecord(callback) { 
this.connector.get( (data, error) => { 
 var changeTicket={} 
 var ArrayObj = [] 
for(var key in data) { 
if(key === "body") { 
 var obj= data[key]; 
     var obj2=JSON.parse(obj); 
    var obj3=obj2.result; 
    console.log("the value inside post.................",obj3) 
    for(let i=0; i<obj3.length;i++) { 
changeTicket ={ 
 "change_ticket_number":obj3[i].number, 
"active":obj3[i].active, 
  "priority":obj3[i].priority, 
 "description":obj3[i].description, 
"work_start":obj3[i].work_start, 
 "work_end":obj3[i].work_end, 
 "change_ticket_key":obj3[i].sys_id 
} 
 ArrayObj.push(changeTicket); 
  } 
}}  
console.log("the value is:.....",ArrayObj) 
data=ArrayObj 
callback(data,error) 
 }); 
 } 
 postRecord(callback) { 
this.connector.post( (data, error) => { 
var newChangeTicket={} 
for(var key in data) 
{ 
 if(key === "body") 
{ 
 var obj= data[key]; 
      var obj2=JSON.parse(obj); 
 var obj3=obj2.result; 
 console.log("the value inside post.................",obj3) 
newChangeTicket ={ 
 "change_ticket_number":obj3.number, 
      "active":obj3.active, 
"priority":obj3.priority, 
      "description":obj3.description, 
"work_start":obj3.work_start, 
 "work_end":obj3.work_end, 
"change_ticket_key":obj3.sys_id 
} 
}}  
data=newChangeTicket; 
//data["body"]["result"]= returnVar 
callback(data,error) 
 }); 
} 
  } 
module.exports = ServiceNowAdapter;


