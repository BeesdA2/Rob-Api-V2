const {dbconn, dbstmt} = require('idb-connector');

 function getRobInterfaceDetails (lib, filiaal, applicatie, key) {
	 
  return new Promise(function(resolve)
  { 
    if(filiaal === null){
     filiaal = 0;
     };
       
    const sSql = 'SELECT * 	from ' + lib.trim() + '.robkeyf where roappl = \'' + applicatie + '\' and rokeyn = \'' + key +  '\' and ronumb = ' + filiaal + ' with NONE';
	//console.log("Sql: " + sSql);
    const connection = new dbconn();
    connection.conn('*LOCAL');
    const statement = new dbstmt(connection);     
	
    statement.exec(sSql, (x) => {
    statement.close();
      connection.disconn();
      connection.close();
    //console.log(x);
	resolve(x);    
	});
  });
 }
  module.exports = {
  getRobInterfaceDetails: getRobInterfaceDetails
  };