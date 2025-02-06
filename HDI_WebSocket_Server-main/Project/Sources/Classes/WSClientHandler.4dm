Class constructor($countClient : Integer; $request : Object)
	/// Class that defines a connection behavior 
	
	// Creates the user name that appear in conversation
	This:C1470.name:="Client"+String:C10($countClient)
	// Stores the remote address
	This:C1470.address:=$request.remoteAddress
	
	//will be used to format data
Function formatData($message : cs:C1710.MessagesEntity) : Object
	var $formattedData : Object:=New object:C1471()
	//TRACE
	If (($message.Audio#Null:C1517) && (BLOB size:C605($message.Audio)>0))
		$formattedData.audioBase64:=BLOB to text:C555($message.Audio; Base64 encoding)
	Else 
		$formattedData.audioBase64:=""  // Handle missing audio
	End if 
	If (($message.Image#Null:C1517) && (BLOB size:C605($message.Image)>0))
		$formattedData.imageBase64:=BLOB to text:C555($message.Image; Base64 encoding)
	Else 
		$formattedData.imageBase64:=""  // Handle missing image
	End if 
	If (($message.File#Null:C1517) && (BLOB size:C605($message.File)>0))
		$formattedData.fileBase64:=BLOB to text:C555($message.File; Base64 encoding)
	Else 
		$formattedData.fileBase64:=""  // Handle missing file
	End if 
	return $formattedData
	
	//Defines a connection behavior
Function onOpen($ws : 4D:C1709.WebSocketConnection; $info : Object)
	var $client : Object
	var $message : cs:C1710.MessagesEntity
	var $data : Object
	var $messages : cs:C1710.MessagesSelection:=ds:C1482.Messages.all()
	$ws.wss.handler.logFile("New client connected: "+This:C1470.name+" - "+This:C1470.address)
	//For each ($client; $ws.wss.connections)
	//If ($client.id#$ws.id)
	For each ($message; $messages)
		$data:=This:C1470.formatData($message)
		$ws.send(JSON Stringify:C1217({sender: String:C10($message.Sender); receiver: String:C10($message.Receiver); \
			content: $message.Content; image: $data.imageBase64; audio: $data.audioBase64; file: $data.fileBase64; sentAt: Time:C179($message.sentAt); \
			sentThe: $message.sentThe; dateStamp: String:C10($message.sentThe; ISO date GMT:K1:10; Time:C179($message.sentAt))})+"\n")
		//End for each 
		//End if 
	End for each 
	
Function onMessage($ws : Object; $info : Object)
	var $client : Object
	var $message : cs:C1710.MessagesEntity
	var $data : Variant
	var $formattedData : Object
	SET BLOB SIZE:C606(vxBlob;0)
	// Resend the message to all clients
	For each ($client; $ws.wss.connections)
		//If ($client.id#$ws.id)
		//$client.send($client.handler.myMessage(This.address; $client.handler.address); String($info.data))
		$message:=ds:C1482.Messages.new()
		$message.Sender:=This:C1470.name
		$message.Receiver:=$client.handler.name
		$message.ReceiverAddr:=$client.handler.address
		$message.SenderAddr:=This:C1470.address
		$message.sentThe:=Current date:C33
		$message.sentAt:=Current time:C178
		Try
			$data:=JSON Parse:C1218($info.data)
		Catch
			$data:={audio: $info.data}
		End try
		Case of 
			: (String:C10($data.content)#"" && Not:C34(Undefined:C82($data.content)))
				$message.Content:=$data.content
			: ($data.image#"" && Not:C34(Undefined:C82($data.image)))
				TEXT TO BLOB:C554($data.image; vxBlob)
				$message.Image:=vxBlob
			: ($data.file#"" && Not:C34(Undefined:C82($data.file)))
				TEXT TO BLOB:C554($data.file; vxBlob)
				$message.File:=vxBlob
			: ($data.audio#"" && Not:C34(Undefined:C82($data.audio)))
				TEXT TO BLOB:C554($data.audio; vxBlob; UTF8 C string:K22:15)
				$message.Audio:=vxBlob
		End case 
		$message.save()
		$formattedData:=This:C1470.formatData($message)
		$client.send(JSON Stringify:C1217({sender: String:C10($message.Sender); receiver: String:C10($message.Receiver); content: $message.Content; \
			file: $formattedData.fileBase64; audio: $formattedData.audioBase64; image: $formattedData.imageBase64; sentAt: Time:C179($message.sentAt); \
			sentThe: $message.sentThe; dateStamp: String:C10($message.sentThe; ISO date GMT:K1:10; Time:C179($message.sentAt))})+"\n")
		//End if 
	End for each 
	
	// Called when an error occured
Function onError($ws : Object; $info : Object)
	$ws.wss.handler.logFile("*** Error: "+This:C1470.name+" - "+This:C1470.address+" - "+JSON Stringify:C1217($info))
	
	// Called when the session is closed
Function onTerminate($ws : Object; $info : Object)
	var $client : Object
	$ws.wss.handler.logFile("Connection closed: "+This:C1470.name+" - "+String:C10(This:C1470.address)+" - code: "+String:C10($info.code)+" "+String:C10($info.reason))
	// resend the message "new client connected" to all clients
	For each ($client; $ws.wss.connections)
		If ($client.id#$ws.id)
			$client.send(JSON Stringify:C1217({content: String:C10(This:C1470.name)+" disconnected!"}))
		End if 
	End for each 
	