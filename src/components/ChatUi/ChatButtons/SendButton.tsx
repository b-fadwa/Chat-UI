import { FC } from 'react';
import { IoIosSend } from 'react-icons/io';

interface SendButtonProps {
  socket: WebSocket;
  message: string;
}

const SendButton: FC<SendButtonProps> = ({ socket, message }) => {
  const sendMessage = () => {
    if (message && socket) {
      console.log('message sent!', JSON.stringify({ content: message }), socket);
      socket.send(JSON.stringify({ content: message }));
    }
  };

  return (
    <button className="p-4 rounded bg-gray-100" onClick={sendMessage}>
      <IoIosSend className="text-xl" />
    </button>
  );
};

export default SendButton;
