import { useState, FC } from 'react';
import DropDown from './ChatButtons/DropDown';
import FileUpload from './ChatButtons/FileUpload';
import InputArea from './ChatButtons/InputArea';
import SendButton from './ChatButtons/SendButton';
import Camera from './ChatButtons/Camera';
import AudioRecorderComponent from './ChatButtons/AudioRecorder';

interface ChatFooter {
  socket: any;
}

const ChatFooter: FC<ChatFooter> = ({ socket }) => {
  // buttons
  const [message, setMessage] = useState<any>('');
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);

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

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleAudioClick = () => {
    setShowAudioRecorder(!showAudioRecorder);
  };

  const handleCameraClick = () => {
    setShowCamera(!showCamera);
  };

  const handleCameraCapture = (uri: string | null) => {
    setImageUri(uri);
  };

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUri(url);
    console.log({ audioUri });
    console.log({ url });
    socket.send(JSON.stringify({ audio: url }));
  };

  return (
    <div className="chat-footer flex flex-row  gap-2">
      <DropDown
        onOptionSelect={handleOptionSelect}
        onAudioClick={handleAudioClick}
        onCameraClick={handleCameraClick}
      />
      {showAudioRecorder && <AudioRecorderComponent setAudioUri={addAudioElement} />}

      {showCamera && (
        <Camera setImageUri={handleCameraCapture} socketAddress="ws://192.168.225.122" />
      )}

      {/* {imageUri && (
        <MessageBox
          {...({
            position: "left",
            type: "photo",
            title: "User",
            data: {
              uri: imageUri,
            },
          } as any)}
        />
      )} */}
      <FileUpload handleFileUpload={handleFileUpload} />
      <InputArea handleInputChange={handleInputChange} />
      <SendButton socket={socket} message={message} sentFile={uploadedFile} />
    </div>
  );
};

export default ChatFooter;
