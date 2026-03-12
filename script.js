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

    // Comm-Link: transmit thoughts to NEON's scratchpad
    // NEON reads this on every session — any browser, anywhere
    // Endpoint stored in localStorage — configurable for remote access via tunnel URL
    const COMM_LINK_DEFAULT = 'http://192.168.1.100:8000/api/scratchpad';
    const COMM_LINK_KEY = 'neon_scratchpad_url';

    function getCommLinkURL() {
        return localStorage.getItem(COMM_LINK_KEY) || COMM_LINK_DEFAULT;
    }

    const toggle = document.getElementById('comm-link-toggle');
    const modal = document.getElementById('comm-link-modal');
    const sendBtn = document.getElementById('comm-link-send');
    const closeBtn = document.getElementById('comm-link-close');
    const statusEl = document.getElementById('comm-link-status');
    const textEl = document.getElementById('comm-link-text');
    const cfgBtn = document.getElementById('comm-link-configure');
    const cfgPanel = document.getElementById('comm-link-cfg-panel');
    const cfgInput = document.getElementById('comm-link-cfg-input');
    const cfgSave = document.getElementById('comm-link-cfg-save');

    if (toggle && modal) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
            if (modal.style.display === 'block') textEl.focus();
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            textEl.value = '';
            statusEl.textContent = '';
            if (cfgPanel) cfgPanel.style.display = 'none';
        });

        sendBtn.addEventListener('click', async () => {
            const text = textEl.value.trim();
            if (!text) { statusEl.textContent = 'nothing to transmit'; return; }
            statusEl.textContent = 'transmitting...';
            sendBtn.disabled = true;
            try {
                const res = await fetch(getCommLinkURL(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text })
                });
                if (res.ok) {
                    statusEl.style.color = '#0f0';
                    statusEl.textContent = 'transmitted. NEON will read this next session.';
                    textEl.value = '';
                    setTimeout(() => { modal.style.display = 'none'; statusEl.textContent = ''; }, 2500);
                } else {
                    statusEl.style.color = '#f55';
                    statusEl.textContent = 'error: server returned ' + res.status;
                }
            } catch (err) {
                statusEl.style.color = '#f55';
                statusEl.textContent = 'error: cannot reach MATRIXSERVER';
            }
            sendBtn.disabled = false;
        });

        // Ctrl+Enter shortcut to send
        textEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) sendBtn.click();
        });

        // Endpoint configuration panel
        if (cfgBtn && cfgPanel && cfgInput && cfgSave) {
            cfgBtn.addEventListener('click', (e) => {
                e.preventDefault();
                cfgInput.value = getCommLinkURL();
                cfgPanel.style.display = cfgPanel.style.display === 'none' ? 'flex' : 'none';
            });
            cfgSave.addEventListener('click', () => {
                const url = cfgInput.value.trim();
                if (url) {
                    localStorage.setItem(COMM_LINK_KEY, url);
                    cfgPanel.style.display = 'none';
                    statusEl.style.color = '#0f0';
                    statusEl.textContent = 'endpoint saved';
                    setTimeout(() => { statusEl.textContent = ''; statusEl.style.color = '#888'; }, 2000);
                }
            });
        }
    }
});