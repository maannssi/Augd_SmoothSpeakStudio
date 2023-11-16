
import './App.css';
import AudioRecorder from './components/AudioRecorder';
import AudioUploader from './components/AudioUploader';

function App() {
  return (
    <div className="App">
    <AudioRecorder />
      <AudioUploader/>
    </div>
  );
}

export default App;
