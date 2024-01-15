const {dbconn, dbstmt} = require('idb-connector');

 function writeContractDb(lib, kenteken, answer) {
	 
  return new Promise(function(resolve)
  { 
	const sSql = 'INSERT INTO ' + lib.trim() + '.PROBCO (COREGN, CONRLS, CONMLS, COBRCD, COLSBR, CODTEC, CODTLB, CODTVA, CODTEU, COINFL, COKMEL, COMERK, COMODE, COOBJO, COOBJT, COONDT, COOPMV, COVVT, COBVS, COURHG, COURLG, COURST, COHUKL, COBNDL, COBNDC, COSUBL, COWINC, COWINM, COHKST, COBKST, COKKST, COBNDW, COBCAT, COBSI, COSTIK, COUSEB, COROFB, COALLS, COWINO, COROFO, COALLO) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) with NONE';
 
	console.log("sql insert probco: " + sSql);
    const connection = new dbconn();
    connection.conn('*LOCAL');
    //connection.debug(true);
	const statement = new dbstmt(connection);     
	arrayElements = fillContract(answer, kenteken); 
     console.log("binding elements : " + arrayElements.toString());
	
    statement.prepare(sSql, () => {
		
	statement.bindParameters(arrayElements , () => {	
						 
    statement.execute((x) => {						 
    statement.close();
      connection.disconn();
      connection.close();
     console.log("insert answer: " + x);
	 // Gemonteerde banden wegschrijven
	 if(answer.vehicle.mountedTires.length  != 0){
	 writeBandenDb(lib, kenteken, answer.vehicle.mountedTires, 'J');	 
	 };
	 // Opgeslagen banden wegscrhrijven
	  if(answer.vehicle.storedTires.length  != 0){
	 writeBandenDb(lib, kenteken, answer.vehicle.storedTires, 'N');	 
	 };
	 //Kosten band wegscrhrijven
	 if(answer.supplierContract.tires.allowedCosts.tireStorageCosts != undefined){
	 writeKostenDb(lib, kenteken, 3161, answer.supplierContract.tires.allowedCosts.tireStorageCosts);	 
	 };
	 if(answer.supplierContract.tires.allowedCosts.tireTransportCosts != undefined){
	 writeKostenDb(lib, kenteken, 3160, answer.supplierContract.tires.allowedCosts.tireTransportCosts);	 
	 };
	  if(answer.supplierContract.tires.allowedCosts.surchargeNitrogen != undefined){
	 writeKostenDb(lib, kenteken, 3159, answer.supplierContract.tires.allowedCosts.surchargeNitrogen);	 
	 };
     if(answer.supplierContract.tires.allowedCosts.surchargeRunOnFlat != undefined){
	 writeKostenDb(lib, kenteken, 3150, answer.supplierContract.tires.allowedCosts.surchargeRunOnFlat);	 
	 };
	 if(answer.supplierContract.tires.allowedCosts.surchargeMobileService != undefined){
	 writeKostenDb(lib, kenteken, 3154, answer.supplierContract.tires.allowedCosts.surchargeMobileService);	 
	 };
	 if(answer.supplierContract.tires.allowedCosts.surchargeLargeRim != undefined){
	 writeKostenDb(lib, kenteken, 3152, answer.supplierContract.tires.allowedCosts.surchargeLargeRim);	 
	 };
	 if(answer.supplierContract.tires.allowedCosts.surchargeTruckTire != undefined){
	 writeKostenDb(lib, kenteken, 3153, answer.supplierContract.tires.allowedCosts.surchargeTruckTire);	 
	 };
	 if(answer.supplierContract.tires.allowedCosts.handlingCostLessorStock != undefined){
	 writeKostenDb(lib, kenteken, 3158, answer.supplierContract.tires.allowedCosts.handlingCostLessorStock);	 
	 };
	 if(answer.supplierContract.tires.allowedCosts.handlingCostThirdPartyTire != undefined){
	 writeKostenDb(lib, kenteken, 3151, answer.supplierContract.tires.allowedCosts.handlingCostThirdPartyTire);	 
	 };
	  if(answer.supplierContract.tires.allowedCosts.tireDisposalFee != undefined){
	 writeKostenDb(lib, kenteken, 3156, answer.supplierContract.tires.allowedCosts.tireDisposalFee);	 
	 };
	 // Not Defined yet
	// if(answer.supplierContract.tires.allowedCosts.deliveryFeeToDealer != undefined){
	// writeKostenDb(lib, kenteken, 3156, answer.supplierContract.tires.allowedCosts.deliveryFeeToDealer);	 
	// };
		 
	resolve(x);    
	});
	});
		});
  });
 }

