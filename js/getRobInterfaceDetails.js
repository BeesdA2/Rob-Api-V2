const {dbconn, dbstmt} = require('idb-connector');

 function getRobInterfaceDetails (lib, filiaal, applicatie, key) {
	 
  return new Promise(function(resolve)
  { 
    if(filiaal === null){
     filiaal = 0;
     };
       
    const sSql = 'SELECT * 	from ' + lib.trim() + '.apikeyf where apappl = \'' + applicatie + '\' and apkeyn = \'' + key +  '\' and apnumb = ' + filiaal + ' with NONE';
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

 function getRobInterfaceDetails2 (lib, filiaal, applicatie, key) {
	 
  return new Promise(function(resolve)
  { 
    if(filiaal === null){
     filiaal = 0;
     };
       
    const sSql = 'SELECT * 	from ' + lib.trim() + '.oauthkeyf where oaappl = \'' + applicatie + '\' and oakeyn = \'' + key +  '\' and oafiln = ' + filiaal + ' with NONE';
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
  getRobInterfaceDetails: getRobInterfaceDetails,
  getRobInterfaceDetails2: getRobInterfaceDetails2  
  };
