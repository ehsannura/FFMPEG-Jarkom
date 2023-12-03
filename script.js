const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const saveRecordingBtn = document.getElementById('saveRecording');
const recordedVideo = document.getElementById('recordedVideo');
const fileNameInput = document.getElementById('fileName');

let mediaRecorder;
const recordedChunks = [];

startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
saveRecordingBtn.addEventListener('click', saveRecording);

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        stream.addTrack(audioStream.getAudioTracks()[0]);
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = function (e) {
            recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = function () {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedVideo.src = URL.createObjectURL(blob);
        };

        recordedChunks.length = 0; // Clear the array
        mediaRecorder.start();
    } catch (error) {
        console.error('Error saat memulai merekam:', error);
    }
}

async function stopRecording() {
    try {
        await mediaRecorder.stop();
        console.log('Merekam dihentikan');
    } catch (error) {
        console.error('Error saat menghentikan merekam:', error);
    }
}

function saveRecording() {
    const fileName = fileNameInput.value || 'recorded-video'; // Default file name
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.webm`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

