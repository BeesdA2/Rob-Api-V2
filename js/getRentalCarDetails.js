const {dbconn, dbstmt} = require('idb-connector');

 function getRentalCarDetails (lib, filiaal, kenteken) {
	 
  return new Promise(function(resolve)
  {  
    const sSql = 'SELECT * from '+ lib.trim() + '.vauto where VSFILN = ' + filiaal + ' AND VSKENT  = \'' + kenteken + '\' with NONE';
	//console.log("Car sql: " + sSql);
    const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);     
	
    statement.exec(sSql, (sqlresult) => {
    statement.close();
      connection.disconn();
      connection.close();
     
	resolve(sqlresult);    
	});
  });
 }
  
 module.exports = {
  getRentalCarDetails: getRentalCarDetails
  };
