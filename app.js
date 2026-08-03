/**
 * Md. Shahroz Nasir — 10/10 Terminal-Prompt Navbar & Motion Engine
 * Features Dynamic Path Morphing, CRT Phosphor Glow, Command Execution Feedback, Mechanical Keypress Web Audio, & 60fps Inertia Scroll
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       0. Core Element Queries & Helpers (Declared First for Scope Safety)
       ========================================================================== */
    const navLinks = document.querySelectorAll('.term-nav-item');
    const sections = document.querySelectorAll('section[id]');
    const termPathSpan = document.getElementById('term-path-span');
    const moreMenuBtn = document.getElementById('more-menu-btn');
    const moreDropdown = document.getElementById('more-dropdown');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeDropdown = document.getElementById('theme-dropdown');
    const cmdModal = document.getElementById('cmd-modal');
    const resumeModal = document.getElementById('resume-modal');
    const toast = document.getElementById('toast');

    const showToast = (msg) => {
        if (!toast) return;
        const msgEl = document.getElementById('toast-message');
        if (msgEl) msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3200);
    };

    const copyEmail = () => {
        navigator.clipboard.writeText('mdshahroznasir@gmail.com').then(() => {
            showToast("Copied mdshahroznasir@gmail.com!");
        }).catch(() => {
            showToast("mdshahroznasir@gmail.com");
        });
    };

    /* ==========================================================================
       1. Lenis Smooth Scroll Engine (60fps Buttery Inertia)
       ========================================================================== */
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false
        });

        function raf(time) {
            if (!document.hidden) lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    /* ==========================================================================
       2. Terminal-Prompt Navbar Dynamic Path Morphing & ScrollSpy Engine
       ========================================================================== */
    const updateTerminalPath = (path) => {
        if (termPathSpan && path) {
            termPathSpan.textContent = path;
            termPathSpan.style.color = '#3ddc84';
            setTimeout(() => {
                termPathSpan.style.color = 'rgba(255, 255, 255, 0.4)';
            }, 300);
        }
    };

    if (moreMenuBtn && moreDropdown) {
        moreMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moreDropdown.classList.toggle('open');
            if (themeDropdown) themeDropdown.classList.remove('show');
        });
    }

    document.addEventListener('click', (e) => {
        if (moreMenuBtn && moreDropdown && !moreMenuBtn.contains(e.target) && !moreDropdown.contains(e.target)) {
            moreDropdown.classList.remove('open');
        }
        if (themeToggleBtn && themeDropdown && !themeToggleBtn.contains(e.target) && !themeDropdown.contains(e.target)) {
            themeDropdown.classList.remove('show');
        }
    });

    // ScrollSpy active link & path swap
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPos = window.scrollY + 220;

        sections.forEach(sec => {
            if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href').substring(1);
                if (href === currentSectionId) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    const path = link.getAttribute('data-path');
                    updateTerminalPath(path);
                }
            });
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const path = link.getAttribute('data-path');
            updateTerminalPath(path);
        });

        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const path = link.getAttribute('data-path');
            updateTerminalPath(path);
        });
    });

    /* ==========================================================================
       3. Synthesized Mechanical Terminal Audio Feedback Engine
       ========================================================================== */
    let soundEnabled = true;
    let audioCtx = null;

    const initAudio = () => {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
    };

    const playBeep = (freq = 600, duration = 0.05, type = 'sine') => {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (audioCtx && audioCtx.state === 'running') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = type;
                osc.frequency.value = freq;

                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            }
        } catch (e) {
            // Audio context gesture restriction fallback
        }
    };

    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundToggleBtn.classList.remove('muted');
                soundToggleBtn.innerHTML = '<i class="bx bx-volume-full"></i> Sound FX';
                playBeep(880, 0.1);
                showToast("Sound FX Enabled");
            } else {
                soundToggleBtn.classList.add('muted');
                soundToggleBtn.innerHTML = '<i class="bx bx-volume-mute"></i> Sound FX (Muted)';
                showToast("Sound FX Muted");
            }
        });
    }

    const soundTargets = document.querySelectorAll('button, a, .magnetic-target, .dock-item, .tilt-card, .skill-expander-card, .filter-pill, .term-nav-item');
    soundTargets.forEach(target => {
        target.addEventListener('mouseenter', () => playBeep(520, 0.03, 'square'));
        target.addEventListener('click', () => playBeep(840, 0.07, 'triangle'));
    });

    /* ==========================================================================
       4. Interactive Paper Resume Unfold Modal Handlers & Execution Feedback
       ========================================================================== */
    const resumeModal = document.getElementById('resume-modal');
    const openResumeBtn = document.getElementById('open-resume-btn');
    const openResumeBtnNav = document.getElementById('open-resume-btn-nav');
    const resumeBtnText = document.getElementById('resume-btn-text');
    const resumeClose = document.getElementById('resume-close');

    const openResume = () => {
        if (resumeBtnText) {
            resumeBtnText.textContent = "$ exec ./resume";
        }
        playBeep(950, 0.1, 'sawtooth');

        setTimeout(() => {
            if (resumeModal) resumeModal.classList.add('show');
            if (resumeBtnText) resumeBtnText.textContent = "./resume --get";
        }, 220);
    };

    if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
    if (openResumeBtnNav) openResumeBtnNav.addEventListener('click', openResume);

    if (resumeClose && resumeModal) {
        resumeClose.addEventListener('click', () => {
            resumeModal.classList.remove('show');
        });
    }

    // Resume PDF check
    const resumeDownloadBtn = document.getElementById('resume-download-btn');
    if (resumeDownloadBtn) {
        fetch(resumeDownloadBtn.getAttribute('href'), { method: 'HEAD' })
            .then(res => {
                if (!res.ok) resumeDownloadBtn.style.display = 'none';
            })
            .catch(() => {
                // Keep visible for static PDF asset download
            });
    }

    const resumePrintBtn = document.getElementById('resume-print-btn');
    if (resumePrintBtn) {
        resumePrintBtn.addEventListener('click', () => {
            window.print();
        });
    }

    /* ==========================================================================
       4b. Formspree Contact Form Submission Handler
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const statusEl = document.getElementById('contact-form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (statusEl) {
                statusEl.textContent = "Sending your message via Formspree...";
                statusEl.classList.add('show');
            }

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (statusEl) statusEl.textContent = "Message sent successfully — thanks for reaching out!";
                    contactForm.reset();
                    showToast("Message Sent Successfully!");
                    playBeep(1000, 0.15);
                } else {
                    triggerMailtoFallback(name, email, message);
                }
            } catch (err) {
                triggerMailtoFallback(name, email, message);
            }
        });
    }

    const triggerMailtoFallback = (name, email, message) => {
        const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:mdshahroznasir@gmail.com?subject=${subject}&body=${body}`;
        if (statusEl) statusEl.textContent = "Opening your email app to deliver this message...";
        showToast("Opening Email Client...");
    };

    /* ==========================================================================
       5. Project Category Filter Engine
       ========================================================================== */
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectWindows = document.querySelectorAll('.apple-project-window');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filterVal = pill.getAttribute('data-filter');

            projectWindows.forEach(win => {
                const cat = win.getAttribute('data-category');
                if (filterVal === 'all' || cat === filterVal) {
                    win.classList.remove('hide');
                } else {
                    win.classList.add('hide');
                }
            });
            playBeep(820, 0.06);
        });
    });

    /* ==========================================================================
       6. Interactive Skill Category Expanders
       ========================================================================== */
    const expanderCards = document.querySelectorAll('.skill-expander-card');
    expanderCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('active');
            playBeep(750, 0.05);
        });
    });

    /* ==========================================================================
       7. Terminal Boot Loader Sequence
       ========================================================================== */
    const bootScreen = document.getElementById('boot-screen');
    const bootFill = document.getElementById('boot-fill');

    let progress = 0;
    const hideBootScreen = () => {
        if (bootScreen && !bootScreen.classList.contains('hide')) {
            if (bootFill) bootFill.style.width = '100%';
            bootScreen.classList.add('hide');
            setTimeout(() => {
                bootScreen.style.display = 'none';
            }, 800);
            initHeroAnimations();
        }
    };

    const bootInterval = setInterval(() => {
        progress += Math.floor(Math.random() * 25) + 20;
        if (progress >= 100) {
            progress = 100;
            if (bootFill) bootFill.style.width = '100%';
            clearInterval(bootInterval);
            setTimeout(hideBootScreen, 120);
        } else if (bootFill) {
            bootFill.style.width = `${progress}%`;
        }
    }, 40);

    // Failsafe max timeout: auto-dismiss after 600ms
    setTimeout(() => {
        clearInterval(bootInterval);
        hideBootScreen();
    }, 600);

    window.addEventListener('keydown', hideBootScreen);
    window.addEventListener('click', hideBootScreen);
    window.addEventListener('touchstart', hideBootScreen);

    /* ==========================================================================
       8. Custom Dual-Ring Cursor
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    if (window.innerWidth > 1024 && cursorDot && cursorRing) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const renderRing = () => {
            if (!document.hidden) {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
                cursorRing.style.left = `${ringX}px`;
                cursorRing.style.top = `${ringY}px`;
            }
            requestAnimationFrame(renderRing);
        };
        renderRing();

        const targets = document.querySelectorAll('a, button, .magnetic-target, .tilt-card, .dock-item, .skill-expander-card, .filter-pill, .term-nav-item');
        targets.forEach(t => {
            t.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
            t.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
        });
    }

    /* ==========================================================================
       9. Lazy-Initialized Three.js 3D Holographic Developer Workspace Scene
       ========================================================================== */
    const initThreeScene = () => {
        const container3D = document.getElementById('three-canvas-container');

        if (container3D && typeof THREE !== 'undefined') {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, container3D.clientWidth / container3D.clientHeight, 0.1, 1000);
            camera.position.set(0, 1.5, window.innerWidth < 768 ? 7.5 : 6);

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container3D.clientWidth, container3D.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container3D.appendChild(renderer.domElement);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);

            const pointLight1 = new THREE.PointLight(0x5B8CFF, 2, 10);
            pointLight1.position.set(2, 3, 2);
            scene.add(pointLight1);

            const pointLight2 = new THREE.PointLight(0x00E5A8, 2, 10);
            pointLight2.position.set(-2, -1, 2);
            scene.add(pointLight2);

            const laptopGroup = new THREE.Group();
            const baseGeo = new THREE.BoxGeometry(2.4, 0.1, 1.6);
            const baseMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.2, metalness: 0.8 });
            const baseMesh = new THREE.Mesh(baseGeo, baseMat);
            laptopGroup.add(baseMesh);

            const screenGroup = new THREE.Group();
            screenGroup.position.set(0, 0.05, -0.8);

            const lidGeo = new THREE.BoxGeometry(2.4, 1.5, 0.06);
            const lidMesh = new THREE.Mesh(lidGeo, baseMat);
            lidMesh.position.set(0, 0.75, 0);
            screenGroup.add(lidMesh);

            const displayGeo = new THREE.PlaneGeometry(2.2, 1.3);
            const displayMat = new THREE.MeshBasicMaterial({ color: 0x050816 });
            const displayMesh = new THREE.Mesh(displayGeo, displayMat);
            displayMesh.position.set(0, 0.75, 0.035);
            screenGroup.add(displayMesh);

            screenGroup.rotation.x = Math.PI * 0.1;
            laptopGroup.add(screenGroup);
            scene.add(laptopGroup);

            let targetRotX = 0, targetRotY = 0;
            window.addEventListener('mousemove', (e) => {
                const x = (e.clientX / window.innerWidth) - 0.5;
                const y = (e.clientY / window.innerHeight) - 0.5;
                targetRotY = x * 0.6;
                targetRotX = y * 0.4;
            });

            const animateThree = () => {
                if (!document.hidden) {
                    laptopGroup.rotation.y += (targetRotY - laptopGroup.rotation.y) * 0.05;
                    laptopGroup.rotation.x += (targetRotX - laptopGroup.rotation.x) * 0.05;
                    laptopGroup.position.y = Math.sin(Date.now() * 0.0015) * 0.1;
                    renderer.render(scene, camera);
                }
                requestAnimationFrame(animateThree);
            };
            animateThree();

            window.addEventListener('resize', () => {
                camera.aspect = container3D.clientWidth / container3D.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container3D.clientWidth, container3D.clientHeight);
            });
        }
    };

    // Lazy load Three.js canvas after full window load
    window.addEventListener('load', initThreeScene);

    /* ==========================================================================
       10. Interactive Background Particle Canvas
       ========================================================================== */
    const bgCanvas = document.getElementById('bg-particle-canvas');
    if (bgCanvas) {
        const ctx = bgCanvas.getContext('2d');
        let width = bgCanvas.width = window.innerWidth;
        let height = bgCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = bgCanvas.width = window.innerWidth;
            height = bgCanvas.height = window.innerHeight;
        });

        const particles = [];
        for (let i = 0; i < (window.innerWidth < 768 ? 30 : 60); i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        const animateBgParticles = () => {
            if (!document.hidden) {
                ctx.clearRect(0, 0, width, height);
                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) p.x = width;
                    if (p.x > width) p.x = 0;
                    if (p.y < 0) p.y = height;
                    if (p.y > height) p.y = 0;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(91, 140, 255, ${p.alpha})`;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#5B8CFF';
                    ctx.fill();
                });
            }
            requestAnimationFrame(animateBgParticles);
        };
        animateBgParticles();
    }

    /* ==========================================================================
       11. Live GitHub API Integration
       ========================================================================== */
    const ghContainer = document.getElementById('live-github-grid');
    const repoCounter = document.getElementById('repo-counter');

    const fetchGitHubData = async () => {
        try {
            const userRes = await fetch('https://api.github.com/users/shahroznasir');
            if (userRes.ok) {
                const userData = await userRes.json();
                if (repoCounter && userData.public_repos) {
                    repoCounter.textContent = `${userData.public_repos}+`;
                }
            }

            const reposRes = await fetch('https://api.github.com/users/shahroznasir/repos?sort=updated&per_page=6');
            if (reposRes.ok && ghContainer) {
                const reposData = await reposRes.json();
                ghContainer.innerHTML = '';

                reposData.slice(0, 6).forEach(repo => {
                    const card = document.createElement('a');
                    card.href = repo.html_url;
                    card.target = '_blank';
                    card.className = 'gh-repo-card glass-card tilt-card magnetic-target';
                    card.innerHTML = `
                        <div>
                            <h4><i class="bx bxl-github"></i> ${repo.name}</h4>
                            <p>${repo.description || 'Modern software engineering repository.'}</p>
                        </div>
                        <div class="gh-repo-meta">
                            <span><i class="bx bx-code-alt"></i> ${repo.language || 'Python'}</span>
                            <span><i class="bx bx-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="bx bx-git-repo-forked"></i> ${repo.forks_count}</span>
                        </div>
                    `;
                    ghContainer.appendChild(card);
                });
            }
        } catch (e) {
            // Offline fallback
        }
    };

    fetchGitHubData();

    /* ==========================================================================
       12. 1-Click Mobile vCard (.vcf) Generator
       ========================================================================== */
    const downloadVCard = () => {
        const vcardData = `BEGIN:VCARD
VERSION:3.0
FN:Md. Shahroz Nasir
TITLE:Software Engineer | AI & Full-Stack
EMAIL:mdshahroznasir@gmail.com
URL:https://github.com/shahroznasir
ADR:;;Bengaluru;Karnataka;;India
NOTE:Software Engineer specializing in AI, FastAPI, and Full-Stack Systems.
END:VCARD`;

        const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Md_Shahroz_Nasir_Contact.vcf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Downloaded vCard Contact (.vcf)");
    };

    document.querySelectorAll('.download-vcard-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadVCard();
        });
    });

    /* ==========================================================================
       13. Hero Typewriter Role Morphing Engine
       ========================================================================== */
    const roleEl = document.getElementById('role-typewriter');
    const roles = ["Software Engineer", "Backend Developer", "AI Enthusiast", "Open Source Contributor", "Problem Solver"];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    const typeRole = () => {
        if (!roleEl) return;
        const currentRole = roles[roleIdx];

        if (isDeleting) {
            roleEl.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            roleEl.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIdx === currentRole.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            speed = 400;
        }

        setTimeout(typeRole, speed);
    };

    typeRole();

    const initHeroAnimations = () => {
        if (typeof gsap !== 'undefined') {
            gsap.from('.hero-left > *', {
                opacity: 0,
                y: 30,
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out'
            });
        }
    };

    /* ==========================================================================
       14. Command Palette (Ctrl + K) & Theme Switcher
       ========================================================================== */
    const themeDropdown = document.getElementById('theme-dropdown');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const cmdModal = document.getElementById('cmd-modal');
    const cmdTrigger = document.getElementById('cmd-trigger');
    const dockCmdBtn = document.getElementById('dock-cmd-btn');
    const cmdInput = document.getElementById('cmd-input');
    const cmdResults = document.querySelectorAll('#cmd-results li');

    if (themeToggleBtn && themeDropdown) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('show');
            if (moreDropdown) moreDropdown.classList.remove('open');
        });
    }

    const openCmd = () => {
        if (cmdModal) cmdModal.classList.add('show');
        if (cmdInput) cmdInput.focus();
        playBeep(900, 0.08);
    };

    const closeCmd = () => {
        if (cmdModal) cmdModal.classList.remove('show');
    };

    if (cmdTrigger) cmdTrigger.addEventListener('click', (e) => { e.stopPropagation(); openCmd(); });
    if (dockCmdBtn) dockCmdBtn.addEventListener('click', openCmd);

    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (cmdModal.classList.contains('show')) closeCmd();
            else openCmd();
        }
        if (e.key === 'Escape') closeCmd();
    });

    cmdResults.forEach(item => {
        item.addEventListener('click', () => {
            const action = item.getAttribute('data-action');
            const target = item.getAttribute('data-target');

            if (action === 'goto' && target) {
                const el = document.querySelector(target);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (action === 'resume') {
                if (resumeModal) resumeModal.classList.add('show');
            } else if (action === 'vcard') {
                downloadVCard();
            } else if (action === 'email') {
                copyEmail();
            } else if (action === 'github') {
                window.open('https://github.com/shahroznasir', '_blank');
            }
            closeCmd();
        });
    });

    /* ==========================================================================
       15. Hacker Terminal ($ CLI)
       ========================================================================== */
    const termModal = document.getElementById('hacker-term-modal');
    const dockTermBtn = document.getElementById('dock-term-btn');
    const termClose = document.getElementById('term-close');
    const termInput = document.getElementById('term-input');
    const termBody = document.getElementById('term-body');

    if (dockTermBtn) dockTermBtn.addEventListener('click', () => { termModal.classList.add('show'); playBeep(800, 0.08); });
    if (termClose) termClose.addEventListener('click', () => termModal.classList.remove('show'));

    if (termInput && termBody) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = termInput.value.trim().toLowerCase();
                termInput.value = '';

                const line = document.createElement('p');
                line.className = 't-line';
                line.innerHTML = `<span class="prompt">$</span> ${cmd}`;
                termBody.appendChild(line);

                const res = document.createElement('p');
                res.className = 't-line';

                switch (cmd) {
                    case 'help':
                        res.innerHTML = `Available commands: <span class="t-gold">about</span>, <span class="t-gold">projects</span>, <span class="t-gold">skills</span>, <span class="t-gold">process</span>, <span class="t-gold">resume</span>, <span class="t-gold">contact</span>, <span class="t-gold">clear</span>, <span class="t-gold">matrix</span>`;
                        break;
                    case 'about':
                        res.textContent = "Md. Shahroz Nasir — Software Engineer specializing in AI, Backend, and Full Stack applications.";
                        break;
                    case 'projects':
                        res.textContent = "Projects: ADCB Card AI Platform, YouTube Summarizer, Social Media App API, Async TripPlanner.";
                        break;
                    case 'skills':
                        res.textContent = "Skills: Python, FastAPI, SQLAlchemy, Generative AI, PostgreSQL, Docker, AWS, React.";
                        break;
                    case 'process':
                        res.textContent = "Process: Planning -> Architecture -> Development -> Testing -> Deployment -> Monitoring.";
                        break;
                    case 'resume':
                        if (resumeModal) resumeModal.classList.add('show');
                        res.textContent = "Unfolding interactive paper resume...";
                        break;
                    case 'contact':
                        res.textContent = "Email: mdshahroznasir@gmail.com | Location: Bengaluru, India";
                        break;
                    case 'clear':
                        termBody.innerHTML = '';
                        return;
                    case 'matrix':
                        document.documentElement.setAttribute('data-theme', 'cyberpunk');
                        res.textContent = "Matrix Cyberpunk Mode Engaged.";
                        break;
                    default:
                        res.textContent = `Command not recognized: '${cmd}'. Type 'help' for commands.`;
                }

                termBody.appendChild(res);
                termBody.scrollTop = termBody.scrollHeight;
                playBeep(700, 0.05);
            }
        });
    }

    /* ==========================================================================
       16. AI Assistant Chatbot
       ========================================================================== */
    const aiDrawer = document.getElementById('ai-drawer');
    const dockAiBtn = document.getElementById('dock-ai-btn');
    const aiClose = document.getElementById('ai-close');
    const aiInput = document.getElementById('ai-input');
    const aiSend = document.getElementById('ai-send');
    const aiMessages = document.getElementById('ai-messages');

    if (dockAiBtn) dockAiBtn.addEventListener('click', () => { aiDrawer.classList.add('show'); playBeep(850, 0.08); });
    if (aiClose) aiClose.addEventListener('click', () => aiDrawer.classList.remove('show'));

    const handleAiSend = () => {
        const text = aiInput.value.trim();
        if (!text) return;
        aiInput.value = '';

        const userMsg = document.createElement('div');
        userMsg.className = 'ai-msg user';
        userMsg.textContent = text;
        aiMessages.appendChild(userMsg);

        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'ai-msg bot';

            const lower = text.toLowerCase();
            if (lower.includes('skill') || lower.includes('stack')) {
                botMsg.textContent = "Shahroz specializes in Python, FastAPI, Generative AI / LLMs, PostgreSQL, Docker, AWS, and React!";
            } else if (lower.includes('process') || lower.includes('build')) {
                botMsg.textContent = "Shahroz follows a 6-stage engineering process: 1. Planning -> 2. Architecture -> 3. Development -> 4. Testing -> 5. Deployment -> 6. Monitoring!";
            } else if (lower.includes('project') || lower.includes('work')) {
                botMsg.textContent = "Shahroz has created 37+ repositories! Highlights include the ADCB Card AI Platform, YouTube Summarizer, and Social Media API.";
            } else if (lower.includes('contact') || lower.includes('email') || lower.includes('hire')) {
                botMsg.textContent = "You can reach Shahroz at mdshahroznasir@gmail.com! He is based in Bengaluru, India and open for AI/Backend roles.";
            } else {
                botMsg.textContent = "Md. Shahroz Nasir is a Software Engineer passionate about building clean, scalable backend systems & AI applications!";
            }

            aiMessages.appendChild(botMsg);
            aiMessages.scrollTop = aiMessages.scrollHeight;
            playBeep(950, 0.06);
        }, 500);
    };

    if (aiSend) aiSend.addEventListener('click', handleAiSend);
    if (aiInput) aiInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleAiSend(); });

    /* ==========================================================================
       17. Konami Code Easter Egg (↑ ↑ ↓ ↓ ← → ← → B A)
       ========================================================================== */
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIdx = 0;

    window.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === konamiCode.length) {
                document.documentElement.setAttribute('data-theme', 'cyberpunk');
                showToast("KONAMI CODE DETECTED: CYBERPUNK MATRIX MODE ACTIVATED!");
                playBeep(1200, 0.2, 'sawtooth');
                konamiIdx = 0;
            }
        } else {
            konamiIdx = 0;
        }
    });

    /* ==========================================================================
       18. 5-Theme Engine Switcher
       ========================================================================== */
    const themeOptions = document.querySelectorAll('.theme-option');

    themeOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            themeOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            const themeName = opt.getAttribute('data-theme');
            document.documentElement.setAttribute('data-theme', themeName);
            showToast(`Switched theme to ${themeName.toUpperCase()}`);
            playBeep(1050, 0.08);

            // Hide popups!
            if (themeDropdown) themeDropdown.classList.remove('show');
            if (moreDropdown) moreDropdown.classList.remove('open');
        });
    });

    /* ==========================================================================
       19. Apple Fullscreen Case Study Modal
       ========================================================================== */
    const casestudyModal = document.getElementById('casestudy-modal');
    const casestudyClose = document.getElementById('casestudy-close');
    const casestudyBody = document.getElementById('casestudy-body');
    const openCaseBtns = document.querySelectorAll('.open-casestudy-btn');

    const caseData = {
        adcb: `
            <span class="proj-tag">CASE STUDY</span>
            <h2>ADCB Card AI Intelligence Platform</h2>
            <p style="color: var(--text-sub); margin-bottom: 30px;">An AI-driven profiling engine analyzing financial credit cards, reward metrics, and approval conditions using LLMs.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                    <h4 style="color: var(--secondary); margin-bottom: 10px;">The Problem</h4>
                    <p style="font-size: 13.5px; color: var(--text-sub);">Users struggle to analyze complex bank credit card terms, reward points, and qualification criteria across disparate PDF documentations.</p>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                    <h4 style="color: var(--primary); margin-bottom: 10px;">The Solution</h4>
                    <p style="font-size: 13.5px; color: var(--text-sub);">Integrated LLMs to query card data dynamically, returning structured JSON metrics and personalized reward recommendations.</p>
                </div>
            </div>
            <div style="display: flex; gap: 15px;">
                <a href="https://github.com/shahroznasir/adcb-card-ai-platform" target="_blank" class="btn btn-primary"><i class="bx bx-rocket"></i> Live Demo ↗</a>
                <a href="https://github.com/shahroznasir/adcb-card-ai-platform" target="_blank" class="btn btn-outline"><i class="bx bxl-github"></i> GitHub Repo</a>
            </div>
        `,
        youtube: `
            <span class="proj-tag">CASE STUDY</span>
            <h2>YouTube Video Summarizer &amp; Pipeline</h2>
            <p style="color: var(--text-sub); margin-bottom: 30px;">Automated transcript processing pipeline extracting executive summaries and query highlights via OpenAI API.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                    <h4 style="color: var(--secondary); margin-bottom: 10px;">The Problem</h4>
                    <p style="font-size: 13.5px; color: var(--text-sub);">Extracting key technical knowledge from multi-hour video lectures requires excessive manual watching time.</p>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                    <h4 style="color: var(--primary); margin-bottom: 10px;">The Solution</h4>
                    <p style="font-size: 13.5px; color: var(--text-sub);">Built FastAPI + Streamlit service that auto-transcribes video IDs and generates timestamped bullet summaries.</p>
                </div>
            </div>
            <div style="display: flex; gap: 15px;">
                <a href="https://github.com/shahroznasir/youtube-summarizer" target="_blank" class="btn btn-primary"><i class="bx bx-rocket"></i> Live Demo ↗</a>
                <a href="https://github.com/shahroznasir/youtube-summarizer" target="_blank" class="btn btn-outline"><i class="bx bxl-github"></i> GitHub Repo</a>
            </div>
        `,
        social: `
            <span class="proj-tag">CASE STUDY</span>
            <h2>Social Media Scalable REST API</h2>
            <p style="color: var(--text-sub); margin-bottom: 30px;">Production-grade Python FastAPI backend with JWT authentication, relational PostgreSQL schemas, and rate-limiting.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                    <h4 style="color: var(--secondary); margin-bottom: 10px;">The Architecture</h4>
                    <p style="font-size: 13.5px; color: var(--text-sub);">FastAPI async endpoints, SQLAlchemy ORM, PostgreSQL connection pools, Pydantic data validation schemas.</p>
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 12px;">
                    <h4 style="color: var(--primary); margin-bottom: 10px;">The Result</h4>
                    <p style="font-size: 13.5px; color: var(--text-sub);">Sub-50ms endpoint response latencies, robust password hashing, and clean architectural separation of concerns.</p>
                </div>
            </div>
            <div style="display: flex; gap: 15px;">
                <a href="https://github.com/shahroznasir/social-media-api" target="_blank" class="btn btn-primary"><i class="bx bx-rocket"></i> Live Demo ↗ (API Specs)</a>
                <a href="https://github.com/shahroznasir/social-media-api" target="_blank" class="btn btn-outline"><i class="bx bxl-github"></i> GitHub Repo</a>
            </div>
        `
    };

    openCaseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const caseKey = btn.getAttribute('data-case');
            if (casestudyBody && caseData[caseKey]) {
                casestudyBody.innerHTML = caseData[caseKey];
                casestudyModal.classList.add('show');
                playBeep(900, 0.08);
            }
        });
    });

    if (casestudyClose) casestudyClose.addEventListener('click', () => casestudyModal.classList.remove('show'));

    /* ==========================================================================
       20. 1-Click Copy Email & Toast Notification
       ========================================================================== */
    const targetEmail = "mdshahroznasir@gmail.com";
    const toast = document.getElementById('toast');
    const copyEmail = () => {
        navigator.clipboard.writeText(targetEmail).then(() => {
            showToast(`Copied ${targetEmail} to clipboard!`);
            playBeep(1100, 0.08);
        }).catch(() => {
            showToast(`Email: ${targetEmail}`);
        });
    };

    const showToast = (msg) => {
        if (!toast) return;
        const msgEl = document.getElementById('toast-message');
        if (msgEl) msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3200);
    };

    document.querySelectorAll('.copy-email-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            copyEmail();
        });
    });

    /* ==========================================================================
       21. 3D Card Tilt Physics & Mobile Navigation
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotX = ((y - cy) / cy) * -6;
            const rotY = ((x - cx) / cx) * 6;
            card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    const sidebar = document.getElementById('mobile-sidebar');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    if (menuToggle && sidebar && menuClose) {
        menuToggle.addEventListener('click', () => sidebar.classList.add('active'));
        menuClose.addEventListener('click', () => sidebar.classList.remove('active'));
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => sidebar.classList.remove('active'));
        });
    }
});