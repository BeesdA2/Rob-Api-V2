const { createAndSendRequest } = require("./handleApi.js");
const { deleteLessorsDb } = require("./handleLessorsDb.js");
const { writeLessorsDb } =  require("./handleLessorsDb.js");

// Ophalen parameters	

var guid  = process.argv[2];
var lib  = process.argv[3];
var filiaal    = process.argv[4];
var applicatie = process.argv[5];
	   
// Wegschrijven naar log 	
console.log('guid: '  + guid ); 
console.log('lib: '  + lib ); 

console.log('filiaal: '    + filiaal   ); 
console.log('applicatie: ' + applicatie ); 

async function getLessorsRob(guid, lib, filiaal, applicatie) {

// Uitvoeren webservice Rob 
 const respLessors = await createAndSendRequest(guid, lib, filiaal, applicatie, null, null);
 let resultLessors = await respLessors;
 for (let i = 0; i < resultLessors.lessors.length; i += 1) {    	
	// Array vullen met elementen
}
 if (resultLessors != undefined){
 // oude entry verwijderen Lessors
  const resp4   = await deleteLessorsDb(lib);
  let result4 = await resp4;
 // Nieuwe entry aanmaken
  const resp5   = await writeLessorsDb(lib, resultLessors)
}
}

getLessorsRob(guid, lib, filiaal, applicatie);
