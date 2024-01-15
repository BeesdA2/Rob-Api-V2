const {dbconn, dbstmt} = require('idb-connector');

 function getCarDetails (lib, kenteken) {
	 
  return new Promise(function(resolve)
  {  
    const sSql = 'SELECT * from '+ lib.trim() + '.carveh where BREGNO  = \'' + kenteken + '\' with NONE';
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
  getCarDetails: getCarDetails
  };
