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
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not open or not initialized.');
            return;
        }

        // Send file if exists
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
                socket.send(JSON.stringify({ type: 'file', data: payload }));
                setSentFile(null); // Reset file only after sending
            };
            reader.readAsDataURL(sentFile);
            return; // Wait for file reading
        }

        // Send image if exists
        if (sentImage) {
            console.log('Sending image:', sentImage);
            socket.send(JSON.stringify({ type: 'image', data: sentImage }));
            setSentImage(''); // Reset image after sending
            return;
        }

        // Send poll if exists
        if (sentPoll) {
            console.log('Sending poll:', sentPoll);
            socket.send(JSON.stringify({ type: 'poll', data: sentPoll }));
            setSentPoll(null); // Reset poll after sending
            return;
        }

        // Send message if exists
        if (message.trim()) {
            console.log('Sending message:', message);
            socket.send(JSON.stringify({ type: 'message', content: message }));
            handleInputclear();
        }
    };

    return (
        <button className="p-4 rounded bg-gray-100" onClick={sendMessage}>
            <IoIosSend className="text-xl" />
        </button>
    );
};

export default SendButton;
