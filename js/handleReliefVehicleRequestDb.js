const {dbconn, dbstmt} = require('idb-connector');
function getReliefVehicleRequestDb (lib, filiaal, order) {
	 
  return new Promise(function(resolve)
  {          
     const sSql = 'SELECT * 	from ' +  lib.trim()  + '.probvv where vvfill = ' + filiaal + ' and vvofnr = ' + order + ' with NONE';

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
 
function updateReliefVehicleRequestDb (lib, filiaal, verhuurorder, answer) {
	 
  return new Promise(function(resolve)
  {          
    const sSql = 'UPDATE ' + lib.trim()  + '.probvv set VVOPNR = ?, VVCOID = ?, VVDTOP = ?, VVTYDO = ?, VVDTVZ = ?,  VVTYDVZ = ?, VVTOTB = ?, VVTXTL = ?, VVSTWO = ?, VVWOST = ? where VVfill = ' + filiaal + ' and VVO = ' + verhuurorder + ' with NONE';
	console.log("Status header:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
    connection.debug(true);
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
  
function updateReliefVehicleStatusDb (lib, filiaal, id, answer) {
	 
  return new Promise(function(resolve)
  {          
    const sSql = 'UPDATE ' + lib.trim()  + '.probvv set VVOPNR = ?, VVCOID = ?, VVDTOP = ?, VVTYDO = ?, VVDTVZ = ?,  VVTYDVZ = ?, VVTOTB = ?, VVTXTL = ?, VVSTWO = ?, VVWOST = ? where VVfill = ' + filiaal + ' and VVCOID = ' + id + ' with NONE';
	console.log("Status header:  " + sSql)
  const connection = new dbconn();
    connection.conn('*LOCAL');
    connection.debug(true);
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

function updateReliefVehicleRequestLogRequest (guid, lib, request) {
	 
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

function updateReliefVehicleRequestLogResponse (guid, lib, response) {
	 
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
  getReliefVehicleRequestDb : getReliefVehicleRequestDb,
  updateReliefVehicleRequestDb : updateReliefVehicleRequestDb,
  updateReliefVehicleStatusDb : updateReliefVehicleStatusDb,
  updateReliefVehicleRequestLogRequest : updateReliefVehicleRequestLogRequest, 
  updateReliefVehicleRequestLogResponse : updateReliefVehicleRequestLogResponse, 
  };
 