function deleteContractDb(lib, kenteken) {
	 
  return new Promise(function(resolve)
  {  
  	  const sSql = 'delete from ' + lib.trim()  + '.probco where COREGN = \'' + kenteken   + '\' with NONE';
	
    const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);     
	
    statement.execSync(sSql, (x) => {
    statement.close();
      connection.disconn();
      connection.close();
    deleteContractBandDb(lib, kenteken); 
	deleteContractKostenDb(lib, kenteken); 
	resolve(x);    
	});
  });
 } 
 
  function writeBandenDb(lib, kenteken, tires, gemonteerd) {
	 
  return new Promise		(function(resolve)
  { 
  
 	const sSql = 'INSERT INTO ' + lib.trim() + '.PROBCOBA (CBREGN, CBMONT, CBAS, CBPOS, CBBR, CBLOIN, CBSI, CBVEDI, CBVBH, CBBMCD, CBMTPA, CBTYPV, CBBCAT, CBBSI, CBBACC, CBEANC, CBBDID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) with NONE'; 
	
    const connection = new dbconn();
    connection.conn('*LOCAL');
  //  connection.debug(true);
   
	for (let i = 0; i < tires.length; i += 1) {    
	
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillTire(tires[i], kenteken, gemonteerd);
	console.log("binding elements TIRES[" + i + "]: " + arrayElements.toString());
    statement.prepareSync(sSql);
	statement.bindParametersSync(arrayElements);						 
	statement.executeSync((x) => {	
	statement.close();
	console.log("insert answer: " + x);    
	});	
	};
     connection.disconn();
     connection.close();
	 resolve('Klaar'); 	
  });
 }

 function writeKostenDb(lib, kenteken, activiteit, toegestaan) {
	 
  return new Promise		(function(resolve)
  { 
  
 	const sSql = 'INSERT INTO ' + lib.trim() + '.PROBCOKO (KOREGN, KOACT, KOALWD) VALUES(?, ?, ?) with NONE'; 
	
    const connection = new dbconn();
    connection.conn('*LOCAL');
  //  connection.debug(true);
   	
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = [kenteken, activiteit, (toegestaan ? "J" : "N")];
	console.log("binding elements KOSTEN: " + arrayElements.toString());
    statement.prepareSync(sSql);
	statement.bindParametersSync(arrayElements);						 
	statement.executeSync((x) => {	
	statement.close();
	console.log("insert answer: " + x);    
	});	
	     connection.disconn();
     connection.close();
	 resolve('Klaar'); 	
  });
 } 
 
function deleteContractBandDb(lib, kenteken) {
	 
  return new Promise(function(resolve)
  {  
    const sSql = 'delete from ' + lib.trim() + '.probcoba where CBREGN = \'' + kenteken + '\' with NONE';
 	
    const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);     
	
    statement.execSync(sSql, (x) => {
    statement.close();
      connection.disconn();
      connection.close();
     
	resolve(x);    
	});
  });
 } 
 
function deleteContractKostenDb(lib, kenteken) {
	 
  return new Promise(function(resolve)
  {  
    const sSql = 'delete from ' + lib.trim() + '.probcoko where KOREGN = \'' + kenteken + '\' with NONE';
 	
    const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);     
	
    statement.execSync(sSql, (x) => {
    statement.close();
      connection.disconn();
      connection.close();
     
	resolve(x);    
	});
  });
 }  

