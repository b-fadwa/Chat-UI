import { FC } from 'react';
import { IoIosSend } from 'react-icons/io';

interface SendButtonProps {
  socket: WebSocket;
  message: string;
  sentFile: File | null;
  sentImage: string;
  sentPoll: object | null;
  setSentFile: (file: File | null) => void;
  setSentImage: (image: string) => void;
  setSentPoll: (poll: object | null) => void;
  handleInputclear: () => void;
}

const SendButton: FC<SendButtonProps> = ({
  socket,
  message,
  sentFile,
  sentImage,
  sentPoll,
  setSentFile,
  setSentImage,
  setSentPoll,
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
            fileContent: base64FileContent,
          };
          socket.send(JSON.stringify({ file: payload.fileContent }));
        };
        reader.readAsDataURL(sentFile);
        setSentFile(null);
      }
      if (sentImage != '' && sentImage != null) {
        console.log('Sending image here:', sentImage);
        socket.send(JSON.stringify({ image: sentImage }));
        setSentImage('');
      }
      if (message) {
        console.log('Message sent:', message);
        socket.send(JSON.stringify({ content: message }));
        handleInputclear();
      }
      if (sentPoll != null && sentPoll) {
        console.log('Sending poll here:', sentPoll);
        socket.send(JSON.stringify({ poll: sentPoll }));
        setSentPoll(null);
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
