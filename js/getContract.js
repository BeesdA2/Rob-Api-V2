const { createAndSendRequest } = require("./handleApi.js");
const { deleteContractDb } = require("./handleContractDb.js");
const { writeContractDb } =  require("./handleContractDb.js");
 

// Ophalen parameters	

var guid  = process.argv[2];
var lib  = process.argv[3];
var filiaal    = process.argv[4];
var applicatie = process.argv[5];
var kenteken   = process.argv[6];
 

// Kenteken omzetten naar ROB formaat

	   
// Wegschrijven naar log 	
//console.log('guid: '  + guid ); 
//console.log('lib: '  + lib ); 
//console.log('filiaal: '    + filiaal   ); 
//console.log('applicatie: ' + applicatie ); 
//console.log('kenteken '   + kenteken ); 

async function startGetContractRob(guid, lib, filiaal, applicatie, kenteken) {
try{
	
	kenteken = kenteken.replace(/[^0-9, ^a-z, ^A-Z]/g, "").trim(); 
	
// Uitvoeren webservice Rob 
 const resp3 = await createAndSendRequest(guid, lib, filiaal, applicatie, kenteken, null);
 let result3 = await resp3;
 
 if (result3 != undefined){
 // oude entry verwijderen Contract
  const resp4   = await deleteContractDb(lib, kenteken);
  let result4 = await resp4;
 // Nieuwe entry aanmaken
  const resp5   = await writeContractDb(lib, kenteken, result3);
  let result5   = await resp5;
}

} catch (e) {
        console.error('startGetContractRob error: ' +e);
    } finally {
        console.log('Rob-Api cleanup');
		return ({ message: 'GetContract ROB succesvol uitgevoerd'});
    }
}

startGetContractRob(guid, lib, filiaal, applicatie, kenteken);



async function handleGetContract(guid, lib, filiaal, applicatie, kenteken)
{
    try{	
	 
	
	var resolve = await startGetContractRob(guid, lib, filiaal, applicatie, kenteken);
	return (resolve);
    }
	catch(err) {console.error('handleGetContract error: ' + err);}
	
}


module.exports = {
  handleGetContract: handleGetContract
  };  
