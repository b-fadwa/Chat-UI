import { FC } from 'react';
import { IoIosSend } from 'react-icons/io';

interface SendButtonProps {
  socket: WebSocket;
  message: string;
  sentFile: File;
}

const SendButton: FC<SendButtonProps> = ({ socket, message, sentFile }) => {
  const sendMessage = () => {
    if (message && socket) {
      if (sentFile) { 
        const reader = new FileReader();  
        reader.onload = () => {
          const base64FileContent = reader.result?.toString();
          const payload = {
            content: message,
            fileName: sentFile.name,
            fileType: sentFile.type,
            fileContent: base64FileContent, // Add Base64-encoded content
          };
  
          socket.send(JSON.stringify({file:payload.fileContent}));
          console.log('File sent as Base64:', payload);
        };  
        reader.readAsDataURL(sentFile); // Read the file as a Base64 data URL
      } else {
        console.log('Message sent:', message);        
        socket.send(JSON.stringify({ content: message }));
      }
    }
  };
  
  

  return (
    <button className="p-4 rounded bg-gray-100" onClick={sendMessage}>
      <IoIosSend className="text-xl" />
    </button>
  );
};

export default SendButton;
