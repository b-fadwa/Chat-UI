import { FC } from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';

interface AudioProps {
    setAudioUri: (uri: any) => void;
}

const AudioRecorderComponent: FC<AudioProps> = ({ setAudioUri }) => {

    return (
        <div className='audio-container h-full flex align-center p-2 bg-gray-100 rounded'>
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
                classes={{
                    AudioRecorderClass:'h-fit w-full',
                    AudioRecorderStartSaveClass:'bg-transparent rounded-none shadow-none',
                }}
            />
            <br />
        </div>
    );
}

export default AudioRecorderComponent;
