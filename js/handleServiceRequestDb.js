const {dbconn, dbstmt} = require('idb-connector');
function getServiceRequestHeaderDb (lib, filiaal, order) {
	 
  return new Promise(function(resolve)
  {          
     const sSql = 'SELECT * 	from ' +  lib.trim()  + '.probwo where wofill = ' + filiaal + ' and wowonr = ' + order + ' with NONE';

	//console.log("Sql probwo: " + sSql);
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
 
function updateServiceRequestHeaderDb (lib, filiaal, order, answer) {
	 
  return new Promise(function(resolve)
  {          
    const sSql = 'UPDATE ' + lib.trim()  + '.probwo set WOOPNR = ?, WOGUID = ?, WOCOID = ?, WODTOP = ?, WOTYDO = ?, WODTVZ = ?,  WOTYDVZ = ?, WOTOTB = ?, WOTXTL = ?, WOSTWO = ?, WOWOST = ? where wofill = ' + filiaal + ' and wowonr = ' + order + ' with NONE';
	console.log("Status header:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
	const statement = new dbstmt(connection);     
	arrayElements = fillHeader(answer); 
     console.log("binding elements : " + arrayElements.toString());
	
    statement.prepare(sSql, () => {
		
	statement.bindParameters(arrayElements , () => {	
						 
    statement.exec(sSql, (x) => {
    statement.close();
      connection.disconn();
      connection.close();
    //console.log(x);
	resolve(x);    
	});
  });
 });
 }); 
  }

function updateServiceRequestLogRequest (guid, lib, request) {
	 
  return new Promise(function(resolve)
  {          
    const sSql = 'UPDATE ' + lib.trim()  + '.bolsreq set SRREQ = \'' + request + '\' where SRGUID = \'' + guid  + '\' '+ ' with NONE';
	//console.log("Log BOLSreq:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
 	const statement = new dbstmt(connection); 
   
   statement.execSync(sSql, (x) => {

    statement.close();
      connection.disconn();
      connection.close();
    //console.log(x);
	resolve(x);    
	});
	});
}

function updateServiceRequestLogResponse (guid, lib, response) {
	 
  return new Promise(function(resolve)
  {          
    const sSql = 'UPDATE ' + lib.trim()  + '.bolsreq set SRRES = \'' + response + '\' where SRGUID = \'' + guid  + '\' '+ ' with NONE';
	//console.log("Log BOLSreq:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
  	const statement = new dbstmt(connection); 
   
   statement.execSync(sSql, (x) => {

    statement.close();
      connection.disconn();
      connection.close();
    //console.log(x);
	resolve(x);    
	});
	});
}

async function getServiceRequestLinesDb (lib, filiaal, order, parent_activiteit, parent_bewerking, locatie1, locatie2) {
	 
  return new Promise(function(resolve)
  {
  var sSql = "";	  
  if (locatie1.trim() == "") {	  
  sSql = 'SELECT * 	from ' + lib.trim()  + '.probwoac where acfill = ' + filiaal + ' and acwonr = ' + order + ' and acprta = ' + parent_activiteit 
	+ ' and acprtb = \'' + parent_bewerking  + '\' '	
	+ ' with NONE';
	//lib.trim() 
  }
  else {
	sSql = 'SELECT * 	from ' + lib.trim()  + '.probwoac where acfill = ' + filiaal + ' and acwonr = ' + order + ' and acprta = ' + parent_activiteit 
	+ ' and acprtb = \'' + parent_bewerking  + '\' '
    + ' and acpa1 = \'' + (locatie1 != null ? locatie1 : "")   + '\' '	
	+ ' and acpa2 = \'' + (locatie2 != null ? locatie2 : "")   + '\' '		
	+ ' with NONE';  
  }
	  

	//console.log("Sql probwoac: " + sSql);
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
 function getActiviteitDb(lib, filiaal, order, hoofdactiviteit, activiteit, bewerking, locatie1, locatie2){
 return new Promise(function(resolve)
  {          
    const sSql = 'SELECT * 	from ' + lib.trim()  + '.probwoac where acfill = ' + filiaal + ' and acwonr = ' + order 
	+ ' and acact = '   + activiteit 
	+ ' and achfda = '  + hoofdactiviteit 
    + ' and acbew = \'' + bewerking  + '\' '	
	+ ' and acpa1 = \'' + (locatie1 != null ? locatie1 : "")   + '\' '	
	+ ' and acpa2 = \'' + (locatie2 != null ? locatie2 : "")   + '\' '	
	+ ' with NONE';

	console.log("Sql probwoac: " + sSql);
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
 function getReplacementTiresDb (lib, filiaal, order) {
	 
  return new Promise(function(resolve)
  {          
    const sSql = 'SELECT * 	from ' + lib.trim()  + '.probwoba where bafill = ' + filiaal + ' and bawonr = ' + order + ' with NONE';

	console.log("Sql probwoba: " + sSql);
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
 
 function getUnmountedTiresDb (lib, filiaal, order) {
	 
  return new Promise(function(resolve)
  {          
    const sSql = 'SELECT * from ' + lib.trim()  + '.probwobd where bdfill = ' + filiaal + ' and bdwonr = ' + order + ' with NONE';

	console.log("Sql probwobd: " + sSql);
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
 
 function getMountedTiresDb (lib, filiaal, order) {
	 
  return new Promise(function(resolve)
  {          
    const sSql = 'SELECT * from ' + lib.trim()  + '.probwobw where bwfill = ' + filiaal + ' and bwwonr = ' + order + ' with NONE';

	console.log("Sql probwobw: " + sSql);
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
 function updateServiceRequestLinesDb (lib, filiaal, werkorder, answer) {
	 
  return new Promise(function(resolve)
  { 

   const connection = new dbconn();
    connection.conn('*LOCAL');
    //connection.debug(true);
   
   //loop through components
	for (let i = 0; i < answer.data.components.length; i += 1) {    
		const sSql = 'UPDATE ' + lib.trim() + '.PROBWOAC SET ACSTAT = ?, ACAFW01 = ?, ACAFW02 = ?, ACAFW03 = ?, ACAFW04 = ?, ACAFW05 = ?, ACAFW06 = ?, ACAFW07 = ?, ACAFW08 = ?, ACAFW09 = ?, ACAFW10 = ?  where acfill = ' + filiaal + ' and acwonr = ' + werkorder + ' and acguid = \'' + answer.data.components[i].id + '\'  with NONE';
	
	//console.log("sql probwoac: " + sSql);
	const statement = new dbstmt(connection);     

	// Array vullen met elementen
	arrayElements = fillLine(answer.data.components[i]);
	//console.log("binding elements PROBWOAC : " + arrayElements.toString());
    statement.prepareSync(sSql);
	statement.bindParametersSync(arrayElements);						 
	statement.executeSync((x) => {	
	statement.close();
	//console.log("insert answer: " + x);    
	});	
	};
     connection.disconn();
     connection.close();
	 resolve('Klaar'); 	
  });
 }

function fillLine(answer) { 

if(answer.denialReasons != undefined){
	return 		[getStatusLine(answer.status.code), 
						 (answer.denialReasons[0] != undefined ? answer.denialReasons[0].code:""),	
						 (answer.denialReasons[1] != undefined ? answer.denialReasons[1].code:""),	
						 (answer.denialReasons[2] != undefined ? answer.denialReasons[2].code:""),	
						 (answer.denialReasons[3] != undefined ? answer.denialReasons[3].code:""),	
						 (answer.denialReasons[4] != undefined ? answer.denialReasons[4].code:""),	
						 (answer.denialReasons[5] != undefined ? answer.denialReasons[5].code:""),	
						 (answer.denialReasons[6] != undefined ? answer.denialReasons[6].code:""),	
						 (answer.denialReasons[7] != undefined ? answer.denialReasons[7].code:""),	
						 (answer.denialReasons[8] != undefined ? answer.denialReasons[8].code:""),	
						 (answer.denialReasons[9] != undefined ? answer.denialReasons[9].code:"")
						 ];
}
else
{
return 		[getStatusLine(answer.status.code), 
			"", "", "", "", "", "", "", "", "", ""];	
}
}
function pad(num) { 
  return ("0"+num).slice(-2);
}
function getTimeFromDate(timestamp) {
  var date = new Date(timestamp);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  return pad(hours)+":"+pad(minutes)+":"+pad(seconds)
}
 
 
function fillHeader(answer) { 
			return 		[answer.data.serviceRequestNumber,
						 answer.data.id, 
						 answer.data.id, 
						 (answer.data.creationTimeStamp != undefined ? new Date(answer.data.creationTimeStamp).toISOString().slice(0, 10): "0001-01-01"),
						 (answer.data.creationTimeStamp != undefined ? getTimeFromDate(answer.data.creationTimeStamp ) : "00:00:00"),
						 (answer.data.creationTimeStamp != undefined ? new Date(answer.data.creationTimeStamp).toISOString().slice(0, 10): "0001-01-01"),
						 (answer.data.creationTimeStamp != undefined ? getTimeFromDate(answer.data.creationTimeStamp ) : "00:00:00"),
						 answer.data.invoicing.totalAmountApproved,
						 (answer.data.remarks.lessor != undefined ? answer.data.remarks.lessor : ""),
						 getStatusHeader(answer.data.status),
						 getStatusInvoice(answer.data.invoicing.status)
						 ];
}
function pad(num) { 
  return ("0"+num).slice(-2);
}
function getTimeFromDate(timestamp) {
  var date = new Date(timestamp);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  return pad(hours)+":"+pad(minutes)+":"+pad(seconds)
}

function getStatusHeader(status) {
	
	switch(status) {
		// Moet nog vervangen worden door een tabel, als er meer tijd is 04-06-2020
  case "Draft":
	return "LEV";	
  case "ApprovalRequested":
    return "LM";
  case "Modified":
    return "LEV";
   case "Approved":
    return "ACC";
 case "Denied":
    return "NAC";
 
  default:
  return "LEV";
    // code block
} 
}

function getStatusInvoice(status) {
	
	switch(status) {
		// Moet nog vervangen worden door een tabel, als er meer tijd is 04-06-2020
  case "NotReadyForInvoicing":
	return "EF";	
  case "ReadyForInvoicing":
    return "T";
  case "Invoiced":
    return "G";
    // code block
} 
}
function getStatusLine(status) {
	
	switch(status) {
		// Moet nog vervangen worden door een tabel, als er meer tijd is 04-06-2020
		case "Entered":
		//The line has been created but has never been sent to a lessor before
		return "0";
		case "Changed":
		//The line has been mutated and was sent to a lessor before
		return "1";
		case "Lessor":
		//The line is currently being reviewed by the lessor
		return "6";
		case "Approved":
		//The line is approved by the lessor
		return "4";
		case "CallLessor":
		//The line has been disapproved by the lessor and the lessor requests to be called by telephone
		return "5";
		case "LessorWillCall":
		//The line has been disapproved by the lessor and the lessor will make a telephone call
		return "8";
		case "Cancelled":
		//The line has been requested to be cancelled, but has not yet been reviewd by the lessor
		return "9";
		case "CancellationApproved":
		//The line has been requested to be cancelled and the lessor has approved
		return "10";
		case "CancellationDenied":
		//The line has been requested to be cancelled and the lessor has disapproved
		return "11"; 
		default:
		// Default status
		return "0";
} 
}
 module.exports = {
  getServiceRequestHeaderDb : getServiceRequestHeaderDb,
  getServiceRequestLinesDb : getServiceRequestLinesDb,
  getActiviteitDb : getActiviteitDb,
  getReplacementTiresDb:getReplacementTiresDb,
  getUnmountedTiresDb:getUnmountedTiresDb,
  getMountedTiresDb:getMountedTiresDb,
  updateServiceRequestHeaderDb : updateServiceRequestHeaderDb,
  updateServiceRequestLogRequest : updateServiceRequestLogRequest, 
  updateServiceRequestLogResponse : updateServiceRequestLogResponse, 
  updateServiceRequestLinesDb : updateServiceRequestLinesDb
  };
 