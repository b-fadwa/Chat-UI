import { useState, FC } from 'react';
import DropDown from './ChatButtons/DropDown';
import FileUpload from './ChatButtons/FileUpload';
import InputArea from './ChatButtons/InputArea';
import SendButton from './ChatButtons/SendButton';
import Camera from './ChatButtons/Camera';
import AudioRecorderComponent from './ChatButtons/AudioRecorder';
import { GrClearOption } from 'react-icons/gr';
import { MessageBox } from 'react-chat-elements';
// import PollModal from './ChatButtons/Poll';

interface ChatFooter {
  socket: any;
  onPollClick: () => void;
}

const ChatFooter: FC<ChatFooter> = ({ socket, onPollClick }) => {
  const [message, setMessage] = useState<any>('');
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string>('');
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [showPoll, setShowPoll] = useState<boolean>(false); // State for PollModal visibility

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

    if (option === 'audio') {
      setShowAudioRecorder(true);
      setShowCamera(false);
    } else if (option === 'camera') {
      setShowCamera(true);
      setShowAudioRecorder(false);
    } else if (option === 'poll') {
      setShowCamera(false);
      setShowAudioRecorder(false);
      setShowPoll(true);
    } else {
      setShowAudioRecorder(false);
      setShowCamera(false);
    }
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

  const addAudioElement = async (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob); // Convert blob to Base64
    reader.onloadend = () => {
      const audioBase64String = reader.result as string;
      if (audioBase64String) {
        setAudioUri(audioBase64String);
        socket.send(JSON.stringify({ audio: audioBase64String }));
        setShowAudioRecorder(false);
      }
    };
  };

  return (
    <div className="chat-footer flex flex-col gap-2 align-center">
      {/* show uploaded file and image here */}
      {imageUri && (
        <div className="flex flex-row justify-end">
          <MessageBox
            {...({
              position: 'right',
              type: 'photo',
              title: 'You',
              data: {
                uri: imageUri,
              },
            } as any)}
          />
          <button onClick={() => setImageUri('')}>
            <GrClearOption className="text-2xl text-gray-500" />
          </button>
        </div>
      )}
      {uploadedFile && (
        <div className="flex flex-row justify-end">
          <MessageBox
            {...({
              position: 'right',
              type: 'file',
              title: 'You',
              text: uploadedFile.name,
              data: {
                uri: uploadedFile.uri,
                size: uploadedFile.size,
              },
            } as any)}
          />
          <button onClick={() => setUploadedFile(null)}>
            <GrClearOption className="text-2xl text-gray-500" />
          </button>
        </div>
      )}
      <div className="chat-footer flex flex-row gap-2">
        <DropDown
          onOptionSelect={handleOptionSelect}
          onAudioClick={handleAudioClick}
          onCameraClick={handleCameraClick}
          onPollClick={onPollClick}
        />
        {showCamera && <Camera setImageUri={handleCameraCapture} />}
        {showAudioRecorder && <AudioRecorderComponent setAudioUri={addAudioElement} />}
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
    </div>
  );
};

export default ChatFooter;
