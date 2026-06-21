document.addEventListener('DOMContentLoaded', () => {
    // --- Door Animation Logic ---
    const doorOverlay = document.getElementById('door-overlay');
    const openSeal = document.getElementById('open-seal');
    const doorVideo = document.getElementById('door-video');
    
    // Ensure body is locked initially
    document.body.classList.add('locked');

    if (openSeal && doorOverlay && doorVideo) {
        openSeal.addEventListener('click', () => {
            // Hide the seal
            doorOverlay.classList.add('open');
            
            // Play the realistic AI video
            doorVideo.play();
            
            // Wait for the video to finish before revealing the card
            doorVideo.addEventListener('ended', () => {
                document.body.classList.add('opening');
                doorOverlay.classList.add('hidden');
                
                // Remove overlay after fade out to allow interactions and save memory
                setTimeout(() => {
                    document.body.classList.remove('locked');
                    if (doorOverlay.parentNode) {
                        doorOverlay.parentNode.removeChild(doorOverlay);
                    }
                }, 1500);
            });
        });
    }

    // --- Scratch Card Logic ---
    const canvas = document.getElementById('scratch-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Match canvas coordinate system to CSS size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Fill canvas with gold gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#B8860B');
        gradient.addColorStop(0.5, '#D4AF37');
        gradient.addColorStop(1, '#8B6508');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add "Scratch Here" text
        ctx.font = '20px "Cinzel Decorative", serif';
        ctx.fillStyle = '#0F2D5C';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Scratch Here', canvas.width / 2, canvas.height / 2);

        // Prepare for scratching (this makes drawn paths transparent, revealing underneath)
        ctx.globalCompositeOperation = 'destination-out';
        
        let isDrawing = false;

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function startDrawing(e) {
            isDrawing = true;
            scratch(e);
        }

        function stopDrawing() {
            isDrawing = false;
            ctx.beginPath();
        }

        function scratch(e) {
            if (!isDrawing) return;
            if(e.cancelable) e.preventDefault(); 
            
            const pos = getMousePos(e);
            
            ctx.lineWidth = 25;
            ctx.lineCap = 'round';
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);
        
        canvas.addEventListener('touchstart', startDrawing, {passive: false});
        canvas.addEventListener('touchmove', scratch, {passive: false});
        canvas.addEventListener('touchend', stopDrawing);
    }

    // --- Sparkles Animation ---
    const sparklesContainer = document.getElementById('sparkles-container');
    const sparkleCount = 50;

    for (let i = 0; i < sparkleCount; i++) {
        createSparkle();
    }

    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // Random positioning
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        // Random animation duration and delay
        const duration = Math.random() * 3 + 2; // 2s to 5s
        const delay = Math.random() * 5; // 0s to 5s
        
        sparkle.style.left = `${startX}vw`;
        sparkle.style.top = `${startY}vh`;
        sparkle.style.animationDuration = `${duration}s`;
        sparkle.style.animationDelay = `${delay}s`;
        
        sparklesContainer.appendChild(sparkle);
    }

    // --- Countdown Timer ---
    // Set a placeholder date (e.g., 30 days from now)
    const weddingDate = new Date();
    weddingDate.setDate(weddingDate.getDate() + 30);
    weddingDate.setHours(18, 0, 0, 0);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate.getTime() - now;

        if (distance < 0) {
            document.getElementById('countdown-timer').innerHTML = "<h3 class='section-title'>The Big Day is Here!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Pad with leading zeros
        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
    }

    // Initial call and set interval
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- Form Submission Handling ---
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const attendance = document.querySelector('input[name="attendance"]:checked').value;
            
            // In a real application, you would send this to a backend server.
            // For now, we simulate a success message.
            
            const submitBtn = rsvpForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                rsvpForm.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <h4 style="color: var(--royal-gold); font-size: 1.5rem; margin-bottom: 1rem;">Jazakallah Khair!</h4>
                        <p style="color: var(--ivory-white);">Thank you for your response, ${name}.<br>We look forward to celebrating with you.</p>
                    </div>
                `;
            }, 1500);
        });
    }
});
