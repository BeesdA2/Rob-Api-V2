const { createAndSendRequest } = require("./handleApi.js");

const { deleteComponentsDb } = require("./handleComponentsDb.js");
const { deleteComponentsFueltypeDb } = require("./handleComponentsDb.js");
const { deleteComponentsLocationDb } = require("./handleComponentsDb.js");
const { deleteComponentsOperationDb } = require("./handleComponentsDb.js");
const { deleteComponentsObjecttypeDb } = require("./handleComponentsDb.js");

const { writeComponentDb } =  require("./handleComponentsDb.js");
const { writeComponentFueltypeDb } = require("./handleComponentsDb.js");
const { writeComponentObjecttypeDb } = require("./handleComponentsDb.js");
const { writeComponentLocationDb } = require("./handleComponentsDb.js");
const { writeComponentOperationDb } = require("./handleComponentsDb.js");

const fs = require('fs');  
 

// Ophalen parameters	
var guid  = process.argv[2];
var lib  = process.argv[3];
var filiaal    = process.argv[4];
var applicatie = process.argv[5];
 
	   
// Wegschrijven naar log 	
//console.log('guid: '  + guid ); 
//console.log('lib: '  + lib ); 
//console.log('filiaal: '    + filiaal   ); 
//console.log('applicatie: ' + applicatie ); 

async function startGetComponentsRob(guid, lib, filiaal, applicatie) {
try{
// Uitvoeren webservice Rob 
 const resp3 = await createAndSendRequest(guid, lib, filiaal, applicatie, null, null);
 let answer = await resp3;
 
 if (answer != undefined){
console.log("Received components....." + answer.components.length);
// Wegschrijven naar een text file
	//fs.writeFile('components.txt',  JSON.stringify(answer.components), function (err) {
   //  if (err) return console.log("Error: " +  err);
  //     console.log('Components > components.txt');
 //   });
 // oude entry verwijderen Contract
  const respcomp   = await deleteComponentsDb();
  const respcompdb   = await deleteComponentsOperationDb();
  const respcompgo  = await deleteComponentsObjecttypeDb();
  const respcomppa  = await deleteComponentsLocationDb();
  const respcompbc  = await deleteComponentsFueltypeDb();
  
 // Nieuwe entry aanmaken
  var nextelement;
 
 for (let i = 0; i < answer.components.length; i += 1) {
  // Activiteiten schrijven naar PROBACT
  if( (i + 1) === answer.components.length){
	nextelement = "";  
  }
  else
  {
	nextelement = answer.components[i+1].robCode  
  }
    
  
 if(answer.components[i].robCode.trim() !== nextelement.trim()){
	  
	 console.log("Element " + answer.components[i].robCode + " adding......" );
	  
	const respcomp2   = await writeComponentDb(answer.components[i]);
    // brandstof code schrijven naar PROBACTBC  
	if(answer.components[i].fuelTypes != undefined){
	for (let j = 0; j < answer.components[i].fuelTypes.length; j += 1) {    
	const respcompbc2   = await writeComponentFueltypeDb(answer.components[i].robCode, answer.components[i].fuelTypes[j]);
 	}
	}
	// object type  schrijven naar PROBACTGO  
	if(answer.components[i].objectTypes != undefined){
	for (let j = 0; j < answer.components[i].objectTypes.length; j += 1) {    
	const respcompgo2   = await writeComponentObjecttypeDb(answer.components[i].robCode, answer.components[i].objectTypes[j]);
	}
	}
	// plaataanduiding schrijven naar PROBACTPA  
	if(answer.components[i].locations != undefined){
	for (let j = 0; j < answer.components[i].locations.length; j += 1) {  
		var array = answer.components[i].locations[j];
		const respcomppa2   = await writeComponentLocationDb(answer.components[i].robCode, array);
	}
	}
   }
	// bewerking en reden schrijven naar PROBACTDB  
	for (let j = 0; j < answer.components[i].reasons.length; j += 1) {  
			const respcompdb2   = await writeComponentOperationDb(answer.components[i].robCode, answer.components[i].operation.code, answer.components[i].reasons[j]);
	}
 }
}
} catch (e) {
        console.error('startGetComponentsRob error: '+ e);
    } finally {
        console.log('Rob-Api cleanup');
		return ({ message: 'GetComponents ROB succesvol uitgevoerd'});
    }
}
startGetComponentsRob(guid, lib, filiaal, applicatie);

async function handleGetComponents(guid, lib, filiaal, applicatie)
{
    try{	
	 
	
	var resolve = await startGetComponentsRob(guid, lib, filiaal, applicatie);
	return (resolve);
    }
	catch(err) {console.error('handleGetComponents error: ' +err);}
	
}


module.exports = {
  handleGetComponents: handleGetComponents
  };  

