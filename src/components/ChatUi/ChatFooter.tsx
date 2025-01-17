import DropDown from './ChatButtons/DropDown';
import FileUpload from './ChatButtons/FileUpload';
import InputArea from './ChatButtons/InputArea';

const ChatFooter = ({
  handleInputChange,
  handleFileUpload,
}: {
  handleInputChange: (message: string) => void;
  handleFileUpload: (file: File) => void;
}) => {
  // buttons
  return (
    <div className="chat-footer flex flex-row ">
      <DropDown />
      <FileUpload handleFileUpload={handleFileUpload} />
      <InputArea handleInputChange={handleInputChange} />
    </div>
  );
};

export default ChatFooter;
