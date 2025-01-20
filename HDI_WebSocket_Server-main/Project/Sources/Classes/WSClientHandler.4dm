Class constructor($countClient : Integer; $request : Object)
	/// Class that defines a connection behavior 
	var $colors : Collection
	
	// Creates the user name that appear in conversation
	This:C1470.name:="Client"+String:C10($countClient)
	// Definition of the color text for the current user in conversation
	$colors:=New collection:C1472("aqua"; "blue"; "fuchsia"; "gray"; "green"; "lime"; "maroon"; "navy"; "olive"; "purple"; "silver"; "teal")
	This:C1470.color:=$colors[Mod:C98($countClient; $colors.length)]
	
	// Stores the remote address
	This:C1470.address:=$request.remoteAddress
	
	
	/// Defines a connection behavior
Function onOpen($ws : 4D:C1709.WebSocketConnection; $info : Object)
	var $client : Object
	var $message : cs:C1710.MessagesEntity
	var $messages : cs:C1710.MessagesSelection:=ds:C1482.Messages.all()
	
	$ws.wss.handler.logFile("New client connected: "+This:C1470.name+" - "+This:C1470.address)
	
	// Send a message to the client chat to let him know he is connected
	//$ws.send(This.serverMessage("Welcome on the chat!"))
	For each ($message; $messages)
		
		//$ws.send($message.Content+$message.ReceiverAddr+$message.SenderAddr+"\n")
		$ws.send(JSON Stringify:C1217({sender: String:C10($message.SenderAddr); receiver: String:C10($message.ReceiverAddr); content: $message.Content; image: $message.Image; file: $message.File})+"\n")
	End for each 
	
	// Send the message "new client connected" to all clients
	For each ($client; $ws.wss.connections)
		If ($client.id#$ws.id)
			$client.send(This:C1470.myMessage(This:C1470.color; String:C10(This:C1470.name)+" connected!"))
		End if 
	End for each 
	
	
	// Called each time the user sends a message
Function onMessage($ws : Object; $info : Object)
	var $client : Object
	var $message : cs:C1710.MessagesEntity
	var $data : Variant
	SET BLOB SIZE:C606(vxBlob; 0)
	
	// Resend the message to all clients
	For each ($client; $ws.wss.connections)
		If ($client.id#$ws.id)
			$client.send($client.handler.myMessage(This:C1470.color; This:C1470.address; $client.handler.address; String:C10($info.data)))
			$message:=ds:C1482.Messages.new()
			$message.Sender:=This:C1470.name
			$message.Receiver:=$client.handler.name
			$message.ReceiverAddr:=$client.handler.address
			$message.SenderAddr:=This:C1470.address
			
			//$data:=(Value type($info.data)#2) ? JSON Parse($info.data) : $info.data
			TRACE:C157
			Try
				$data:=JSON Parse:C1218($info.data)
			Catch
				$data:={content: $info.data}
			End try
			
			Case of 
				: ($data.content#"")
					$message.Content:=$data.content
				: ($data.image#"")
					$message.Image:=$data.image
				: ($data.file#"")
					TEXT TO BLOB:C554($data.file; vxBlob)
					$message.File:=vxBlob
				: ($data.audio#"")
					TEXT TO BLOB:C554($data.audio; vxBlob)
					$message.Audio:=vxBlob
			End case 
			
			$message.save()
			$ws.send(JSON Stringify:C1217({sender: String:C10($message.SenderAddr); receiver: String:C10($message.ReceiverAddr); content: $message.Content; file: $message.File; audio: $message.Audio; image: $message.Image})+"\n")
		End if 
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
			$client.send(This:C1470.myMessage(This:C1470.color; String:C10(This:C1470.name)+" disconnected!"))
		End if 
	End for each 
	
	/// creates a server type message (display in red in the chat)
Function serverMessage($message : Text) : Text
	return "<p style='color:red'>"+String:C10($message)+"</p>"
	
	/// Creates a message with a defined user color 
Function myMessage($color : Text; $sender : Text; $receiver : Text; $message : Text) : Text
	return JSON Stringify:C1217({sender: $sender; receiver: $receiver; content: $message})+"\n"