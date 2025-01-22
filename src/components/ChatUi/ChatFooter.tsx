import { FC, useState } from "react";
import DropDown from "./ChatButtons/DropDown";
import FileUpload from "./ChatButtons/FileUpload";
import Camera from "./ChatButtons/Camera";
import AudioRecorderComponent from "./ChatButtons/AudioRecorder";
interface ChatFooter {
  socket: any;
}
const ChatFooter: FC<ChatFooter> = ({ socket }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAudioRecorder, setShowAudioRecorder] = useState<boolean>(false);
  const [showCamera, setShowCamera] = useState<boolean>(false);

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
    console.log({ audioUri })
    console.log({ url })
    socket.send(JSON.stringify({ audio: url }))

  };

  return (
    <div className="chat-footer flex flex-row">

      <DropDown onOptionSelect={handleOptionSelect} onAudioClick={handleAudioClick} onCameraClick={handleCameraClick} />
      <FileUpload />

      {showAudioRecorder && (
        <AudioRecorderComponent setAudioUri={addAudioElement} />
      )}

      {showCamera && <Camera setImageUri={handleCameraCapture} socketAddress="ws://192.168.225.122" />}

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

    </div>
  );
};

export default ChatFooter;
