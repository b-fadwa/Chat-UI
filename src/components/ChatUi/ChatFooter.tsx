import { useState, FC } from 'react';
import DropDown from './ChatButtons/DropDown';
import FileUpload from './ChatButtons/FileUpload';
import InputArea from './ChatButtons/InputArea';
import SendButton from './ChatButtons/SendButton';
import Camera from './ChatButtons/Camera';
import AudioRecorderComponent from './ChatButtons/AudioRecorder';
import PollModal from './ChatButtons/Poll';

interface ChatFooter {
  socket: any;
  onPollClick: () => void;
}

const ChatFooter: FC<ChatFooter> = ({ socket, onPollClick }) => {
  const [message, setMessage] = useState<any>('');
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showPoll, setShowPoll] = useState<boolean>(false); // State for PollModal visibility

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

  const handlePollSubmit = (poll: { question: string; options: string[]; allowMultiple: boolean }) => {
    socket.send(JSON.stringify({ type: 'poll', data: poll }));
    setShowPoll(false);
  };

  const handlePollClose = () => {
    setShowPoll(false);
  };

  return (
    <div className="chat-footer flex flex-row gap-2">
      <DropDown
        onOptionSelect={handleOptionSelect}
        onAudioClick={handleAudioClick}
        onCameraClick={handleCameraClick}
        onPollClick={onPollClick}
      />

      {showAudioRecorder && <AudioRecorderComponent setAudioUri={(blob: Blob) => setAudioUri(URL.createObjectURL(blob))} />}
      {showCamera && <Camera setImageUri={setImageUri} socketAddress="ws://192.168.225.122" />}

      {showPoll && (
        <PollModal
          onClose={handlePollClose}
          onSubmit={handlePollSubmit}
          isOpen={false} />
      )}

      {!showAudioRecorder && !showCamera && (
        <>
          <FileUpload handleFileUpload={setUploadedFile} />
          <InputArea handleInputChange={setMessage} />
          <SendButton socket={socket} message={message} sentFile={uploadedFile} />
        </>
      )}
    </div>
  );
};

export default ChatFooter;
