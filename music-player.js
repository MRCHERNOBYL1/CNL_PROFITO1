

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const musicToggle = document.getElementById('musicToggle');
    const musicPlayer = document.getElementById('musicPlayer');
    const closePlayer = document.getElementById('closePlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const currentSongTitle = document.getElementById('currentSongTitle');
    const currentSongArtist = document.getElementById('currentSongArtist');
    

    const playlist = [
        {
            title: "Vase-Zende-Bodane",
            artist: "free iran",
            src: "assests/music/Ahang-Jadid-Vase-Zende-Bodane-128.mp3",
            icon: "headphones"
        },
        {
            title: "Karaj Ra Langerud" ,
            artist: "Fadaei",
            src: "assests/music/Fadaei - Karaj Ra Langerud [320].mp3",
            icon: "guitar"
        },
        {
            title: "Barandaz",
            artist: "Reza Pishro",
            src: "assests/music/Reza Pishro - Barandaz.mp3",
            icon: "piano"
        }
    ];
    

    let currentTrackIndex = 0;
    let isPlaying = false;
    let audio = null;
    

    function initializeAudio() {
        if (!audio) {
            audio = new Audio(playlist[currentTrackIndex].src);
            audio.addEventListener('timeupdate', updateProgress);
            audio.addEventListener('ended', playNextTrack);
            audio.addEventListener('loadedmetadata', updateDuration);
        }
    }
    

    musicToggle.addEventListener('click', () => {
        musicPlayer.classList.toggle('show');
        initializeAudio();
    });
    
    closePlayer.addEventListener('click', () => {
        musicPlayer.classList.remove('show');
    });
    

    function togglePlay() {
        if (!audio) initializeAudio();
        
        if (isPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    }
    
    function playMusic() {
        audio.play();
        isPlaying = true;
        playIcon.className = 'fas fa-pause';
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    function pauseMusic() {
        audio.pause();
        isPlaying = false;
        playIcon.className = 'fas fa-play';
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    }
    

    function updateProgress() {
        if (!audio || isNaN(audio.duration)) return;
        
        const { duration, currentTime } = audio;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        

        currentTimeEl.textContent = formatTime(currentTime);
    }
    
    function updateDuration() {
        if (audio && !isNaN(audio.duration)) {
            durationEl.textContent = formatTime(audio.duration);
        }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    

    progressBar.addEventListener('click', (e) => {
        if (!audio || isNaN(audio.duration)) return;
        
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        audio.currentTime = (clickX / width) * duration;
    });
    

    function playNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        playMusic();
    }
    
    function playPrevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        playMusic();
    }
    
    function loadTrack(index) {
        if (audio) {
            audio.pause();
            audio = null;
        }
        
        initializeAudio();
        audio.src = playlist[index].src;
        currentSongTitle.textContent = playlist[index].title;
        currentSongArtist.textContent = playlist[index].artist;
        
  
        playlistItems.forEach(item => item.classList.remove('active'));
        playlistItems[index].classList.add('active');
        

        progress.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        

        audio.addEventListener('loadedmetadata', function() {
            updateDuration();
        }, { once: true });
    }
    

    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(index);
            playMusic();
        });
    });
    

    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', playNextTrack);
    prevBtn.addEventListener('click', playPrevTrack);
    

    loadTrack(currentTrackIndex);
    

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && musicPlayer.classList.contains('show')) {
            e.preventDefault();
            togglePlay();
        }
        
        if (e.code === 'ArrowRight' && musicPlayer.classList.contains('show')) {
            e.preventDefault();
            playNextTrack();
        }
        
        if (e.code === 'ArrowLeft' && musicPlayer.classList.contains('show')) {
            e.preventDefault();
            playPrevTrack();
        }
    });
    

    window.addEventListener('beforeunload', () => {
        localStorage.setItem('musicPlayerState', JSON.stringify({
            currentTrackIndex,
            isPlaying,
            currentTime: audio ? audio.currentTime : 0
        }));
    });
    

    const savedState = localStorage.getItem('musicPlayerState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            currentTrackIndex = state.currentTrackIndex || 0;
            loadTrack(currentTrackIndex);
            
            if (state.isPlaying && audio) {
                audio.currentTime = state.currentTime || 0;
                playMusic();
            }
        } catch (e) {
            console.log('Could not load player state');
        }
    }
});