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
    const liveButton = document.getElementById('liveButton');
    const customPlayer = document.querySelector('.custom-player');

    let hideControlsTimeout;
    let volumeSliderTimeout;
    let centerPlayPauseTimeout;

    const hls = new Hls();
    const streamUrl12 = 'https://mako-streaming.akamaized.net/stream/hls/live/2033791/k12/profile/3/profileManifest.m3u8?_uid=a004f873-f654-4ab8-a86c-4aa2bbfc909d&rK=a1';
    const streamUrl13 = 'https://d18b0e6mopany4.cloudfront.net/out/v1/08bc71cf0a0f4712b6b03c732b0e6d25/index_3.m3u8';
    const streamUrl26 = 'https://d2lckchr9cxrss.cloudfront.net/out/v1/c73af7694cce4767888c08a7534b503c/index_3.m3u8';
    const streamUrlKAN = 'https://kan11w.media.kan.org.il/hls/live/2105694/2105694/source1_4k/chunklist.m3u8';
    const streamUrl14 = 'https://ch14-channel14-content.akamaized.net/hls/live/2104807/CH14_CHANNEL14/2/streamPlaylist.m3u8';
    const streamUrlI24 = 'https://bcovlive-a.akamaihd.net/d89ede8094c741b7924120b27764153c/eu-central-1/5377161796001/profile_0/chunklist.m3u8';
const streamUrl9 = 'https://a5.pokaz.me/1Hfa1A3SN2Dzy6tlO8cMsQ/185/1722242865/index.m3u8';

    let isMuted = false; // Состояние звука
    let previousVolume = 1; // Хранение предыдущего уровня громкости

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

    function toggleMute() {
        isMuted = !isMuted; // Переключаем состояние
        videoPlayer.muted = isMuted; // Устанавливаем muted в зависимости от состояния
        if (isMuted) {
            previousVolume = volumeSlider.value; // Сохраняем текущее значение громкости
            volumeSlider.value = 0; // Устанавливаем громкость в 0
        } else {
            volumeSlider.value = previousVolume; // Восстанавливаем сохраненное значение громкости
        }
        videoPlayer.volume = volumeSlider.value; // Применяем громкость
        updateVolumeControlIcon(); // Обновляем иконку на кнопке
    }

    function updateVolumeControlIcon() {
        if (videoPlayer.muted) {
            volumeControl.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Иконка для выключенного звука
        } else if (volumeSlider.value == 0) {
            volumeControl.innerHTML = '<i class="fas fa-volume-off"></i>'; // Иконка для низкого уровня звука
        } else {
            volumeControl.innerHTML = '<i class="fas fa-volume-up"></i>'; // Иконка для включенного звука
        }
    }

    function handleVolumeChange() {
        videoPlayer.volume = volumeSlider.value; // Обновляем громкость видео
        videoPlayer.muted = videoPlayer.volume === 0; // Если громкость 0, устанавливаем muted
        isMuted = videoPlayer.muted; // Обновляем состояние
        updateVolumeControlIcon(); // Обновляем иконку на кнопке
    }

    function showControls() {
        customPlayer.querySelector('.controls').style.display = 'flex';
        clearTimeout(hideControlsTimeout); // Clear the existing timeout
        hideControls(); // Restart the hide timeout
    }

    function hideControls() {
        hideControlsTimeout = setTimeout(() => {
            customPlayer.querySelector('.controls').style.display = 'none';
        }, 3000); // Hide after 3 seconds of inactivity
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
        videoPlayer.currentTime = videoPlayer.duration;
        videoPlayer.play().catch(error => {
            console.log('Play failed:', error);
        });
    }

    function showVolumeSlider() {
        clearTimeout(volumeSliderTimeout);
        volumeSliderContainer.style.display = 'block';
    }

    function hideVolumeSlider() {
        volumeSliderTimeout = setTimeout(() => {
            volumeSliderContainer.style.display = 'none';
        }, 1000); // Hide after 1 second
    }

    function handleKeyboardShortcuts(event) {
        const key = event.code;
        if (key === 'ArrowLeft') { // Skip back 10 seconds
            skip(-10);
        } else if (key === 'ArrowRight') { // Skip forward 10 seconds
            skip(10);
        }
    }
    
    // Event listeners
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

    volumeControl.addEventListener('click', toggleMute);
    volumeControl.addEventListener('mouseenter', showVolumeSlider);
    volumeControl.addEventListener('mouseleave', hideVolumeSlider);
    volumeSliderContainer.addEventListener('mouseenter', showVolumeSlider);
    volumeSliderContainer.addEventListener('mouseleave', hideVolumeSlider);
    volumeSlider.addEventListener('input', handleVolumeChange);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyboardShortcuts);

    document.querySelector('#channel12').addEventListener('click', () => loadStream(streamUrl12));
document.querySelector('#channel13').addEventListener('click', () => loadStream(streamUrl13));
document.querySelector('#channel26').addEventListener('click', () => loadStream(streamUrl26));
    document.querySelector('#channelKAN').addEventListener('click', () => loadStream(streamUrlKAN));
document.querySelector('#channel14').addEventListener('click', () => loadStream(streamUrl14));
document.querySelector('#channelI24').addEventListener('click', () => loadStream(streamUrlI24));
document.querySelector('#channel9').addEventListener('click', () => loadStream(streamUrl9));

liveButton.addEventListener('click', goToLive);


    loadStream(streamUrl13);

    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            customPlayer.classList.add('fullscreen');
            showControls(); // Show controls when entering fullscreen
        } else {
            customPlayer.classList.remove('fullscreen');
            showControls(); // Show controls when exiting fullscreen
        }
    });

    updateVolumeControlIcon(); // Update icon on boot
});
