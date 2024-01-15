const { createAndSendRequest } = require("./handleApi.js");
 

// Ophalen parameters	
var guid = process.argv[2];
var lib = process.argv[3];
var filiaal = process.argv[4];
var applicatie = process.argv[5];
var guid_opdracht = process.argv[6];
var guid_line = process.argv[7];
 
	   
// Wegschrijven naar log 	
//console.log('guid: '  + guid ); 
//console.log('bibliotheek: '  + lib ); 
//console.log('filiaal: '    + filiaal   ); 
//console.log('applicatie: ' + applicatie ); 
//console.log('guid_request: '   + guid_opdracht ); 
//console.log('guid_line: '   + guid_line ); 

async function startCancelServiceRequestLineRob(guid, lib, filiaal, applicatie, guid_opdracht, guid_line) {   
try{
//Samenstellen cancelrequest
var cancelrequest = '/' + guid_opdracht.trim() + '/components/' + guid_line.trim() + '/cancel';
// Uitvoeren webservice Rob 
 const respWebservice = await createAndSendRequest(guid, lib, filiaal, applicatie, cancelrequest, null);
 
 let resultWebservice = await respWebservice;
 
 console.log("antwoord cancel request Json: " + JSON.stringify(resultWebservice)); 
 
} catch (e) {
        console.error('startCancelServiceRequestLineRob error: ' +e);
    } finally {
        console.log('Rob-Api cleanup');
		return ({ message: 'CancelServiceRequest ROB succesvol uitgevoerd'});
    }
}

startCancelServiceRequestLineRob(guid, lib, filiaal, applicatie, guid_opdracht, guid_line);

async function handleCancelServiceRequestLine(guid, lib, filiaal, applicatie, guid_opdracht, guid_line)
{
    try{	
	 
	
	var resolve = await startCancelServiceRequestLineRob(guid, lib, filiaal, applicatie, guid_opdracht, guid_line);
	return (resolve);
    }
	catch(err) { console.error('handleCancelServiceRequestLine error: ' + err);}
	
}


module.exports = {
  handleCancelServiceRequestLine: handleCancelServiceRequestLine
  };  
