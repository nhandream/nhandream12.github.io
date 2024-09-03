// Chuyển Giọng Nói Thành Văn Bản

const startButton = document.getElementById('start-recording');
const transcriptElement = document.getElementById('transcript');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true; // Nhận diện liên tục
recognition.interimResults = true; // Nhận kết quả tạm thời
recognition.lang = 'vi-VN'; // Ngôn ngữ tiếng Việt

recognition.onresult = function(event) {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
    }
    transcriptElement.textContent = transcript;
};

recognition.onerror = function(event) {
    console.error('Lỗi nhận diện giọng nói:', event.error);
};

startButton.addEventListener('click', () => {
    recognition.start();
});




// Chuyển Văn Bản Thành Giọng Nói

const speakButton = document.getElementById('speak');
const textInput = document.getElementById('text-input');
const voiceSelect = document.getElementById('voice-select');

let voices = [];

// Tải danh sách các giọng nói
function populateVoiceList() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });

    // Đọc trạng thái lưu trữ và chọn giọng nói cuối cùng đã sử dụng
    const savedVoice = localStorage.getItem('selectedVoice');
    if (savedVoice) {
        voiceSelect.value = savedVoice;
    }
}

populateVoiceList();
speechSynthesis.onvoiceschanged = populateVoiceList;

speakButton.addEventListener('click', () => {
    const text = textInput.value;
    if (text) {
        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoiceName = voiceSelect.value;

        // Tìm giọng nói đã chọn
        for (let i = 0; i < voices.length; i++) {
            if (voices[i].name === selectedVoiceName) {
                utterance.voice = voices[i];
                break;
            }
        }

        utterance.lang = 'vi-VN'; // Ngôn ngữ tiếng Việt
        window.speechSynthesis.speak(utterance);
    } else {
        alert('Vui lòng nhập văn bản để đọc.');
    }
    
});
