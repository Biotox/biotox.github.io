document.addEventListener('DOMContentLoaded', function () {
    const videoPlayer = document.getElementById('videoPlayer');
    const playPauseButton = document.getElementById('playPause');
    const centerPlayPauseButton = document.getElementById('centerPlayPause');
    const seekBar = document.getElementById('seekBar');
    const timeDisplay = document.getElementById('timeDisplay');
    const volumeControl = document.getElementById('volumeControl');
    const volumeSliderContainer = document.getElementById('volumeSliderContainer');
    const volumeSlider = document.getElementById('volumeSlider');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const skipBackButton = document.getElementById('skipBack');
    const skipForwardButton = document.getElementById('skipForward');
    const liveButton = document.getElementById('liveButton'); // Update LIVE button
    const customPlayer = document.querySelector('.custom-player');

    let hideControlsTimeout;
    let volumeSliderTimeout;
    let centerPlayPauseTimeout;

    const hls = new Hls();
    const streamUrl13 = 'https://d18b0e6mopany4.cloudfront.net/out/v1/08bc71cf0a0f4712b6b03c732b0e6d25/index_3.m3u8';
    const streamUrl26 = 'https://d2lckchr9cxrss.cloudfront.net/out/v1/c73af7694cce4767888c08a7534b503c/index_3.m3u8';

    function loadStream(url) {
        if (Hls.isSupported()) {
            hls.loadSource(url);
            hls.attachMedia(videoPlayer);
            videoPlayer.addEventListener('loadeddata', function () {
                videoPlayer.play().catch(error => {
                    console.log('Playback failed:', error);
                });
            });
        } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            videoPlayer.src = url;
            videoPlayer.addEventListener('loadeddata', function () {
                videoPlayer.play().catch(error => {
                    console.log('Playback failed:', error);
                });
            });
        } else {
            alert('Your browser does not support HLS.');
        }
    }

    function updatePlayPauseButton() {
        const iconClass = videoPlayer.paused ? 'fa-play' : 'fa-pause';
        playPauseButton.innerHTML = `<i class="fas ${iconClass}"></i>`;
        centerPlayPauseButton.innerHTML = `<i class="fas ${iconClass}"></i>`;
    }

    function togglePlayPause() {
        if (videoPlayer.paused) {
            videoPlayer.play().catch(error => {
                console.log('Play failed:', error);
            });
        } else {
            videoPlayer.pause();
        }
        updatePlayPauseButton();
        showCenterPlayPause(); // Show the button when toggling play/pause
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
        const currentHours = Math.floor(videoPlayer.currentTime / 3600);
        const currentMinutes = Math.floor((videoPlayer.currentTime % 3600) / 60);
        const currentSeconds = Math.floor(videoPlayer.currentTime % 60);
        const durationHours = Math.floor(videoPlayer.duration / 3600);
        const durationMinutes = Math.floor((videoPlayer.duration % 3600) / 60);
        const durationSeconds = Math.floor(videoPlayer.duration % 60);
        
        timeDisplay.textContent = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')} / ${String(durationHours).padStart(2, '0')}:${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            customPlayer.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    function handleVolumeChange() {
        videoPlayer.volume = volumeSlider.value;
        videoPlayer.muted = videoPlayer.volume === 0;
    }

    function showControls() {
        customPlayer.querySelector('.controls').style.display = 'flex';
        clearTimeout(hideControlsTimeout);
        hideControls();
    }

    function hideControls() {
        hideControlsTimeout = setTimeout(() => {
            customPlayer.querySelector('.controls').style.display = 'none';
        }, 1000);
    }

    function handleMouseMove() {
        showControls();
    }

    function showCenterPlayPause() {
        centerPlayPauseButton.style.display = 'block';
        clearTimeout(centerPlayPauseTimeout);
        centerPlayPauseTimeout = setTimeout(() => {
            centerPlayPauseButton.style.display = 'none';
        }, 1000); // Hide after 1 second
    }

    function goToLive() {
        // Fast forward video to the end and start playback
        videoPlayer.currentTime = videoPlayer.duration;
        videoPlayer.play().catch(error => {
            console.log('Play failed:', error);
        });
    }

    playPauseButton.addEventListener('click', togglePlayPause);
    centerPlayPauseButton.addEventListener('click', togglePlayPause);
    videoPlayer.addEventListener('click', togglePlayPause);
    videoPlayer.addEventListener('play', updatePlayPauseButton);
    videoPlayer.addEventListener('pause', updatePlayPauseButton);
    videoPlayer.addEventListener('timeupdate', updateSeekBar);
    seekBar.addEventListener('input', seekVideo);
    skipBackButton.addEventListener('click', () => skip(-10));
    skipForwardButton.addEventListener('click', () => skip(10));
    fullscreenButton.addEventListener('click', toggleFullscreen);

    volumeControl.addEventListener('mouseover', () => volumeSliderContainer.style.display = 'block');
    volumeControl.addEventListener('mouseout', () => volumeSliderContainer.style.display = 'none');
    volumeSliderContainer.addEventListener('mouseover', () => volumeSliderContainer.style.display = 'block');
    volumeSliderContainer.addEventListener('mouseout', () => volumeSliderContainer.style.display = 'none');
    volumeSlider.addEventListener('input', handleVolumeChange);

    document.addEventListener('mousemove', handleMouseMove);

    document.querySelector('#channel13').addEventListener('click', () => loadStream(streamUrl13));
    document.querySelector('#channel26').addEventListener('click', () => loadStream(streamUrl26));
    liveButton.addEventListener('click', goToLive); // LIVE button handler

    // Load default stream
    loadStream(streamUrl13);

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            customPlayer.classList.add('fullscreen');
            showControls(); // Show controls when entering fullscreen
        } else {
            customPlayer.classList.remove('fullscreen');
            showControls(); // Show controls when exiting fullscreen
        }
    });
});
