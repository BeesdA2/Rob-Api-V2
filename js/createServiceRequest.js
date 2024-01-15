const { createAndSendRequest } = require("./handleApi.js");

const { getServiceRequestHeaderDb } = require("./handleServiceRequestDb.js");
const { getServiceRequestLinesDb } = require("./handleServiceRequestDb.js");
const { getBrancheDetails } = require("./getBrancheDetails.js");
const { getOrderDetails } = require("./getOrderDetails.js");
const { getCarDetails } = require("./getCarDetails.js");

const { updateServiceRequestHeaderDb } = require("./handleServiceRequestDb.js");
const { updateServiceRequestLinesDb } = require("./handleServiceRequestDb.js");
const { updateServiceRequestLogRequest } = require("./handleServiceRequestDb.js"); 
const { updateServiceRequestLogResponse } = require("./handleServiceRequestDb.js"); 

const { getSwapTireDb } = require("./handleTiresDb.js"); 	
const { getSeasonTireDb } = require("./handleTiresDb.js"); 	
const { getRepairTireDb } = require("./handleTiresDb.js"); 	
const { getUnmountedTireDb } = require("./handleTiresDb.js"); 	
const { getMountedTireDb } = require("./handleTiresDb.js"); 

  	

//const fs = require('fs');  
// Ophalen parameters	

//var guid = process.argv[2];
//var lib = process.argv[3];
//var filiaal = process.argv[4];
//var applicatie = process.argv[5];
//var werkorder = process.argv[6];
var parent_activiteit = 0; 
var parent_bewerking = ""; 


// Wegschrijven naar log 	
//console.log('guid: '  + guid ); 
//console.log('bibliotheek: '  + lib ); 
//console.log('filiaal: '    + filiaal   ); 
//console.log('applicatie: ' + applicatie ); 
//console.log('werkorder: '   + werkorder ); 

async function startCreateServiceRequestRob(guid, lib, filiaal, applicatie, werkorder) {   
try{
 
 
//-----------------------------------------------------------
// Data iDAS  
//-----------------------------------------------------------
  // Ophalen gegevens Filiaal
  const respFiliaal  = await getBrancheDetails(lib, filiaal);
  let   resultFiliaal  = await respFiliaal;
  
      // Ophalen gegevens Order
  const respOrder    = await getOrderDetails(lib, filiaal, werkorder);	
  let   resultOrder  = await respOrder;
  
   // Ophalen gegevens Kenteken
  const respCar    = await getCarDetails(lib, respOrder[0].OHREGN);	
  let   resultCar  = await respCar;
     // Ophalen gegevens ServiceRequest	
  const respHeader   = await getServiceRequestHeaderDb(lib, filiaal, werkorder);
  let   resultHeader = await respHeader;  
     // Ophalen gegevens ServiceRequestLines	
  	 
  const respLines    = await getServiceRequestLinesDb(lib, filiaal, werkorder, parent_activiteit, parent_bewerking, "", "");
  let   resultLines  = await respLines;  
 
//-----------------------------------------------------------
// ROB werkopdracht 
//-----------------------------------------------------------
let body = new Object();

// --- Header ----- 
body.status =  "ApprovalRequested";
//body.status =  "Draft";

let remarks = new Object();
if (respHeader[0].WOFREE !== "") {
remarks.supplier = respHeader[0].WOFREE.trim();
body.remarks = remarks;
}

let vehicle = new Object();
vehicle.licensePlate = respOrder[0].OHREGN.replace(/[^0-9, ^a-z, ^A-Z]/g, "").trim();   
vehicle.licensePlate = vehicle.licensePlate.replace(/ /g, "") ; 
vehicle.partialVin = respOrder[0].OHCHNO.substr(respOrder[0].OHCHNO.length - 4); 
body.vehicle = vehicle;
let appointment = new Object();
appointment.workshopDate = respHeader[0].WOREPDT;
appointment.workOrderNumber =  werkorder;

let contact = new Object();
contact.name  = respHeader[0].WOCPER.trim(); 
contact.phone = respHeader[0].WOTELN.trim();
appointment.contact = contact; 

appointment.estimatedDurationInDays = Number(respHeader[0].WOREPD);
body.appointment = appointment; 


components = [];
//-----------------------------------------------------------
// ROB activiteiten
//-----------------------------------------------------------
for (let i = 0; i < respLines.length; i += 1) {
		// Array vullen met elementen
	let line = respLines[i];	

// VST's met dezelfde activiteit totaliseren en als 1 activiteit versturen
var index = components.findIndex(obj => obj.rob.code ==line.ACACT);
	if(index !== -1){
	components[index].price = components[index].price + Number(line.ACBEDRA);	
	 
	console.log("price: " + components[index].price );
	 
	}
	else
	{
	components.push(await fillComponent(lib, filiaal, werkorder, line ));
	}
}

	body.components = components;

	// Wegschrijven naar een text file
	//fs.writeFile('serviceRequest.txt',  JSON.stringify(body), function (err) {
    // if (err) return console.log(err);
    //   console.log('ServiceRequest > serviceRequest.txt');
    //});
	 
	console.log("Json: " + JSON.stringify(body));
	 

// Uitvoeren webservice Rob 
// Opmerking: alleen bij een Update GUID van de werkorder meesturen
const respWebservice = await createAndSendRequest(guid, lib, filiaal, applicatie, (applicatie == "ROB_API_SERVICE" ?null:respHeader[0].WOGUID.trim()), body);
 
 let resultWebservice = await respWebservice;
console.log("antwoord Json: " + JSON.stringify(resultWebservice)); 
const respsreq   = await updateServiceRequestLogRequest(guid, lib, JSON.stringify(body));
 

 // Update order informatie
  if (resultWebservice != undefined){
  const respsres   = await updateServiceRequestLogResponse(guid, lib, JSON.stringify(resultWebservice));
  const respHeaderReply  = await updateServiceRequestHeaderDb(lib, filiaal, werkorder, resultWebservice);
  const respLinesReply  = await updateServiceRequestLinesDb(lib, filiaal, werkorder, resultWebservice);
  }
 
  } catch (e) {
        console.error('startCreateServiceRequestRob error: ' + e);
    } finally {
        console.log('Rob-Api cleanup');
		return ({ message: 'CreatServiceRequest ROB succesvol uitgevoerd'});
    }
}

