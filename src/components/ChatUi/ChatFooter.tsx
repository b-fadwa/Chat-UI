import DropDown from './ChatButtons/DropDown';
import FileUpload from './ChatButtons/FileUpload';
import InputArea from './ChatButtons/InputArea';
import SendButton from './ChatButtons/SendButton';

const ChatFooter = ({
  socket,
  sentMessage,
  handleInputChange,
  handleFileUpload,
}: {
  socket: WebSocket;
  sentMessage: string;
  handleInputChange: (message: string) => void;
  handleFileUpload: (file: File) => void;
}) => {
  // buttons
  return (
    <div className="chat-footer flex flex-row  gap-2">
      <DropDown />
      <FileUpload handleFileUpload={handleFileUpload} />
      <InputArea handleInputChange={handleInputChange} />
      <SendButton socket={socket} message={sentMessage} />
    </div>
  );
};

export default ChatFooter;
