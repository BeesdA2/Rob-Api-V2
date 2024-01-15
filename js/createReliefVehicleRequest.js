const { createAndSendRequest } = require("./handleApi.js");

const { getReliefVehicleRequestDb } = require("./handleReliefVehicleRequestDb.js");
const { getBrancheDetails } = require("./getBrancheDetails.js");
const { getCarDetails } = require("./getCarDetails.js");
const { getRentalCarDetails } = require("./getRentalCarDetails.js");
const { getRentalorderDetails } = require("./getRentalorderDetails.js");


const { updateReliefVehicleRequestDb } = require("./handleReliefVehicleRequestDb.js");
const { updateReliefVehicleRequestLogRequest } = require("./handleReliefVehicleRequestDb.js"); 
const { updateReliefVehicleRequestLogResponse } = require("./handleReliefVehicleRequestDb.js");
  

const crypto = require('crypto');

var parent_activiteit = 0; 
var parent_bewerking = ""; 
 
async function startCreateReliefVehicleRequestRob(guid, lib, filiaal, applicatie, verhuurorder) {   
try{
 
 
//-----------------------------------------------------------
// Data iDAS  
//-----------------------------------------------------------
  // Ophalen gegevens Filiaal
  const respFiliaal  = await getBrancheDetails(lib, filiaal);
  let   resultFiliaal  = await respFiliaal;
 
 // Ophalen gegevens Verhuurorder
  const respVerhuurorder  = await getRentalorderDetails(lib, filiaal, verhuurorder);
  let   resultVerhuurorder  = await respVerhuurorder;
 
 // Ophalen gegevens ReliefVehicleRequest
  const respReliefVehicleRequest   = await getReliefVehicleRequestDb(lib, filiaal, verhuurorder);
  let   resultReliefVehicleRequest = await respReliefVehicleRequest;   
  
   // Ophalen gegevens Kenteken
  const respCar    = await getCarDetails(lib, respVerhuurorder[0].VKVVKT.trim());	
  let   resultCar  = await respCar;
 
   // Ophalen gegevens Huurauto 
  const respRentalCar    = await getRentalCarDetails(lib, filiaal, respReliefVehicleRequest[0].VVVREGN.trim());	
  let   resultRentalCar  = await respRentalCar;
 

//-----------------------------------------------------------
// ROB werkopdracht 
//-----------------------------------------------------------
let body = new Object();

// --- Header ----- 
body.status =  "ApprovalRequested";
//body.status =  "Draft";

let remarks = new Object();
if (respReliefVehicleRequest[0].VVFREE !== "") {
remarks.supplier = respReliefVehicleRequest[0].VVFREE.trim();
body.remarks = remarks;
}

let vehicle = new Object();
vehicle.licensePlate = respCar[0].BREGNO.replace(/[^0-9, ^a-z, ^A-Z]/g, "").trim();   
vehicle.licensePlate = vehicle.licensePlate.replace(/ /g, "") ; 
vehicle.partialVin = respCar[0].BCHANO.substr(respCar[0].BCHANO.length - 4); 
body.vehicle = vehicle;

// appointment 
let appointment = new Object();
appointment.checkoutDate = respReliefVehicleRequest[0].VVINZDT;
//appointment.supplierNumber =  respReliefVehicleRequest[0].VVOFNR;
appointment.workOrderNumber = respReliefVehicleRequest[0].VVWONR;
 
let contact = new Object();
contact.name  = respReliefVehicleRequest[0].VVCPERL.trim();
contact.phone = respReliefVehicleRequest[0].VVTELN;

appointment.contact = contact; 

body.appointment = appointment; 


components = [];

	//id = respReliefVehicleRequest[0].VVCOID.trim();
	id = guid;
	code = '9101';
	
	   if (respReliefVehicleRequest[0].VVINZRS.trim() == 'VV1') {
		 	reason = '34';	//reparatie en onderhoud   
		   }
		   else
		   {
			reason = '35'; //schade
		   } 
	
	components.push(await fillComponent(lib, filiaal, verhuurorder, code, id, reason, respReliefVehicleRequest, respRentalCar  ));
	
	body.components = components;
   
	 console.log("Json: " + JSON.stringify(body));
	 

// Uitvoeren webservice Rob 
// Opmerking: alleen bij een Update GUID van de verhuurorder meesturen
const respWebservice = await createAndSendRequest(guid, lib, filiaal, applicatie, (applicatie == "ROB_API_RELIEFVEHICLE" ?null:respReliefVehicleRequest[0].VVCOID.trim()), body);
 
let resultWebservice = await respWebservice;

console.log("antwoord Json: " + JSON.stringify(resultWebservice)); 

const respsreq   = await updateReliefVehicleRequestLogRequest(guid, lib, JSON.stringify(body));
 

 // Update order informatie
  if (resultWebservice != undefined){
  const respsres   = await updateReliefVehicleRequestLogResponse(guid, lib, JSON.stringify(resultWebservice));
  const respHeaderReply  = await updateReliefVehicleRequestDb(lib, filiaal, verhuurorder, resultWebservice);
  }
 
  } catch (e) {
        console.error('startCreateReliefVehicleRequestRob error: ' +e);
    } finally {
        console.log('Rob-Api cleanup');
		return ({ message: 'CreatReliefVehicleRequest ROB succesvol uitgevoerd'});
    }
}

