
// Arts page specific carousel
let currentSlide = 0;
let slides = [];
let isAnimating = false;
let autoPlayInterval;

document.addEventListener('DOMContentLoaded', function() {
    slides = document.querySelectorAll('.slide-arts');
    setupCarousel();
    startAutoPlay();
    
    // Pause all audio when page loads
    pauseAllAudio();
});

function setupCarousel() {
    // Initialize positions
    updateSlides();
    
    // Add click event to slides for manual navigation
    slides.forEach((slide, index) => {
        slide.addEventListener('click', (e) => {
            // Don't navigate if clicking on audio controls
            if (e.target.closest('.audio-control') || 
                e.target.closest('.audio-player-arts') ||
                e.target.tagName === 'BUTTON' ||
                e.target.type === 'range') {
                return;
            }
            goToSlide(index);
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === ' ') {
            // Space bar to play/pause current audio
            const currentAudio = slides[currentSlide].querySelector('.audio-control');
            if (currentAudio) {
                if (currentAudio.paused) {
                    currentAudio.play();
                } else {
                    currentAudio.pause();
                }
            }
        }
    });
    
    // Add custom audio controls
    setupCustomAudioControls();
}

function setupCustomAudioControls() {
    slides.forEach(slide => {
        const audio = slide.querySelector('.audio-control');
        if (!audio) return;
        
        // Create custom controls
        const audioContainer = slide.querySelector('.audio-player-arts');
        audio.controls = false; // Hide default controls
        
        // Create custom controls container
        const customControls = document.createElement('div');
        customControls.className = 'custom-audio-controls';
        customControls.innerHTML = `
            <button class="play-pause-btn">
                <i class="fas fa-play"></i>
            </button>
            <span class="current-time">0:00</span>
            <input type="range" class="seek-slider" value="0" max="100">
            <span class="duration">0:00</span>
            <button class="volume-btn">
                <i class="fas fa-volume-up"></i>
            </button>
            <input type="range" class="volume-slider" value="100" max="100">
        `;
        
        audioContainer.appendChild(customControls);
        
        // Get elements
        const playPauseBtn = customControls.querySelector('.play-pause-btn');
        const seekSlider = customControls.querySelector('.seek-slider');
        const volumeSlider = customControls.querySelector('.volume-slider');
        const currentTimeEl = customControls.querySelector('.current-time');
        const durationEl = customControls.querySelector('.duration');
        
        // Play/Pause button
        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        });
        
        // Update play/pause button
        audio.addEventListener('play', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        });
        
        audio.addEventListener('pause', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
        
        // Update time and slider
        audio.addEventListener('timeupdate', () => {
            const currentTime = audio.currentTime;
            const duration = audio.duration;
            
            // Update current time display
            currentTimeEl.textContent = formatTime(currentTime);
            
            // Update duration if available
            if (duration) {
                durationEl.textContent = formatTime(duration);
                
                // Update seek slider
                const percent = (currentTime / duration) * 100;
                seekSlider.value = percent;
            }
        });
        
        // Seek functionality
        seekSlider.addEventListener('input', (e) => {
            if (audio.duration) {
                const seekTime = (e.target.value / 100) * audio.duration;
                audio.currentTime = seekTime;
            }
        });
        
        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            audio.volume = e.target.value / 100;
            const volumeBtn = customControls.querySelector('.volume-btn');
            if (audio.volume === 0) {
                volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else if (audio.volume < 0.5) {
                volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
            } else {
                volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        });
        
        // Volume button
        const volumeBtn = customControls.querySelector('.volume-btn');
        volumeBtn.addEventListener('click', () => {
            if (audio.volume > 0) {
                audio.volume = 0;
                volumeSlider.value = 0;
                volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                audio.volume = 1;
                volumeSlider.value = 100;
                volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        });
        
        // When audio ends
        audio.addEventListener('ended', () => {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            audio.currentTime = 0;
            seekSlider.value = 0;
            currentTimeEl.textContent = '0:00';
        });
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function pauseAllAudio() {
    document.querySelectorAll('.audio-control').forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
}

function updateSlides() {
    // Pause all audio first
    pauseAllAudio();
    
    // Update slide positions
    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'prev', 'next', 'hidden');
        
        if (index === currentSlide) {
            slide.classList.add('active');
        } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
            slide.classList.add('prev');
        } else if (index === (currentSlide + 1) % slides.length) {
            slide.classList.add('next');
        } else {
            slide.classList.add('hidden');
        }
    });
}

function nextSlide() {
    if (isAnimating) return;
    isAnimating = true;
    
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlides();
    
    // Reset autoplay timer
    resetAutoPlay();
    
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

function prevSlide() {
    if (isAnimating) return;
    isAnimating = true;
    
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlides();
    
    // Reset autoplay timer
    resetAutoPlay();
    
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

function goToSlide(index) {
    if (isAnimating || index === currentSlide) return;
    isAnimating = true;
    
    currentSlide = index;
    updateSlides();
    
    // Reset autoplay timer
    resetAutoPlay();
    
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

// Autoplay functions
function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        // Check if any audio is playing
        const isAudioPlaying = Array.from(document.querySelectorAll('.audio-control'))
            .some(audio => !audio.paused);
        
        if (!isAudioPlaying) {
            nextSlide();
        }
    }, 8000); // Change slide every 8 seconds
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;
const carousel = document.querySelector('.carousel-arts');

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left
            nextSlide();
        } else {
            // Swipe right
            prevSlide();
        }
    }
}
