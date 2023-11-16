import React, { useState } from 'react';

const AudioUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      setSelectedFile(file);
    }
  };

  const handleSaveToLocalstorage = () => {
    if (selectedFile) {
      // Convert the file to a data URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;

        // Save the data URL to local storage
        localStorage.setItem('audioDataUrl', dataUrl);
        alert('Audio file saved to local storage!');
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert('Please select an audio file first.');
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileSelect} />
      <button onClick={handleSaveToLocalstorage}>Save to Local Storage</button>
    </div>
  );
};

export default AudioUploader;
