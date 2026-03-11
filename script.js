document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect for Hero Section
    const typeLines = [
        { el: document.getElementById('line1'), delay: 0 },
        { el: document.getElementById('line2'), delay: 1200 },
        { el: document.getElementById('line3'), delay: 2400 }
    ];

    async function typeText(item) {
        if (!item.el) return;
        const text = item.el.getAttribute('data-text');
        item.el.textContent = '';
        item.el.innerHTML = '<span class="typing"></span><span class="cursor">█</span>';
        const span = item.el.querySelector('.typing');
        const cursor = item.el.querySelector('.cursor');
        
        for (let i = 0; i < text.length; i++) {
            span.textContent += text.charAt(i);
            await new Promise(r => setTimeout(r, Math.random() * 40 + 20));
        }
        
        // Remove blinker for finished lines (unless it's the last one)
        if (item.el.id !== 'line3') {
            cursor.style.display = 'none';
        }
    }

    async function runTypingSequence() {
        for (const line of typeLines) {
            if (line.el) {
                // Wait for the requested delay (incremental wait)
                await new Promise(r => setTimeout(r, 600)); 
                await typeText(line);
            }
        }
    }

    runTypingSequence();

    // Intersection Observer for fade-in elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after making it visible
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        // Exclude hero section from observer since it's already visible
        if (section.id !== 'hero') {
            observer.observe(section);
        }
    });

    // Command input simulation
    const cmdInput = document.querySelector('.cmd-input');
    if (cmdInput) {
        cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = cmdInput.value.trim();
                const lowered = val.toLowerCase();
                if (lowered === 'clear') {
                    cmdInput.value = '';
                } else if (lowered === 'sudo rm -rf /') {
                    cmdInput.value = 'bash: permission denied: nice try';
                    setTimeout(() => { cmdInput.value = ''; }, 2000);
                } else if (val !== '') {
                    cmdInput.value = `bash: command not found: ${val}`;
                    setTimeout(() => { cmdInput.value = ''; }, 2000);
                }
            }
        });
    }
});