const {dbconn, dbstmt} = require('idb-connector');

 function getDmsCodeDb (type, code) {
		
  return new Promise(function(resolve)
  { 
  
    const sSql = 'SELECT * from dasfp@v.PROBTAB where TAVLNM  = \'' + type + '\' and TAVLOM = \'' + code + '\' with NONE';
	console.log("Sql ProbTAB: " + sSql);
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
  getDmsCodeDb: getDmsCodeDb
  };