function fillContract(answer, kenteken) { 
			return 		[kenteken, 
						 answer.lessor.number, 
						 answer.lessor.name, 
						 answer.vehicle.fuelTypeCode.code,
						 answer.vehicle.maintenance.lastMaintenanceCode,
						(answer.leaseContract.endDate != undefined ? new Date(answer.leaseContract.endDate).toISOString().slice(0, 10) : "0001-01-01") ,	
						(answer.vehicle.maintenance.lastMaintenanceDate != undefined ? new Date(answer.vehicle.maintenance.lastMaintenanceDate).toISOString().slice(0, 10) : "0001-01-01"), 
						(answer.vehicle.maintenance.nextPeriodicCheck != undefined ? new Date(answer.vehicle.maintenance.nextPeriodicCheck).toISOString().slice(0, 10): "0001-01-01") ,
						(answer.vehicle.firstRegisteredDate != undefined ? new Date(answer.vehicle.firstRegisteredDate).toISOString().slice(0, 10): "0001-01-01"), 
						(answer.leaseContract.information    != undefined ? answer.leaseContract.information   : ""),
						(answer.leaseContract.maximumMileage != undefined ? answer.leaseContract.maximumMileage: 0),  
						answer.vehicle.vehicleMake, 
	                    answer.vehicle.vehicleModel,
						answer.vehicle.vehicleType, 
						answer.vehicle.objectType.code,
                        (answer.supplierContract.repairAndMaintenance.allowed ? "J" : "N"), 
						(answer.leaseContract.rentalVehicle.remark != undefined ? answer.leaseContract.rentalVehicle.remark : ""),
						(answer.leaseContract.rentalVehicle.inContract ? "J": "N"),
						'', //(answer.vehicle.tireObjectType != undefined ? answer.vehicle.tireObjectType.code : ""), NAVRAGEN ROB
						0, //uurtarief hoog !!komen te vervallen !!
						0, //uurtafief laag !!komen te vervallen !!
 					    0, //(answer.hourlyRates != undefined ? answer.hourlyRates: 0),  NAVRAGEN ROB
						'', //answer.maxDeployableRentalClass, NAVRAGEN ROB
					   (answer.leaseContract.tires.inContract ? "J" : "N"), 
					   (answer.leaseContract.tires.tireSwapInContract ? "J" : "N"), 
					   '', //(answer.lessor.subLessorCode != undefined ? answer.lessor.subLessorCode : ""), NAVRAGEN ROB
					    '',
						0, // Maximaal aantal winterbanden !!komen te vervallen !!
						(answer.supplierContract.rentalVehicle.allowedCosts.pickupCosts ? "J" : "N"), 
						(answer.supplierContract.rentalVehicle.allowedCosts.deliveryCosts ? "J" : "N"), 
						(answer.supplierContract.rentalVehicle.allowedCosts.fuelServiceCosts ? "J" : "N"), 
						(answer.leaseContract.tires.tireSwapInContract ? "J" : "N"), 
						(answer.vehicle.mountedTires[0] != undefined ? answer.vehicle.mountedTires[0].specifications.category.substring(0, 1):""),
						(answer.vehicle.mountedTires[0] != undefined ? answer.vehicle.mountedTires[0].specifications.seasonIndicator.substring(0, 1):""),
						(answer.leaseContract.tires.nitrogenTireFillingInContract ? "J" : "N"), 
						(answer.leaseContract.tires.usedTiresInContract ? "J" : "N"), 
						'',
						'',
						'', //answer.permissions.winterTires, NAVRAGEN ROB
						answer.leaseContract.tires.rofTiresInContract, 
						answer.leaseContract.tires.allSeasonTiresInContract	
						 ]; 
}

function fillTire(tire, kenteken, type) { 

		return			[kenteken, 
						 type,
						 parseInt(tire.positionCode1.trim()),
						 tire.positionCode2,
						 tire.specifications.nominalWidthInMillimeters,						 
						 tire.specifications.loadIndex.toString(),
						 tire.specifications.speedRating.substring(0, 1),
						 tire.specifications.rimDiameterInInches,
						 tire.specifications.widthHeightRatio,
						 tire.specifications.makeCode,
						 tire.specifications.modelTypeProfile,
						 tire.specifications.typeNumber,
						 tire.specifications.category.substring(0, 1),
						 tire.specifications.seasonIndicator.substring(0, 1),
						 tire.specifications.bacCode.substring(0, 18),
						 tire.specifications.eanCode,
						 tire.specifications.id
						]
}	 
 
 module.exports = {
  writeContractDb: writeContractDb,
  deleteContractDb: deleteContractDb
  };
 