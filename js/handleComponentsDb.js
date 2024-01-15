const {dbconn, dbstmt} = require('idb-connector');

 function writeComponentDb(answer) {
	 
  return new Promise(function(resolve)
  { 
   const sSql = 'INSERT INTO DASFP@V.PROBACT (ACT, ACTOMS, ACTAANA, ACTAANP, ACTIOND, ACTMAXA, ACTDTAN, ACTDTWZ) VALUES(?, ?, ?, ?, ?, ?, ?, ?) with NONE';
   const connection = new dbconn();
    connection.conn('*LOCAL');
  //  connection.debug(true);
   
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillComponent(answer);
    statement.prepareSync(sSql);
	statement.bindParametersSync(arrayElements);						 
	statement.executeSync((x) => {	
	statement.close();
	//console.log("insert answer: " + x);    
	});	
     connection.disconn();
     connection.close();
	 resolve('Klaar'); 	
  });
 }

function writeComponentFueltypeDb(act, answer) {
	 
  return new Promise(function(resolve)
  { 
   const sSql = 'INSERT INTO DASFP@V.PROBACTBC (ACT, ACTBCD, ACTDTAN, ACTDTWZ) VALUES(?, ?, ?, ?) with NONE';
   const connection = new dbconn();
    connection.conn('*LOCAL');
  //  connection.debug(true);
   

	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillComponentFueltype(act, answer);
	statement.prepareSync(sSql);
	statement.bindParametersSync(arrayElements);						 
	statement.executeSync((x) => {	
	statement.close();
	//console.log("insert answer: " + x);    
	});	
   
     connection.disconn();
     connection.close();
	 resolve('Klaar'); 	
  });
   
 }

function writeComponentObjecttypeDb(act, answer) {
	 
  return new Promise(function(resolve)
  { 
   const sSql = 'INSERT INTO DASFP@V.PROBACTGO (ACT, ACTOTYP, ACTOOMS, ACTBVS, ACTDTAN, ACTDTWZ, ACTDTANO, ACTDTWZO) VALUES(?, ?, ?, ?, ?, ?, ?, ?) with NONE';
   const connection = new dbconn();
    connection.conn('*LOCAL');
  //  connection.debug(true);
   
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillComponentObjecttype(act, answer);
    statement.prepareSync(sSql);
	statement.bindParametersSync(arrayElements);						 
	statement.executeSync((x) => {	
	statement.close();
	//console.log("insert answer: " + x);    
	});	
     connection.disconn();
     connection.close();
	 resolve('Klaar'); 	
  });
   
 }

   
   function writeComponentLocationDb(act, answer) {
	 
  return new Promise(function(resolve)
  { 
   const sSql = 'INSERT INTO DASFP@V.PROBACTPA (ACT, ACTPA1, ACTPA2, ACTDTAN, ACTDTWZ) VALUES(?, ?, ?, ?, ?) with NONE';
   const connection = new dbconn();
    connection.conn('*LOCAL');
  //  connection.debug(true);
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillComponentLocation(act, answer);
	statement.prepareSync(sSql);
	statement.bindParametersSync(arrayElements);						 
	statement.executeSync((x) => {	
	statement.close();
	//console.log("insert answer: " + x);    
	});
	
     connection.disconn();
     connection.close();
	 resolve('Klaar'); 	
  });
   
 }
 
   function writeComponentOperationDb(act, defect, answer) {
	 
  return new Promise(function(resolve)
  { 
   const sSql = 'INSERT INTO DASFP@V.PROBACTDB (ACT, ACTBEW, ACTDCD, ACTGCT, ACTDTAN, ACTDTWZ) VALUES(?, ?, ?, ?, ?, ?) with NONE';
   const connection = new dbconn();
    connection.conn('*LOCAL');
  //  connection.debug(true);
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillComponentOperation(act, defect, answer);
	statement.prepareSync(sSql);
	statement.bindParametersSync(arrayElements);						 
	statement.executeSync((x) => {	
	statement.close();
	//console.log("insert answer: " + x);    
	});
	
     connection.disconn();
     connection.close();
	 resolve('Klaar'); 	
  });
   
 }

function deleteComponentsDb(lib) {
	 
  return new Promise(function(resolve)
  {  
     const sSql = 'delete from dasfp@v.probact with NONE';
	
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

function deleteComponentsOperationDb(lib) {
	 
  return new Promise(function(resolve)
  {  
     const sSql = 'delete from dasfp@v.probactdb with NONE';
	
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

function deleteComponentsFueltypeDb(lib) {
	 
  return new Promise(function(resolve)
  {  
     const sSql = 'delete from dasfp@v.probactbc with NONE';
	
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

function deleteComponentsObjecttypeDb(lib) {
	 
  return new Promise(function(resolve)
  {  
     const sSql = 'delete from dasfp@v.probactgo with NONE';
	
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
 
 function deleteComponentsLocationDb(lib) {
	 
  return new Promise(function(resolve)
  {  
     const sSql = 'delete from dasfp@v.probactpa with NONE';
	
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
 
function fillComponent(component) { 

		return				[Number(component.robCode),
						     component.description,
							 (component.requiredFields.includes("PartCount") ? "1":"0"),
							 (component.requiredFields.includes("Location") ?  "1":"0"),
							 "1",
							 (component.maximumPartCount != undefined ? component.maximumPartCount: 0), 
							 "0001-01-01",
							 "0001-01-01"
						]
}	 
 
function fillComponentFueltype(act, component) { 

		return				[Number(act),
						     component.code,
							 "0001-01-01",
							 "0001-01-01"
						]
}	 
 
function fillComponentObjecttype(act, component) { 

		return				[Number(act),
						     component.code,
							 component.description,
							 "",
							 "0001-01-01",
							 "0001-01-01",
							 "0001-01-01",
							 "0001-01-01"
						]
}	 

function fillComponentLocation(act, component) { 

		return				[Number(act),
						     component[0].code,
							 component[1].code,
							 "0001-01-01",
							 "0001-01-01"
						]
}

function fillComponentOperation(act, defect, component) { 

		return				[Number(act),
						     defect, 
						     component.code,
							 "1",
							 "0001-01-01",
							 "0001-01-01"
						]
}	  
 
 module.exports = {
  writeComponentFueltypeDb: writeComponentFueltypeDb, 
  writeComponentDb: writeComponentDb,
  writeComponentObjecttypeDb: writeComponentObjecttypeDb,
  writeComponentLocationDb: writeComponentLocationDb, 
  writeComponentOperationDb: writeComponentOperationDb, 
  
  deleteComponentsDb: deleteComponentsDb,
  deleteComponentsFueltypeDb: deleteComponentsFueltypeDb, 
  deleteComponentsLocationDb: deleteComponentsLocationDb,
  deleteComponentsOperationDb: deleteComponentsOperationDb, 
  deleteComponentsObjecttypeDb: deleteComponentsObjecttypeDb
 
  }
 