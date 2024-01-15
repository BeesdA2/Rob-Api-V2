  const {dbconn, dbstmt} = require('idb-connector');

 function writeLessorsDb(lib, answer) {
	 
  return new Promise(function(resolve)
  { 
   const sSql = 'INSERT INTO ' + lib.trim() + '.PROBLE (LENRLS, LENMLS) VALUES(?, ?) with NONE';
   const connection = new dbconn();
    connection.conn('*LOCAL');
  //  connection.debug(true);
   
	for (let i = 0; i < answer.lessors.length; i += 1) {    
	
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillLessor(answer.lessors[i]);
	//console.log("binding elements Lessors[" + i + "]: " + arrayElements.toString());
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

function deleteLessorsDb(lib) {
	 
  return new Promise(function(resolve)
  {  
     const sSql = 'delete from ' + lib.trim() + '.proble	  with NONE';
	
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


function fillLessor(lessor) { 

		return				[lessor.number,
						     lessor.name
						]
}	 
 
 module.exports = {
  writeLessorsDb: writeLessorsDb,
  deleteLessorsDb: deleteLessorsDb
  };
 