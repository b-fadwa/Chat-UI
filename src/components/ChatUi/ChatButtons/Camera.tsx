import { FC, useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

interface WebcamModalProps {
  isOpen: boolean;
  onClose: () => void;
  setImageUri: (uri: any) => void;
}

const WebcamModal: FC<WebcamModalProps> = ({ isOpen, onClose, setImageUri }) => {
  const [imageUri, setCapturedImageUri] = useState<string | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImageUri(imageSrc);
      setImageUri(imageSrc);
    }
  }, [webcamRef, setImageUri]);

  const handleRetake = () => {
    setCapturedImageUri(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative overflow-hidden">
        <div className="flex flex-col items-center mb-6">
          {imageUri ? (
            <img
              src={imageUri}
              alt="Captured"
              className="rounded-lg shadow-md w-full mb-4"
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg shadow-md w-full mb-4"
            />
          )}
        </div>

        <div className="flex justify-between items-center">
          {imageUri ? (
            <>
              <button
                onClick={handleRetake}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg px-6 py-2 font-semibold transition-all duration-300"
              >
                Retake
              </button>
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-semibold transition-all duration-300"
              >
                Done
              </button>
            </>
          ) : (
            <button
              onClick={capture}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 font-semibold transition-all duration-300 w-full"
            >
              Capture
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 text-3xl font-semibold hover:text-gray-700 transition-all duration-200"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default WebcamModal;
