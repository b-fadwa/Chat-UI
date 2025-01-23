import { FC, useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

interface WebcamCaptureProps {
  setImageUri: (uri: any) => void;
}

const WebcamCapture: FC<WebcamCaptureProps> = ({ setImageUri }) => {
  const [imageUri, setCapturedImageUri] = useState<any>(null);
  const [isCaptured, setIsCaptured] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [showCapturedPhoto, setShowCapturedPhoto] = useState<boolean>(true);
  const webcamRef = useRef<Webcam | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImageUri(imageSrc);
      setImageUri(imageSrc);
      setIsCaptured(true);
      handleSend();
    }
  }, [webcamRef]);

  const handleSend = () => {
    setIsSent(true);
    setShowCapturedPhoto(false);
    setIsCaptured(false);
  };

  const handleRetake = () => {
    setCapturedImageUri(null);
    setIsCaptured(false);
    setShowCapturedPhoto(true);
  };

  return (
    <div>
      {!isSent && !isCaptured ? (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
        />
      ) : null}

      {isCaptured && !isSent && showCapturedPhoto && (
        <div className="capturedPhoto">
          <img src={imageUri ?? ''} alt="Captured" width="100%" />
        </div>
      )}

      {!isSent && !isCaptured ? <button onClick={capture}>Capture Photo</button> : null}

      {isCaptured && !isSent && (
        <>
          <button onClick={handleRetake}>Retake</button>
        </>
      )}
    </div>
  );
};

export default WebcamCapture;