//-----------------------------------------------------------
// samenstellen component
//-----------------------------------------------------------
async function fillComponent(lib, filiaal, verhuurorder,code, id, reasoncode, respReliefVehicleRequest, respRentalCar ) { 

        let component = new Object();
		
		//component.id = id;
        component.id = respReliefVehicleRequest[0].VVACID;
		let rob = new Object();
		
		//Activiteit
       	rob.code = code;
		component.rob = rob;
		
		// Bewerking
		 let operation = new Object();
		operation.code = '00';
		component.operation = operation;
		
		//reden
		   let reason = new Object();
		   reason.code = reasoncode;
		   component.reason = reason;
		   
		//prijs   
		component.price = Number(respReliefVehicleRequest[0].VVTOTB);
			//Componenten
		let subcomponents = [];
		
	code = '9101';
		
		//Reservering		
	    id = crypto.randomUUID();
		operation = '29';
		subcomponents.push(await fillSubComponent(lib, filiaal, verhuurorder, code, id, operation, respReliefVehicleRequest, respRentalCar ));
	
		//Uitgifte
		id = crypto.randomUUID();
		operation = '30';
		subcomponents.push(await fillSubComponent(lib, filiaal, verhuurorder, code, id, operation, respReliefVehicleRequest, respRentalCar ));
	
		//Afmelding
		id = crypto.randomUUID();
		operation = '32';
		subcomponents.push(await fillSubComponent(lib, filiaal, verhuurorder, code, id, operation, respReliefVehicleRequest, respRentalCar ));
			
		component.subcomponents = subcomponents;
		
		return	component;		
}

