const {dbconn, dbstmt} = require('idb-connector');

 function getOrderDetails (lib, filiaal, ordernr) {
	 
  return new Promise(function(resolve)
  {  
    const sSql = 'SELECT * from '+ lib.trim() + '.doh where ohbran = '+ filiaal + ' and ohordn = ' + ordernr + ' with NONE';
	
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
  getOrderDetails: getOrderDetails
  };
