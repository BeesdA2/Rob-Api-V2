const { createAndSendRequest } = require("./handleApi.js");
const { deleteTiresDb } = require("./handleTiresDb.js");
const { writeTiresDb } =  require("./handleTiresDb.js");
const { deleteTireMakesDb } = require("./handleTiresDb.js");
const { writeTireMakesDb } =  require("./handleTiresDb.js");
const { getBrancheDetails } = require("./getBrancheDetails.js");
 


// Ophalen parameters	
var guid = process.argv[2];
var lib  = process.argv[3];
var filiaal    = process.argv[4];
var applicatie = process.argv[5];
var kenteken = process.argv[6];
var selectie = process.argv[7];
  
selectie = decodeURIComponent(selectie);
	   
// Wegschrijven naar log 	
//console.log('guid: '  + guid ); 
//console.log('lib: '  + lib ); 
//console.log('filiaal: '    + filiaal   ); 
//console.log('applicatie: ' + applicatie ); 
//console.log('kenteken: ' + kenteken ); 
//console.log('selectie: ' + selectie ); 

async function startGetTiresRob(guid, lib, filiaal, applicatie, kenteken, selectie) {
try{
   // Ophalen gegevens Filiaal
  const respFiliaal  = await getBrancheDetails(lib, filiaal);	
  
// Uitvoeren webservice Rob 
 const respTires = await createAndSendRequest(guid, lib, filiaal, applicatie, selectie, null);
 let resultTires = await respTires;

 if (resultTires.tires != undefined){	 
 // oude entry verwijderen Banden
  const respdb   = await deleteTiresDb(lib, kenteken, respFiliaal[0].FIRDCN);
  let resultdb = await respdb;
 // Nieuwe entry aanmaken
  const respdb2   = await writeTiresDb(lib, kenteken, respFiliaal[0].FIRDCN, resultTires)
}
if (resultTires.makes != undefined){	 
 // oude entry verwijderen Bandmerkcodes
  const respmakesdb   = await deleteTireMakesDb();
  let resulmakesdb = await respmakesdb;
 // Nieuwe entry aanmaken
  const respmakesdb2   = await writeTireMakesDb(resultTires)
}
} catch (e) {
        console.error('startGetTiresRob: error: ' + e);
    } finally {
        console.log('Rob-Api cleanup');
		return ({ message: 'GetTiresROB  succesvol uitgevoerd'});
    }
}

startGetTiresRob(guid, lib, filiaal, applicatie, kenteken, selectie);


async function handleGetTires(guid, lib, filiaal, applicatie, kenteken, selectie)
{
	selectie = decodeURIComponent(selectie);
	 
    console.log('selectie: ' + selectie ); 
	 	
    try{	
	 
	
	var resolve = await startGetTiresRob(guid, lib, filiaal, applicatie, kenteken, selectie);
	return (resolve);
    }
	catch(err) {console.error('handleGetTires error: ' + err);}
	
}


module.exports = {
  handleGetTires: handleGetTires
  };  