//-------------------------------------------------------------------------
// samenstellen subcomponent (29=Reservering, 30=Uitgifte, 32=Afmelding)
//-------------------------------------------------------------------------
async function fillSubComponent(lib, filiaal, verhuurorder,code, id, operationcode, respReliefVehicleRequest, respRentalCar ) { 

        let subcomponent = new Object();
		
		 subcomponent.id = id;
		
        let rob = new Object();
		
		//Activiteit
       	rob.code = code;
		subcomponent.rob = rob;
		
		// Bewerking
		 let operation = new Object();
		operation.code = operationcode;
		subcomponent.operation = operation;
		
	
	
			//Componenten
		let subcomponents = [];
		let part = new Object();
		
		switch(operationcode.trim()) {
		
		case "29":
		//Reservering
		code = '9111';  // Inzetduur doorbelast
		value = respReliefVehicleRequest[0].VVINZD;
		subcomponents.push(await fillSubSubComponent(code, value));
	
	    code = '9110'; // Inzetduur
		value = respReliefVehicleRequest[0].VVINZD;
		subcomponents.push(await fillSubSubComponent(code, value));
		
		// overige kosten
		if (respReliefVehicleRequest[0].VVOVKS.trim() !== ".00"){
		code = '9153';
		value = null;
		price = Number(respReliefVehicleRequest[0].VVOVKS); 
		comment = respReliefVehicleRequest[0].VVTOEL.trim();
		subcomponents.push(await fillSubSubComponent(code, value, price, comment));
		}
		
		part.partType = 'RentalVehicleDeliveryDetails';
        part.isDelivered =   (respReliefVehicleRequest[0].VVOWNL == "N"?true:false); // Geen aflevering
        if(respReliefVehicleRequest[0].VVOWNL == "N") {
		let dc = new Object();
		dc.name = respReliefVehicleRequest[0].VVANAM.trim();
		dc.phone = respReliefVehicleRequest[0].VVATEL.trim();
		adr =new Object();
		adr.street  = respReliefVehicleRequest[0].VVANAM.trim();
		adr.zipCode = respReliefVehicleRequest[0].VVAPST.trim();
		adr.city    = respReliefVehicleRequest[0].VVAWPL.trim();
		dc.address = adr;
		part.deliveryContact =  dc;
		}
		
		subcomponent.part = part;
		
		// Huurklasse
		subcomponent.value = respReliefVehicleRequest[0].VVHUKL.trim();;
	
	    subcomponent.subcomponents = subcomponents;
		return	 subcomponent;				
					
		case "30":
		//Uitgifte
		part.partType = 'RentalVehicleProperties';
		part.licensePlate = respReliefVehicleRequest[0].VVVREGN.trim() ;
		part.hasAutomaticTransmission = (respRentalCar[0].VSAUTO.trim() == "J"?true:false); // Betreft het een automaat?
        part.fuelType = determineFuelType(respRentalCar[0].VSBRST.trim()); // Brandstoftype
                
		subcomponent.part = part;
		// Huurklasse huurauto
		subcomponent.value = determineRentalClassDealer(respRentalCar[0].VSKLAS.trim());
        
		code = '9150';  // Verhuurkosten (inzetduur doorbelast maal dagtarief)
		price = respReliefVehicleRequest[0].VVINZD * respReliefVehicleRequest[0].VVTDAG;
		value= null;
		subcomponents.push(await fillSubSubComponent(code, value, price));
	    
		code = '9112' // Vrije kilometers per dag
		price = null;
		value= respReliefVehicleRequest[0].VVKMVR;
		subcomponents.push(await fillSubSubComponent(code, value, price));
	    
	
	
		subcomponent.subcomponents = subcomponents;
		
		
		
		return	 subcomponent;				
	    
		
		
		case "32":
		//Afmelding
		code = '9150';  // Verhuurkosten (inzetduur doorbelast maal dagtarief)
		price = respReliefVehicleRequest[0].VVINZD * respReliefVehicleRequest[0].VVTDAG;
		value= null;
		subcomponents.push(await fillSubSubComponent(code, value, price));
	    
		code = '9112' // Vrije kilometers per dag
		price = null;
		value= respReliefVehicleRequest[0].VVKMVR;
	    subcomponents.push(await fillSubSubComponent(code, value, price));
	    
		code = '9113' // Verreden kilometers per dag
		price = null;
		value= respReliefVehicleRequest[0].VVVRKM;
	    subcomponents.push(await fillSubSubComponent(code, value, price));
	
	    // overige kosten
		if (respReliefVehicleRequest[0].VVOVKS.trim() !== ".00"){
		code = '9153';
		value = null;
		price = Number(respReliefVehicleRequest[0].VVOVKS); 
		comment = respReliefVehicleRequest[0].VVTOEL.trim();
		subcomponents.push(await fillSubSubComponent(code, value, price, comment));
		}
		
	    // eigen risico
		if (respReliefVehicleRequest[0].VVERCL.trim() !== ".00"){
		code = '9158';
		value = null;
		price = Number(respReliefVehicleRequest[0].VVERCL); 
		comment = respReliefVehicleRequest[0].VVTOEE.trim();
		subcomponents.push(await fillSubSubComponent(code, value, price, comment));
		}
		
		// brandstofkosten
		if (respReliefVehicleRequest[0].VVBCKS.trim() !== ".00"){
		code = '9155';
		value = null;
		price = Number(respReliefVehicleRequest[0].VVBCKS); 
		subcomponents.push(await fillSubSubComponent(code, value, price));
		}
	
	    // aftankkosten
		if (respReliefVehicleRequest[0].VVTANK.trim() !== ".00"){
		code = '9156';
		value = null;
		price = Number(respReliefVehicleRequest[0].VVTANK); 
		subcomponents.push(await fillSubSubComponent(code, value, price));
		}
		
		// haalkosten
		if (respReliefVehicleRequest[0].VVHAKS.trim() !== ".00"){
		code = '9151';
		value = null;
		price = Number(respReliefVehicleRequest[0].VVHAKS); 
		subcomponents.push(await fillSubSubComponent(code, value, price));
		}
		
		// brengkosten
		if (respReliefVehicleRequest[0].VVBRKS.trim() !== ".00"){
		code = '9152';
		value = null;
		price = Number(respReliefVehicleRequest[0].VVBRKS); 
		subcomponents.push(await fillSubSubComponent(code, value, price));
		}
		
	    // meerkm kosten
		if (respReliefVehicleRequest[0].VVTMKM.trim() !== ".00"){
			 
		if (respReliefVehicleRequest[0].VVVRKM > respReliefVehicleRequest[0].VVKMVR){
		code = '9154';
		value = null;
		price = Number(respReliefVehicleRequest[0].VVTMKM * (respReliefVehicleRequest[0].VVVRKM - respReliefVehicleRequest[0].VVKMVR)).toFixed(2); 
		subcomponents.push(await fillSubSubComponent(code, value, price));
		}
		 }
	
		
		
		subcomponent.subcomponents = subcomponents;
			
       return	 subcomponent;				
	    
  } 
		
	
		
}

