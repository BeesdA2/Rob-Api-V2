const { getRobInterfaceDetails } = require("./getRobInterfaceDetails.js");
const { writeErrorLog } = require("./writeErrorLog.js");
const { updateServiceRequestLogResponse } = require("./handleServiceRequestDb.js"); 

const axios = require('axios');
const qs = require('qs');
//const fs = require('fs');
 
async function createAndSendRequest (guid, lib, filiaal, applicatie, urlParameters, body) {
   
    // Ophalen gegevens Apitoken
  const respapi    = await getRobInterfaceDetails2(lib, filiaal, 'ROB_API', 'ApiKeyHeader');
  // Ophalen gegevens Endpoint
  console.log("Applicatie : " + applicatie );
  const resprob   = await getRobInterfaceDetails(lib, null, applicatie, 'URL');
 
 // wacht op antwoord functies
 let resultapi = await respapi;
 let resultrob = await resprob;

// Informatie voor bericht Rob samenstellen 
let apiToken   = resultapi[0].OAKEYV.trim();	
let robUrl     = resultrob[0].APKEYV.trim();
let httpMethod = resultrob[0].APEXTR.trim(); 
   
	try {
		if(urlParameters === null){
		var url = robUrl.trim();
		}
		else
		{
        // set the url
        var url = robUrl.trim() + '/' + urlParameters.trim();
		console.log("Url: " + url)
		};	
	    // set the headers
        const config = {
			method: '' + httpMethod ,
			url:  '' +  url , 
            headers: {
                'Authorization': 'bearer ' + apiToken ,
				'Content-Type' : 'application/json'
            },
			data: body
			
        };
		//console.log('config: '+ qs.stringify(config));
    // aanroep webservice
	const res =  await axios.request(config);
    //console.log('res data: ' + JSON.stringify(res.data));
	// antwoord webservice teruggeven
  return res.data;
    } catch (err) {
		if(urlParameters === null){
		const respsres   = await updateServiceRequestLogResponse(guid, lib, JSON.stringify(err.response.data));
 		//console.log("error: " +  JSON.stringify(err.response.data));	
        let resullog = await writeErrorLog(guid, lib, filiaal, applicatie, "", err.response);	
	    }
		else
		{	
		const respsres2   = await updateServiceRequestLogResponse(guid, lib, JSON.stringify(err.response.data));
		
 	    let resullog = await writeErrorLog(guid, lib, filiaal, applicatie, urlParameters, err.response);
	  	}
		}
};

module.exports = {
  createAndSendRequest: createAndSendRequest
  };