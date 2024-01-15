const {dbconn, dbstmt} = require('idb-connector');

function getSwapTireDb(lib, filiaal, werkorder, as, plaats) {
	 
  return new Promise(function(resolve)
  {  
 	  const sSql = 'select *from ' + lib.trim()  + '.probwoba where BAFILL = ' + filiaal + ' and BAWONR = ' + werkorder + ' and BAACT = 3198 and BAAS = ' + as + ' and BAPA = \'' + plaats + '\' with NONE';

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
 
 function getSeasonTireDb(lib, filiaal, werkorder, as, plaats) {
	 
  return new Promise(function(resolve)
  {  
 	  const sSql = 'select *from ' + lib.trim()  + '.probwoba where BAFILL = ' + filiaal + ' and BAWONR = ' + werkorder + ' and BAACT = 3199 and BAAS = ' + as + ' and BAPA = \'' + plaats + '\' with NONE';

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
 
function getRepairTireDb(lib, filiaal, werkorder, as, plaats) {
	 
  return new Promise(function(resolve)
  {  
 	  const sSql = 'select *from ' + lib.trim()  + '.probwoba where BAFILL = ' + filiaal + ' and BAWONR = ' + werkorder + ' and BAACT = 3197 and BAAS = ' + as + ' and BAPA = \'' + plaats + '\' with NONE';

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


function getUnmountedTireDb(lib, filiaal, werkorder, as, plaats) {
	 
  return new Promise(function(resolve)
  {  
 	  const sSql = 'select *from ' + lib.trim()  + '.probwobd where BDFILL = ' + filiaal + ' and BDWONR = ' + werkorder + ' and BDAS = ' + as + ' and BDPA = \'' + plaats + '\' with NONE';

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
 
 function getMountedTireDb(lib, filiaal, werkorder, as, plaats) {
	 
  return new Promise(function(resolve)
  {  
 	  const sSql = 'select *from ' + lib.trim()  + '.probwobw where BWFILL = ' + filiaal + ' and BWWONR = ' + werkorder + ' with NONE';

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
 
 function getInformationSwapDb(lib, filiaal, werkorder) {
	 
  return new Promise(function(resolve)
  {  
 	  const sSql = 'select *from ' + lib.trim()  + '.probwowb where WBFILL = ' + filiaal + ' and WBWONR = ' + werkorder + ' with NONE';

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
 
 function writeTiresDb(lib, kenteken, rdcnummer, answer) {
	 
  return new Promise(function(resolve)
  { 
   const sSql = 'INSERT INTO ' + lib.trim() + '.PROBBA (BBUSER, BBREGN, BBBR, BBBMCD, BBLOIN, BBSI, BBVEDI, BBVBH, BBMTPA, BBTYPV, BBOMSB, BBBACC, BBEANC, BBBCAT, BBBSI, BBROLW, BBWETG, BBGLDP, BBSTAT, BBBDID) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) with NONE';
   const connection = new dbconn();
    connection.conn('*LOCAL');
    //connection.debug(true);
   
	for (let i = 0; i < answer.tires.length; i += 1) {    
	
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillTire(answer.tires[i], kenteken, rdcnummer);
	console.log("binding elements Tires[" + i + "]: " + arrayElements.toString());
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

function deleteTiresDb(lib, kenteken, rdcnummer) {
	 
  return new Promise(function(resolve)
  {  
 	  const sSql = 'delete from ' + lib.trim()  + '.probba where BBREGN = \'' + kenteken   + '\' and BBUSER = ' + rdcnummer + ' with NONE';

	
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



 function writeTireMakesDb(answer) {
	 
  return new Promise(function(resolve)
  { 
   const sSql = 'INSERT INTO DASFP@V.PROBTAB ( TAVLNM, TAVLTP, TAVLLN, TAVLDC, TAVLNG, TALSNR, TAVLWR, TAVLOM ) VALUES(?, ?, ?, ?, ?, ?, ?, ?) with NONE';
   const connection = new dbconn();
    connection.conn('*LOCAL');
  //  connection.debug(true);
   
	for (let i = 0; i < answer.makes.length; i += 1) {    
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillTireMakes(answer.makes[i]);
    statement.prepareSync(sSql);
	statement.bindParametersSync(arrayElements);						 
	statement.executeSync((x) => {	
	statement.close();
	//console.log("insert answer: " + x);    
	});	
	};
     connection.disconn();
     connection.close();
	 resolve('Klaar'); 	
  });
 }

function deleteTireMakesDb() {
	 
  return new Promise(function(resolve)
  {  
 	  const sSql = 'delete from dasfp@v.probtab where TAVLNM = \'BandMerkCode\' with NONE';
	
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

//BBUSER, BBREGN, BBBR, BBBMCD, BBLOIN, BBSI, BBVEDI, BBVBH, BBMTPA, BBTYPV, BBOMSB, BBBACC, BBEANC, BBBCAT, BBBSI, BBROLW, BBWETG, BBGLDP, BBSTAT, BBBDID
function fillTire(tire, kenteken, rdcnummer) { 

		return				[Number(rdcnummer),
						     kenteken, 
						 tire.nominalWidthInMillimeters,	
						 tire.makeCode,						 
						 tire.loadIndex.toString(),
						 tire.speedRating.substring(0, 1),
						 tire.rimDiameterInInches,
						 tire.widthHeightRatio,
						 tire.modelTypeProfile.substring(0, 20),
						 tire.typeNumber,
						 tire.description.substring(0, 70),
						 tire.bacCode.substring(0, 18),
						 tire.eanCode,
						 tire.category.substring(0, 1),
						 tire.seasonIndicator.substring(0, 1),
						 tire.rollingResistanceCode,
						 tire.wetGripCode,
						 0,
						 tire.vacoStatus == "Current" ? "Active" : "Obsolete",
						 tire.id
						]
}	 

function fillTireMakes(make) { 

		return			[ "BandMerkCode",
						 "",
						 0,
						 0,
						 "0",
						 0,
						 make.code,						 
						 make.name
						]
}	 
 
 module.exports = {
	getSwapTireDb: getSwapTireDb, 	
	getSeasonTireDb: getSeasonTireDb, 	
	getRepairTireDb: getRepairTireDb, 		
	getUnmountedTireDb: getUnmountedTireDb, 		
	getMountedTireDb: getMountedTireDb, 		
	getInformationSwapDb: getInformationSwapDb, 		
	writeTiresDb: writeTiresDb,	
	deleteTiresDb: deleteTiresDb,
	writeTireMakesDb: writeTireMakesDb,
	deleteTireMakesDb: deleteTireMakesDb
  };
 