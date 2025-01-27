import { FC } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';

interface AudioProps {
    setAudioUri: (uri: any) => void;
}

const AudioRecorderComponent: FC<AudioProps> = ({ setAudioUri }) => {

    return (
        <div>
            <AudioRecorder
                onRecordingComplete={setAudioUri}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                    // autoGainControl,
                    // channelCount,
                    // deviceId,
                    // groupId,
                    // sampleRate,
                    // sampleSize,
                }}
                onNotAllowedOrFound={(err) => console.table(err)}
                downloadOnSavePress={true}
                downloadFileExtension="webm"
                mediaRecorderOptions={{
                    audioBitsPerSecond: 128000,
                }}
            // showVisualizer={true}
            />
            <br />
        </div>
    );
}

export default AudioRecorderComponent;
