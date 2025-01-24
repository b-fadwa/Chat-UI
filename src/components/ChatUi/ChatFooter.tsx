import { useState, FC } from 'react';
import DropDown from './ChatButtons/DropDown';
import FileUpload from './ChatButtons/FileUpload';
import InputArea from './ChatButtons/InputArea';
import SendButton from './ChatButtons/SendButton';
import Camera from './ChatButtons/Camera';
import AudioRecorderComponent from './ChatButtons/AudioRecorder';
import { GrClearOption } from 'react-icons/gr';

interface ChatFooter {
  socket: any;
}

const ChatFooter: FC<ChatFooter> = ({ socket }) => {
  // buttons
  const [message, setMessage] = useState<any>('');
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [resetTrigger, setResetTrigger] = useState(false);

  //handle input
  const handleInputChange = (newMessage: string) => {
    setMessage(newMessage);
  };

  const handleInputClear = () => {
    setResetTrigger((prev) => !prev);
  };

  //file upload
  const handleFileUpload = (file: File | null) => {
    setUploadedFile(file);
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

  const handleCameraCapture = (uri: string) => {
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
    <div className="chat-footer-container flex flex-row gap-2 align-center">
      <div className="chat-footer flex flex-row gap-2">
        <DropDown
          onOptionSelect={handleOptionSelect}
          onAudioClick={handleAudioClick}
          onCameraClick={handleCameraClick}
        />
        {showAudioRecorder && <AudioRecorderComponent setAudioUri={addAudioElement} />}

        {showCamera && <Camera setImageUri={handleCameraCapture} />}

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
        <InputArea handleInputChange={handleInputChange} resetTrigger={resetTrigger} />
        <SendButton
          socket={socket}
          message={message}
          sentFile={uploadedFile}
          sentImage={imageUri}
          setSentFile={handleFileUpload}
          setSentImage={setImageUri}
          handleInputclear={handleInputClear}
        />
      </div>
      {/* display uploaded file */}
      {uploadedFile && (
        <div className="uploaded-file flex flex-row align-center gap-2 w-fit h-fit justify-center">
          <p>Attached File: {uploadedFile.name}</p>
          <button onClick={() => setUploadedFile(null)}>
            <GrClearOption />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatFooter;
