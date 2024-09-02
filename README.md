<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chuyển Giọng Nói Thành Văn Bản và Văn Bản Thành Giọng Nói</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Chuyển Giọng Nói Thành Văn Bản</h1>
        <button id="start-recording">Bắt đầu ghi âm</button>
        <p id="transcript">Nội dung sẽ hiển thị tại đây...</p>

        <h1>Chuyển Văn Bản Thành Giọng Nói</h1>
        <textarea id="text-input" rows="4" cols="50" placeholder="Nhập văn bản vào đây..."></textarea>
        <br>
        <select id="voice-select">
            <option value="">Chọn giọng nói</option>
        </select>
        <br>
        <button id="speak">Đọc Văn Bản</button>
    </div>

    <script>
        // Speech-to-Text (Chuyển Giọng Nói Thành Văn Bản)
        const startButton = document.getElementById('start-recording');
        const transcriptElement = document.getElementById('transcript');

        // Check if the browser supports SpeechRecognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói.');
        } else {
            const recognition = new SpeechRecognition();
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
                alert('Đã xảy ra lỗi nhận diện giọng nói: ' + event.error);
            };

            startButton.addEventListener('click', () => {
                recognition.start();
            });
        }

        // Text-to-Speech (Chuyển Văn Bản Thành Giọng Nói)
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

        // Kiểm tra nếu speechSynthesis có hỗ trợ
        if (typeof speechSynthesis === 'undefined') {
            alert('Trình duyệt của bạn không hỗ trợ chức năng chuyển văn bản thành giọng nói.');
        } else {
            populateVoiceList();
            speechSynthesis.onvoiceschanged = populateVoiceList;
        }

        speakButton.addEventListener('click', () => {
            const text = textInput.value;
            if (text) {
                const utterance = new SpeechSynthesisUtterance(text);
                const selectedVoiceName = voiceSelect.value;

                // Tìm giọng nói đã chọn
                const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }

                utterance.lang = 'vi-VN'; // Ngôn ngữ tiếng Việt
                window.speechSynthesis.speak(utterance);

                // Lưu giọng nói đã chọn vào localStorage
                localStorage.setItem('selectedVoice', selectedVoiceName);
            } else {
                alert('Vui lòng nhập văn bản để đọc.');
            }
        });
    </script>
</body>
</html>
