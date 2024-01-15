const { createAndSendRequest } = require("./handleApi.js");

const { updateServiceRequestHeaderDb } = require("./handleServiceRequestDb.js");
const { updateServiceRequestLinesDb } = require("./handleServiceRequestDb.js");

const { updateReliefVehicleStatusDb } = require("./handleReliefVehicleRequestDb.js");
 


// Ophalen parameters	
var guid = process.argv[2];
var lib = process.argv[3];
var filiaal = process.argv[4];
var applicatie = process.argv[5];
var guid_opdracht = process.argv[6];
 

	   
async function startStatusServiceRequestRob(guid, lib, filiaal, applicatie, guid_opdracht) {   
try{
// Uitvoeren webservice Rob 
 const respWebservice = await createAndSendRequest(guid, lib, filiaal, applicatie, guid_opdracht, null);
 
 let resultWebservice = await respWebservice;
  
  //console.log("antwoord Json: " + JSON.stringify(resultWebservice)); 
  
 // Update order informatie
  if (resultWebservice != undefined){
  if (applicatie == "ROB_API_STATUS_RENTAL_V2") {
  const respReliefReply  = await updateReliefVehicleStatusDb(lib, filiaal, resultWebservice.data.id, resultWebservice); 	  
  }	  
  else
  {
  const respHeaderReply  = await updateServiceRequestHeaderDb(lib, filiaal, resultWebservice.data.appointment.workOrderNumber, resultWebservice);
  const respLinesReply  = await updateServiceRequestLinesDb(lib, filiaal, resultWebservice.data.appointment.workOrderNumber, resultWebservice);
  }
  }	
  } catch (e) {
        console.error('startStatusServiceRequestRob error: ' +e);
    } finally {
        console.log('Rob-Api cleanup');
		return ({ message: 'StatusServiceRequest ROB succesvol uitgevoerd'});
    }
}

startStatusServiceRequestRob(guid, lib, filiaal, applicatie, guid_opdracht);

async function handleStatusServiceRequest(guid, lib, filiaal, applicatie, guid_opdracht)
{
    try{	
	 
	
	var resolve = await startStatusServiceRequestRob(guid, lib, filiaal, applicatie, guid_opdracht);
	return (resolve);
    }
	catch(err) {console.error('handleStatusServiceRequest error: ' +err);}
	
}


module.exports = {
  handleStatusServiceRequest: handleStatusServiceRequest
  };  

