import React, { useState } from 'react';
import { ReactMic } from 'react-mic';
import { RealtimeSession } from 'speechmatics';

const API_KEY = '0uAAFBRX0yXGxuzjDVVGu4CcrtRdbbPP';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
  };

  const audioFun = async () => {
    try {
      if (!audioData) {
        console.log('No recorded audio data available.');
        return;
      }

      const PATH_TO_FILE = localStorage.getItem('recordedAudioDataUrl');

      if (!PATH_TO_FILE) {
        console.error('No audio file address found in local storage.');
        return;
      }

      const session = new RealtimeSession({ apiKey: API_KEY });

      session.addListener('Error', (error) => {
        console.log('session error', error);
      });

      session.addListener('AddTranscript', (message) => {
        console.log('Transcription:', message.metadata.transcript);
      });

      session.addListener('EndOfTranscript', () => {
        process.stdout.write('\n');
      });

      await session.start({
        transcription_config: {
          language: 'en',
          operating_point: 'enhanced',
          enable_partials: true,
          max_delay: 2,
        },
        audio_format: { type: 'file' },
      });

      // Fetch the audio file from local storage and send it to the RealtimeSession
      const response = await fetch(PATH_TO_FILE);
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const fileStream = new ReadableStream({
          start(controller) {
            const view = new Uint8Array(buffer);
            controller.enqueue(view);
            controller.close();
          },
        });

        fileStream.getReader().read().then(({ done, value }) => {
          if (!done) {
            session.sendAudio(value);
            session.stop();
          }
        });
      } else {
        console.error('Error fetching audio file:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error in audioFun:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedData) => {
    console.log('Recording data is available:', recordedData);
  };

  const onStop = (recordedData) => {
    console.log('Recording stopped. Audio data:', recordedData);
    setAudioData(recordedData);
  };

  const handleSaveAudio = () => {
    console.log('Audio data:', audioData);
    // Save the recorded audio data URL to local storage
    if (audioData) {
      localStorage.setItem('recordedAudioDataUrl', audioData.blobURL);
      console.log('Recorded audio data URL saved to local storage.');
    } else {
      console.log('No recorded audio data available.');
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      <ReactMic
        record={isRecording}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
      />
      <div>
        <button onClick={startRecording} disabled={isRecording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          Stop Recording
        </button>
        <button onClick={handleSaveAudio} disabled={!audioData}>
          Save Recording
        </button>
        <button onClick={audioFun} disabled={!audioData}>
          Transcribe Saved Audio
        </button>
      </div>
    </div>
  );
};

export default AudioRecorder;
