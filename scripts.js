document.addEventListener('DOMContentLoaded', function () {
    const videoPlayer = document.getElementById('videoPlayer');
    const playPauseButton = document.getElementById('playPause');
    const seekBar = document.getElementById('seekBar');
    const skipBackButton = document.getElementById('skipBack');
    const skipForwardButton = document.getElementById('skipForward');
    const timeDisplay = document.getElementById('timeDisplay');
    const liveButton = document.getElementById('liveButton');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const channel13Button = document.getElementById('channel13');
    const channel26Button = document.getElementById('channel26');

    const hls = new Hls();
    let currentUrl = 'https://d18b0e6mopany4.cloudfront.net/out/v1/08bc71cf0a0f4712b6b03c732b0e6d25/index_3.m3u8';

    function switchChannel(url) {
        currentUrl = url;
        if (Hls.isSupported()) {
            hls.loadSource(url);
            hls.attachMedia(videoPlayer);
            videoPlayer.play().catch(error => {
                console.log('Playback failed:', error);
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = url;
            videoPlayer.addEventListener('loadedmetadata', function () {
                videoPlayer.play().catch(error => {
                    console.log('Playback failed:', error);
                });
            });
        } else {
            alert('Your browser does not support HLS.');
        }
    }

    function updatePlayPauseButton() {
        playPauseButton.textContent = videoPlayer.paused ? '▶️' : '⏸️';
    }

    function togglePlayPause() {
        if (videoPlayer.paused) {
            videoPlayer.play().catch(error => {
                console.log('Playback failed:', error);
            });
        } else {
            videoPlayer.pause();
        }
        updatePlayPauseButton();
    }

    function updateSeekBar() {
        seekBar.value = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        updateDisplayTime();
    }

    function seekVideo() {
        const seekTo = videoPlayer.duration * (seekBar.value / 100);
        videoPlayer.currentTime = seekTo;
    }

    function skip(seconds) {
        videoPlayer.currentTime += seconds;
    }

    function updateDisplayTime() {
        const currentMinutes = Math.floor(videoPlayer.currentTime / 60);
        const currentSeconds = Math.floor(videoPlayer.currentTime % 60);
        const durationMinutes = Math.floor(videoPlayer.duration / 60);
        const durationSeconds = Math.floor(videoPlayer.duration % 60);
        timeDisplay.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }

    function goToLive() {
        switchChannel(currentUrl);
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            videoPlayer.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    function attemptPlay() {
        if (videoPlayer.readyState >= 2) { // Ensure video is ready to play
            videoPlayer.muted = false; // Ensure the video is unmuted
            videoPlayer.play().catch(error => {
                console.log('Autoplay failed:', error);
            });
        } else {
            // Retry playback after a short delay
            setTimeout(attemptPlay, 1000);
        }
    }

    function handleLoadedData() {
        attemptPlay();
    }

    function handlePlay() {
        videoPlayer.muted = false; // Ensure video is unmuted
        videoPlayer.play().catch(error => {
            console.log('Playback failed:', error);
        });
    }

    playPauseButton.addEventListener('click', togglePlayPause);
    videoPlayer.addEventListener('play', updatePlayPauseButton);
    videoPlayer.addEventListener('pause', updatePlayPauseButton);
    videoPlayer.addEventListener('timeupdate', updateSeekBar);
    seekBar.addEventListener('input', seekVideo);
    skipBackButton.addEventListener('click', () => skip(-10));
    skipForwardButton.addEventListener('click', () => skip(10));
    liveButton.addEventListener('click', goToLive);
    fullscreenButton.addEventListener('click', toggleFullscreen);
    channel13Button.addEventListener('click', () => switchChannel('https://d18b0e6mopany4.cloudfront.net/out/v1/08bc71cf0a0f4712b6b03c732b0e6d25/index_3.m3u8'));
    channel26Button.addEventListener('click', () => switchChannel('https://d2lckchr9cxrss.cloudfront.net/out/v1/c73af7694cce4767888c08a7534b503c/index_3.m3u8'));

    // Ensure the video starts automatically
    videoPlayer.addEventListener('loadeddata', handleLoadedData);
    videoPlayer.addEventListener('play', handlePlay);
    
    // Load the first channel by default
    switchChannel(currentUrl);

    // Event listener to handle fullscreen change
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            document.querySelector('.controls').style.display = 'flex';
        } else {
            document.querySelector('.controls').style.display = 'flex';
        }
    });
});