//-------------------------------------------------------------------------
// samenstellen subcomponent (29=aflevering, 30=Reservering, 32=uitgifte)
//-------------------------------------------------------------------------
async function fillSubSubComponent(code, valuecode, price, comment) { 

        let subcomponent = new Object();
		
		 subcomponent.id = crypto.randomUUID();
		
        let rob = new Object();
		
		//Activiteit
       	rob.code = code;
		subcomponent.rob = rob;
		
		if (price == null){
		if(value !== 0){
		subcomponent.value = value;
		}
		}
		
		if(price !== null)
		{
		subcomponent.price = Number(price);	
		}
		
		if(comment !== null)
		{
			subcomponent.comment = comment;
		}
		
			//Componenten
		let subcomponents = [];
		
		
		
		
	
		return	subcomponent;		
}
			
async function handleCreateReliefVehicleRequest(guid, lib, filiaal, applicatie, verhuurorder)
{
    try{	
	 
	
	var resolve = await startCreateReliefVehicleRequestRob(guid, lib, filiaal, applicatie, verhuurorder);
	return (resolve);
    }
	catch(err) { console.error('handleCreateReliefVehicleRequest error: ' +err);}
	
}

function determineFuelType(fueltype) {
	
	switch(fueltype) {
		// Moet nog vervangen worden door een tabel, als er meer tijd is 04-06-2020
  case "B":
	return "Gasoline";	
  case "D":
    return "Diesel";
  default:
  return "Electric";
    // code block
} 
}

function determineRentalClassDealer(rentalclass) {
	
	switch(rentalclass) {
		// Moet nog vervangen worden door een tabel, als er meer tijd is 04-06-2020
  case "A":    
	return "A";  //MINIKLASSE (SUBMINIS)
  case "B":
    return "BP";  //COMPACTE AUTOS (KLEINE AUTOS)
  case "C":
	return "CP";	// COMPACTE MIDDENKLASSE (KLEINE MIDDENKLASSE)
  case "D":
    return "DP";	//MIDDENKLASSE
  case "E":
    return "EP";	// HOGERE MIDDENKLASSE
  case "F":
    return "FP";	// TOPKLASSE GROTE AUTOS/LUXE MODELLEN
 case "J":
    return "LDP";	// MIDI MPVS (GEBASEERD OP MIDDENKLASSE)
 case "M":
    return "MEP";	// GROTE SUVS	
 case "V":
    return "";	// VRACHTWAGEN	
  default:
  return rentalclass;
    // code block
} 
}

module.exports = {
  handleCreateReliefVehicleRequest: handleCreateReliefVehicleRequest
  };  

