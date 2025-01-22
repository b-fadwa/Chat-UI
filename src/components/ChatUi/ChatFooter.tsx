import { useState } from 'react';
import DropDown from './ChatButtons/DropDown';
import FileUpload from './ChatButtons/FileUpload';
import InputArea from './ChatButtons/InputArea';
import SendButton from './ChatButtons/SendButton';

const ChatFooter = ({ socket }: { socket: WebSocket }) => {
  // buttons
  const [message, setMessage] = useState<any>('');
  const [uploadedFile, setUploadedFile] = useState<any>(null);

  //handle input
  const handleInputChange = (newMessage: string) => {
    console.log('from input', { newMessage });
    setMessage(newMessage);
    // setMessages((prevMessages: any) => [...prevMessages, { content: message }]);
  };

  //file upload
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setMessage({ file: file });
    // setMessages((prevMessages: any) => [...prevMessages, { content: fileMessage }]);
  };

  return (
    <div className="chat-footer flex flex-row  gap-2">
      <DropDown />
      <FileUpload handleFileUpload={handleFileUpload} />
      <InputArea handleInputChange={handleInputChange} />
      <SendButton socket={socket} message={message} sentFile={uploadedFile} />
    </div>
  );
};

export default ChatFooter;
