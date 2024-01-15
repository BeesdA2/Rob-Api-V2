const {dbconn, dbstmt} = require('idb-connector');

 function getBrancheDetails (lib, filiaal) {
	 
  return new Promise(function(resolve)
  {  
    const sSql = 'SELECT *from ' + lib.trim() + '.filma where FIBRNO = '+ filiaal + ' with NONE';
	
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
  getBrancheDetails: getBrancheDetails
  };
