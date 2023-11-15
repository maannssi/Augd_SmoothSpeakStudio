
document.addEventListener('DOMContentLoaded', () => {
    const startRecordingButton = document.getElementById('startRecording');
    const stopRecordingButton = document.getElementById('stopRecording');
    const playRecordingButton = document.getElementById('playRecording');
    const audioPlayer = document.getElementById('audioPlayer');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const wordsDropdown = document.getElementById('wordsDropdown');
    const wordsList = document.getElementById('wordsList');
    const pronunciationContainer = document.getElementById('pronunciationContainer');

    let mediaRecorder;
    let recordedChunks = [];

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(blob);
                audioPlayer.src = audioUrl;
                recordedChunks = [];
                playRecordingButton.disabled = false;
            };

            startRecordingButton.addEventListener('click', () => {
                mediaRecorder.start();
                startRecordingButton.disabled = true;
                stopRecordingButton.disabled = false;
            });

            stopRecordingButton.addEventListener('click', () => {
                mediaRecorder.stop();
                startRecordingButton.disabled = false;
                stopRecordingButton.disabled = true;
            });

            playRecordingButton.addEventListener('click', () => {
                audioPlayer.play();
            });

            // Add event listener to category dropdown
            categoryDropdown.addEventListener('change', () => {
                const selectedCategory = categoryDropdown.value;
                if (selectedCategory) {
                    // Call a function to populate the word list based on the selected category
                    populateWordList(selectedCategory);
                }
            });

            // Add event listener to words list
            wordsList.addEventListener('click', (event) => {
                const selectedWord = event.target.textContent;
                if (selectedWord) {
                    // Call a function to pronounce the selected word
                    pronounceWord(selectedWord);
                }
            });
        })
        .catch((error) => {
            console.error('Error accessing microphone:', error);
        });

    // Function to populate the word list based on the selected category
    function populateWordList(category) {
        // Mock data, replace with your actual data fetching logic
        const words = getWordsForCategory(category);

        // Clear previous list
        wordsList.innerHTML = '';

        // Populate the dropdown list
        words.forEach((word) => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            wordsList.appendChild(listItem);
        });

        // Display the dropdown
        wordsDropdown.classList.remove('hidden');
    }

    // Function to pronounce the selected word
    function pronounceWord(word) {
        // Mock function to get pronunciation, replace with actual TTS API or library
        const pronunciation = getWordPronunciation(word);

        // Display the pronunciation
        pronunciationContainer.textContent = `Pronunciation: ${pronunciation}`;
        pronunciationContainer.classList.remove('hidden');
    }

    // Mock function to get words for a category
    function getWordsForCategory(category) {
        // Replace with your actual data fetching logic
        switch (category) {
            case 'Initial /s/':
                return ['sat', 'say', 'saw', 'set', 'sit', 'sight', 'soy', 'sour', 'soup', 'soot', 'see', 'some'];
            case 'Final /s/':
                return ['class', 'face', 'loss', 'mess', 'miss', 'ice', 'voice', 'house', 'dose', 'moose', 'niece', 'bus'];
            case 'Medial /s/':
                return ['classy', 'bases', 'tossing', 'messy', 'kissing', 'icing', 'moisten', 'mousey', 'dosing', 'loosen', 'missing'];
            case 'Initial /sp/ Blends':
                return ['spat', 'spade', 'spot', 'sped', 'spit', 'spite', 'spoil', 'spouse', 'spoke', 'spooky', 'spun'];
            case 'Medial /sp/ Blends':
                return ['Aspen', 'prosperous', 'thespian', 'whisper', 'perspire', 'hospital'];
            case 'Final /sp/ Blends':
                return ['clasp', 'wasp', 'wisp', 'cusp'];
            case 'Initial /st/ Blends':
                return ['stand', 'state', 'stall', 'steady', 'still', 'sty', 'stout', 'stone', 'stool', 'stood', 'steal', 'stump'];
            case 'Medial /st/ Blends':
                return ['nasty', 'hasty', 'Austin', 'Ester', 'listing', 'feisty', 'hoisting', 'ousting', 'boasting', 'boosting', 'feasting', 'rusty'];
            case 'Final /st/ Blends':
                return ['fast', 'faced', 'lost', 'best', 'wrist', 'iced', 'moist', 'oust', 'host', 'roost', 'East', 'must'];
            default:
                return [];
        }
    }

    // Mock function to get pronunciation of a word
    function getWordPronunciation(word) {
        // Replace with your actual TTS API or library logic
        // For simplicity, using the Web Speech API for demonstration
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(word);
        synth.speak(utterance);

        // Return a placeholder value for demonstration
        return 'Mock Pronunciation';
    }
});