//-----------------------------------------------------------
// samenstellen component
//-----------------------------------------------------------
async function fillComponent(lib, filiaal, werkorder,line) { 

        let component = new Object();
		
		 component.id = line.ACGUID;
		
        let rob = new Object();
		
		//Activiteit
       	rob.code = line.ACACT.padStart(4,'0');
		component.rob = rob;
		
	  if (!(line.ACACT >= 3150 && line.ACACT <= 3161)) {
		//Componenten
		let subcomponents = [];
		
		// Onderliggende activiteiten banden ophalen 
		let subLines    = await getServiceRequestLinesDb(lib, filiaal, werkorder, line.ACACT, line.ACBEW, line.ACPA1.trim(), line.ACPA2.trim());
		for (let j = 0; j < subLines.length; j += 1) {
		let subcomponent = new Object();
		subcomponent = 	await fillComponent(lib, filiaal, werkorder,subLines[j]);
	
		subcomponents.push(subcomponent);	
		}
		component.subcomponents = subcomponents;
	 
		//SupplierCode (BackofficeActiviteitId)		
		if(line.ACBOAI !== null && line.ACBOAI.trim() !== "") {	
		component.supplierCode = line.ACBOAI.trim();
		}	 
	 
		//Bewerking		
		let operation = new Object();
        operation.code = line.ACBEW;
	    if(line.ACTYPE !== null && line.ACTYPE.trim() !== "") {	
		let type = new Object();
		type.code = line.ACTYPE;
		operation.type = type;
		}
		else{
		operation.type = null;	
		}
		component.operation = operation;
	  }
		//Reden
		//if(line.ACDCD !== null && line.ACDCD.trim() !== "99" ) {
		if (line.ACPRTA == 0 || line.ACDCD !== '99' ){	
		let reason = new Object();
        reason.code = line.ACDCD;
		component.reason = reason;
		}
		//Bij repareren band bij code repareren wel reasoncode opnemen
		if (line.ACACT == 3101 && line.ACBEW == '03' && line.ACHFDA == 3197 ){	
		let reason = new Object();
        reason.code = line.ACDCD;
		component.reason = reason;
		}
		//}
		
		//Bedrag
		if(line.ACBEDRA !== null && line.ACBEDRA.trim() !== "0" && line.ACBEDRA.trim() !== ".00") {	
		//console.log("Bedrag: " + line.ACBEDRA);
		component.price = Number(line.ACBEDRA);
		}
				
		//Waarde
		if(line.ACKMNW !== null && line.ACKMNW.trim() !== "" && line.ACKMNW.trim() !== "0") {
		if(line.ACBEW == "08"){
		component.value = (line.ACKMNW/10).toString();
		}
	    else 
		{
		component.value = line.ACKMNW;
		}
		}	
		
		// Aantal onderdelen
		if (line.ACAANT != 0){
		component.partCount = line.ACAANT;	
		} 
		
		// Garantie, Coulance, Schade
		 //0      N.V.T.                  
         //1      Schade                  
         //2      Garantie                
         //3      Garantie afgewezen      
         //4      Coulance aangevraagd    
         //5      Coulance afgewikkeld    
		if (line.ACGCT.trim() == "1"){
		component.damage = true;	
		} 
		if (line.ACGCT.trim() == "2"){
		component.warranty = "Full";
		// Bij garantie bedrag 0 wel meegeven.
		if(line.ACBEDRA.trim() !== "0" || line.ACBEDRA.trim() !== ".00"){
		component.price = 0;
		}
		}
		if (line.ACGCT.trim() == "3"){
		component.leniency = "Denied";	
		}
		if (line.ACGCT.trim() == "4"){
		component.leniency = "Requested";	
		}
		if (line.ACGCT.trim() == "5"){
		component.leniency = "Approved";	
		}
		
		
		//Locatie
		var loc1 = line.ACPA1;
		var loc2 = line.ACPA2;
		// Plaatsaanduiding leegmaken voor bandgerelateerde subactiviteiten.
		if (line.ACHFDA == "3197" || line.ACHFDA == "3198" || line.ACHFDA == "3199"){
		if(!(line.ACACT == 3102 && line.ACBEW == "03") && line.ACPRTB !== "00" && line.ACBEW !== "11") {
		loc1 = "";
		loc2 = "";
		}	
		}
		
		if(loc1 !== null && loc1.trim() !== "") {
		if (loc1.trim() == "0"){
		loc1 = "";
		loc2 = "";
		}
		let location = [loc1, loc2];
		component.location = location;
		}		
		
		let part = new Object();
		part.partType = "Tire";
		// Bij profieldiepte ook bandId meegeven als onderdeel
		if(line.ACACT == 3101 && line.ACBEW == "08") {
		if (line.ACPRTB == "12") {
		 let unmountedTire    	= await getUnmountedTireDb(lib, filiaal, werkorder, line.ACPA1, line.ACPA2);
		 if(unmountedTire[0].BDBDID !== "0"){
		 part.id = unmountedTire[0].BDBDID;	 
		 component.part = part;
		 }
		}
		else
		{	
		if(line.ACHFDA == "3198" && line.ACPRTB !== "00"){
		let swapTire    	= await getSwapTireDb(lib, filiaal, werkorder, line.ACPA1, line.ACPA2);	
		if(swapTire[0].BABDID !== "0"){
		 part.id = swapTire[0].BABDID;	 
		 component.part = part;
		}
		}
		// Band id meesturen bij bandenwissel. Niet bij afvoeren(17) en niet bij opslaan band(05)
		if(line.ACHFDA == "3199" && line.ACPRTB !== '17'){
		let seasonTire    	= await getSeasonTireDb(lib, filiaal, werkorder, line.ACPA1, line.ACPA2);	
		if(seasonTire[0].BABDID !== "0"){
		 part.id = seasonTire[0].BABDID;	 
		 component.part = part;
		}
		}
		
		if(line.ACHFDA == "3197"){
		let repairTire    	= await getRepairTireDb(lib, filiaal, werkorder, line.ACPA1, line.ACPA2);
		if(repairTire[0].BABDID !== "0"){
		// Is niet duidelijk, in welke situatie dit meegestuurd dient te worden. Voorlopig daarom commentaar gemaakt 	
		//component.part = fillPart(repairTire[0].BABDID);
		}
		}
		
		}
		}
	
		return	component;		
}

//startCreateServiceRequestRob(guid, lib, filiaal, applicatie, werkorder);

 



async function handleCreateServiceRequest(guid, lib, filiaal, applicatie, werkorder)
{
    try{	
	 
	
	var resolve = await startCreateServiceRequestRob(guid, lib, filiaal, applicatie, werkorder);
	return (resolve);
    }
	catch(err) {console.error('handleCreateServiceRequest error: ' + err);}
	
}


module.exports = {
  handleCreateServiceRequest: handleCreateServiceRequest
  };  

