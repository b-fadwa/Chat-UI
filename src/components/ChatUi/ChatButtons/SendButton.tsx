import { FC } from 'react';
import { IoIosSend } from 'react-icons/io';

interface SendButtonProps {
  socket: WebSocket;
  message: string;
  sentFile: File;
  sentImage: string;
  setSentFile: (file: File | null) => void;
  setSentImage: (image: string) => void;
  handleInputclear: () => void;
}

const SendButton: FC<SendButtonProps> = ({
  socket,
  message,
  sentFile,
  sentImage,
  setSentFile,
  setSentImage,
  handleInputclear,
}) => {
  const sendMessage = () => {
    if (socket) {
      if (sentFile) {
        console.log('Sending file:', sentFile);
        const reader = new FileReader();
        reader.onload = () => {
          const base64FileContent = reader.result?.toString();
          const payload = {
            content: message,
            fileName: sentFile.name,
            fileType: sentFile.type,
            fileContent: base64FileContent, // Add Base64-encoded content
          };
          socket.send(JSON.stringify({ file: payload.fileContent }));
        };
        reader.readAsDataURL(sentFile); // Read the file as a Base64 data URL
        setSentFile(null);
      }
      if (sentImage != '') {
        console.log('Sending image here:', sentImage);
        socket.send(JSON.stringify({ image: sentImage }));
        setSentImage('');
      }
      if (message) {
        console.log('Message sent:', message);
        socket.send(JSON.stringify({ content: message }));
        handleInputclear();
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
