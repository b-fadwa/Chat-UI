import { FC, useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

interface WebcamCaptureProps {
    setImageUri: (uri: any) => void;
    socketAddress: string;
}

const WebcamCapture: FC<WebcamCaptureProps> = ({ setImageUri, socketAddress }) => {
    const [imageUri, setCapturedImageUri] = useState<any>(null);
    const [isCaptured, setIsCaptured] = useState<boolean>(false);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [showCapturedPhoto, setShowCapturedPhoto] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const webcamRef = useRef<Webcam | null>(null);

    useEffect(() => {
        if (!socketAddress) return;

        const newSocket = new WebSocket(socketAddress);
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log("WebSocket connection established");
        };

        newSocket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error", error);
        };

        return () => {
            newSocket.close();
        };
    }, [socketAddress]);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImageUri(imageSrc);
            setIsCaptured(true);
        }
    }, [webcamRef]);


    const handleSend = () => {
        if (imageUri && socket && socket.readyState === WebSocket.OPEN) {
            console.log("Sending image:", typeof imageUri);
            socket.send(JSON.stringify({ image: imageUri }));
            setImageUri(imageUri);
            setIsSent(true);
            setShowCapturedPhoto(false);
            setIsCaptured(false);
        } else {
            console.error("WebSocket is not open or no image to send");
        }
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

            {!isSent && !isCaptured ? (

                <button onClick={capture}>Capture Photo</button>
            ) : null}

            {isCaptured && !isSent && (
                <>
                    <button onClick={handleSend}>Send
                    </button>
                    <br />
                    <button onClick={handleRetake}>Retake</button>
                </>
            )}
        </div>
    );
};

export default WebcamCapture;
