const {dbconn, dbstmt} = require('idb-connector');
const qs = require('qs');

 function writeErrorLog(guid, lib, filiaal, applicatie, key, data) {
	 
  return new Promise(function(resolve)
  { 	
	const sSql = 'INSERT INTO DASFP@V.BOLLOG (BOLQ, BOLA, BOLQT, BOLAT, BOLQAP, BOLERRSEV, BOLERRTXT, BOLGUID) VALUES(?, ?, ?, ?, ?, ?, ?, ?) with NONE';
	//console.log('data bollog:: '+ data.toString()); 
	//console.log("sql insert bollog: " + sSql);
    const connection = new dbconn();
    connection.conn('*LOCAL');
    //connection.debug(true);
	const statement = new dbstmt(connection);     
	var errorMelding;
	if (data.data.errors !== undefined){
	 errorMelding = data.data.errors[0].description.substring(0,122)	
	}
	else{
	if (data.data.detail !== undefined){
	errorMelding = data.data.detail.substring(0,122)		
	}
	else{
	errorMelding = "No reply from service";	
	}
	}
 // arrayElements = [applicatie, key.substring(0,32), new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' '), 0, 0, data.data.status + ': ' +  (data.data.errors != //undefined ? data.data.errors[0].description.substring(0,122): data.data.detail.substring(0,122)), guid]; 
  arrayElements = [applicatie, key.substring(0,32), new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' '), 0, 0, data.data.status + ': ' +  errorMelding, guid]; 
  
 console.log("binding elements : " + arrayElements.toString());
	
    statement.prepare(sSql, () => {
		
	statement.bindParameters(arrayElements , () => {	
						 
 statement.execute((x) => {						 
    statement.close();
      connection.disconn();
      connection.close();
     console.log("insert answer: " + x);
	resolve(x);    
	});
	});
		});
  });
 }
 
 module.exports = {
  writeErrorLog: writeErrorLog,
  };
 