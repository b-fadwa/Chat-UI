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
                }}
                onNotAllowedOrFound={(err) => console.table(err)}
                mediaRecorderOptions={{
                    audioBitsPerSecond: 128000,
                }}
            />
            <br />
        </div>
    );
}

export default AudioRecorderComponent;
