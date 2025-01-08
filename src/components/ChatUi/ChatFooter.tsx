import DropDown from "./ChatButtons/DropDown";
import FileUpload from "./ChatButtons/FileUpload";

const ChatFooter = () => {
    // buttons
    return <div className="chat-footer flex flex-row ">
      <DropDown />
      <FileUpload/>
    </div>;
  };
  
  export default ChatFooter;
  