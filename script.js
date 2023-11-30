const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const saveRecordingBtn = document.getElementById('saveRecording');
const convertToMP4Btn = document.getElementById('convertToMP4'); // Tambahan tombol konversi
const recordedVideo = document.getElementById('recordedVideo');

let mediaRecorder;
let recordedChunks = [];
let recordRTC;

startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
saveRecordingBtn.addEventListener('click', saveRecording);
convertToMP4Btn.addEventListener('click', convertToMP4); // Event handler untuk konversi

async function startRecording() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = function () {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        recordedVideo.src = URL.createObjectURL(blob);
    };

    recordedChunks = [];
    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
}

function saveRecording() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded-video.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function convertToMP4() {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', blob, 'recorded-video.webm');

    try {
        const response = await fetch('/convertToMP4', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const convertedBlob = await response.blob();
            const convertedUrl = URL.createObjectURL(convertedBlob);
            recordedVideo.src = convertedUrl;
        } else {
            console.error('Konversi gagal');
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
}
