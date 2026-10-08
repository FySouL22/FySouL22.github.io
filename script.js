/* ================================================================
   Ft7y.Sec - Advanced Cyber Interactive Script
   Features:
   - Scroll Progress Indicator Bar
   - Matrix Digital Rain & Particle Canvas
   - Terminal Command Auto-Typing Simulation
   - Platform Tabs & Interactive Writeups Filtering
   - Auto-fill Contact Form on Report Request- Animated Skill Progress Bars on Scroll
   - 3D Card Perspective Tilt Effect on Mousemove
   - Dark / Light Mode Switcher with LocalStorage
   - Smooth Scroll Spy & Sticky Navbar
   - Email Clipboard Copy with Toast
   - Back to Top Button
   - Cyber Cursor Glow
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Respect reduced-motion preference before starting decorative effects.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
        document.documentElement.classList.add('reduced-motion');
    }


    // ----------------------------------------------------
    // 1. تهيئة مكتبة AOS للحركات
    // ----------------------------------------------------
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 80
        });
    }

    // ----------------------------------------------------
    // 2. محاكاة سطر الأوامر (Terminal Auto-Typing Effect)
    // ----------------------------------------------------
    const typedTextEl = document.getElementById('typed-text');
    if (typedTextEl && reduceMotion) typedTextEl.textContent = 'Security research • CTF • Python';
    if (typedTextEl && !reduceMotion) {
        const commands = [
            'nmap -sV -sC -T4 10.10.10.x',
            'gobuster dir -u https://target -w /wordlists/raft.txt',
            'hydra -l admin -P rockyou.txt ssh://target',
            'sqlmap -u "https://victim.com/item?id=1" --dbs',
            'msfconsole -q -x "use exploit/multi/handler"',
            'whoami && id # Welcome to Ft7y.Sec'
        ];
        let cmdIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeLoop() {
            const currentCmd = commands[cmdIndex];

            if (isDeleting) {
                typedTextEl.textContent = currentCmd.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typedTextEl.textContent = currentCmd.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentCmd.length) {
                isDeleting = true;
                typeSpeed = 1800;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                cmdIndex = (cmdIndex + 1) % commands.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }
        typeLoop();
    }

    // ----------------------------------------------------
    // 3. خلفية الماتركس الخضراء (Matrix Digital Rain)
    // ----------------------------------------------------
    const matrixCanvas = document.getElementById('matrix-canvas');
    if (matrixCanvas && !reduceMotion) {
        const ctx = matrixCanvas.getContext('2d');
        function resizeMatrix() {
            if (!matrixCanvas.parentElement) return;
            matrixCanvas.width = matrixCanvas.parentElement.offsetWidth;
            matrixCanvas.height = matrixCanvas.parentElement.offsetHeight;
        }
        resizeMatrix();
        window.addEventListener('resize', resizeMatrix);

        const chars = '01FT7Y_SEC_CYBER_EXPLOIT_ROOT_PENTEST_CTF_<>{}[]=/*+~';
        const fontSize = 14;
        let columns = Math.floor(matrixCanvas.width / fontSize) || 40;
        let drops = Array(columns).fill(1);

        window.addEventListener('resize', () => {
            columns = Math.floor(matrixCanvas.width / fontSize) || 40;
            drops = Array(columns).fill(1);
        });

        function drawMatrix() {
            ctx.fillStyle = 'rgba(10, 15, 29, 0.08)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            ctx.fillStyle = '#00ff66';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        setInterval(drawMatrix, 40);
    }

    // ----------------------------------------------------
    // 4. شبكة الجزيئات السيبرانية التفاعلية (Particle Network)
    // ----------------------------------------------------
    const pCanvas = document.getElementById('particles-canvas');
    if (pCanvas && !reduceMotion) {
        const pCtx = pCanvas.getContext('2d');
        let width = pCanvas.width = window.innerWidth;
        let height = pCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = pCanvas.width = window.innerWidth;
            height = pCanvas.height = window.innerHeight;
        });

        const particles = [];
        const numParticles = Math.min(width > 768 ? 50 : 22, 55);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.7;
                this.vy = (Math.random() - 0.5) * 0.7;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                pCtx.beginPath();
                pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                pCtx.fillStyle = 'rgba(0, 255, 102, 0.4)';
                pCtx.fill();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            pCtx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        pCtx.beginPath();
                        pCtx.strokeStyle = `rgba(0, 255, 102, ${0.15 * (1 - dist / 120)})`;
                        pCtx.lineWidth = 0.7;
                        pCtx.moveTo(particles[i].x, particles[i].y);
                        pCtx.lineTo(particles[j].x, particles[j].y);
                        pCtx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ----------------------------------------------------
    // 5. تصفية التقارير حسب المنصة (Platform Filtering)
    // ----------------------------------------------------
    // Homepage write-up filtering (legacy + current card markup).
    const platformTabs = document.querySelectorAll('.platform-tab[data-platform], .platform-tab[data-platform-filter]');
    const writeupCards = document.querySelectorAll('.writeup-card, .writeup-media-card');

    platformTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            platformTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const platform = tab.getAttribute('data-platform') || tab.getAttribute('data-platform-filter');

            writeupCards.forEach(card => {
                const category = card.getAttribute('data-category') || '';
                const visible = platform === 'all' || category === platform;
                card.hidden = !visible;
                card.setAttribute('aria-hidden', String(!visible));
            });
        });
    });

    // CTF archive: platform filtering + full-text search.
    const ctfFilterButtons = document.querySelectorAll('[data-platform-filter]');
    const ctfCards = document.querySelectorAll('.writeup-media-card');
    const ctfSections = document.querySelectorAll('[data-platform-section]');
    const ctfSearch = document.getElementById('writeupFilterInput');

    function applyCtfArchiveFilter() {
        const activeButton = document.querySelector('[data-platform-filter].active');
        const platform = activeButton?.getAttribute('data-platform-filter') || 'all';
        const query = (ctfSearch?.value || '').toLowerCase().trim();

        ctfCards.forEach(card => {
            const category = card.getAttribute('data-category') || '';
            const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
            const text = card.textContent.toLowerCase();
            const visible = (platform === 'all' || category === platform) &&
                (!query || keywords.includes(query) || text.includes(query));
            card.hidden = !visible;
        });

        ctfSections.forEach(section => {
            const visibleCards = [...section.querySelectorAll('.writeup-media-card')].some(card => !card.hidden);
            section.hidden = !visibleCards;
        });
    }

    ctfFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            ctfFilterButtons.forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            applyCtfArchiveFilter();
        });
    });

    ctfSearch?.addEventListener('input', applyCtfArchiveFilter);

    // ----------------------------------------------------
    // 6. الربط التفاعلي لطلب التقارير بنموذج التواصل (Report Autofill)
    // ----------------------------------------------------
    const reportButtons = document.querySelectorAll('.link-more');
    const subjectInput = document.getElementById('subject');
    const nameInput = document.getElementById('name');
    const contactFormContainer = document.querySelector('.contact-form-container');

    reportButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = btn.closest('.writeup-card');
            const titleEl = card ? card.querySelector('.writeup-title') : null;
            if (titleEl && subjectInput) {
                const reportTitle = titleEl.textContent.trim();
                subjectInput.value = `طلب تقرير: ${reportTitle}`;
                
                // Highlight contact form with subtle glow
                if (contactFormContainer) {
                    contactFormContainer.style.borderColor = 'var(--accent-color)';
                    contactFormContainer.style.boxShadow = '0 0 30px rgba(0,255,102,0.3)';
                    setTimeout(() => {
                        contactFormContainer.style.borderColor = '';
                        contactFormContainer.style.boxShadow = '';
                    }, 2500);
                }

                if (nameInput) {
                    setTimeout(() => nameInput.focus(), 600);
                }
            }
        });
    });

    // ----------------------------------------------------
    // 8. تحريك أشرطة المهارات والمنصات (Progress Bars)
    // ----------------------------------------------------
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillsSection = document.getElementById('skills');

    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                skillFills.forEach(fill => {
                    const targetWidth = fill.getAttribute('data-width');
                    fill.style.width = targetWidth;
                });
            }
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    }

    const pstatFills = document.querySelectorAll('.pstat-fill');
    const writeupsSection = document.getElementById('writeups');
    if (writeupsSection) {
        const pstatObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                pstatFills.forEach(fill => {
                    const numText = fill.closest('.pstat')?.querySelector('.pstat-num')?.textContent;
                    if (numText) {
                        fill.style.width = numText;
                    }
                });
            }
        }, { threshold: 0.2 });
        pstatObserver.observe(writeupsSection);
    }

    // ----------------------------------------------------
    // 9. تأثير الإمالة ثلاثية الأبعاد للبطاقات (3D Tilt Effect)
    // ----------------------------------------------------
    const tiltCards = document.querySelectorAll('.project-card, .writeup-card, .skill-category-card, ');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // ----------------------------------------------------
    // 10. الوضع الداكن / الفاتح (Theme Switcher)
    // ----------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('ft7y-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('ft7y-theme', isLight ? 'light' : 'dark');
        });
    }

    // ----------------------------------------------------
    // 11. شريط التنقل المتجاوب، مؤشر التمرير، والروابط النشطة
    // ----------------------------------------------------
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const backToTop = document.getElementById('back-to-top');
    const scrollProgress = document.getElementById('scroll-progress');

    if (mobileToggle && navMenu) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', String(navMenu.classList.contains('active')));
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Scroll Progress Bar
        if (scrollProgress) {
            const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = totalScroll > 0 ? (scrollY / totalScroll) * 100 : 0;
            scrollProgress.style.width = `${progress}%`;
        }

        // Sticky Navbar
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (backToTop) {
            if (scrollY > 350) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Scroll Spy
        let currentSection = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 220;
            if (scrollY >= secTop) {
                currentSection = sec.getAttribute('id');
            }
        });

        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.addEventListener('click', async (event) => {
        const copyButton = event.target.closest('.ctf-copy-code');
        if (!copyButton) return;

        const code = copyButton.closest('.ctf-code-block')?.querySelector('code');
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code.textContent);
            showToast('تم نسخ الكود بنجاح.');
        } catch (error) {
            showToast('تعذر النسخ تلقائياً، يرجى نسخ الكود يدوياً.');
        }
    });

    // ----------------------------------------------------
    // 12. نسخ البريد الإلكتروني مع إشعار Toast
    // ----------------------------------------------------
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    const toast = document.getElementById('toast');

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    }

    if (copyEmailBtn && emailText) {
        copyEmailBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(emailText.textContent.trim());
                showToast('✓ تم نسخ البريد الإلكتروني بنجاح!');
            } catch (err) {
                showToast('خطأ في النسخ، يرجى التحديد والنسخ يدوياً.');
            }
        });
    }

    // ----------------------------------------------------
    // 13. معالجة نموذج التواصل مع إشعار تفاعلي
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');
    const submitBtn = document.getElementById('form-submit');

    if (contactForm && formAlert) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !subject || !message) {
                formAlert.className = 'form-alert error';
                formAlert.textContent = 'يرجى استيفاء كافة الحقول المطلوبة.';
                return;
            }

            const body = [
                'Name: ' + name,
                'Reply email: ' + email,
                '',
                message
            ].join('\\n');

            const mailto = 'mailto:ft7y.sec@proton.me'
                + '?subject=' + encodeURIComponent(subject)
                + '&body=' + encodeURIComponent(body);

            formAlert.className = 'form-alert success';
            formAlert.textContent = 'سيتم فتح برنامج البريد لإرسال الرسالة. لم يتم الادعاء بإرسالها قبل تأكيدك.';
            window.location.href = mailto;
        });
    }

    // ----------------------------------------------------
    // 14. توهج الماوس السيبراني (Cyber Cursor Glow)
    // ----------------------------------------------------
    // Skip the custom cursor effect on touch/coarse-pointer devices.
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    } else {
        cursorGlow.remove();
    }

    // ----------------------------------------------------
    // 15. نسخ الأوامر البرمجية ونصوص الأكواد (Copy Commands & Code)
    // ----------------------------------------------------
    document.addEventListener('click', async (e) => {
        const copyBtn = e.target.closest('.copy-cmd-btn, .copy-code-btn');
        if (!copyBtn) return;

        e.preventDefault();
        e.stopPropagation();

        let textToCopy = copyBtn.getAttribute('data-cmd') || '';

        if (!textToCopy) {
            // Check inside adjacent row or container
            const cmdRow = copyBtn.closest('.cmd-code-row');
            if (cmdRow) {
                const textEl = cmdRow.querySelector('.cmd-text');
                if (textEl) textToCopy = textEl.textContent.trim();
            }
        }

        if (!textToCopy) {
            const codeWindow = copyBtn.closest('.code-window');
            if (codeWindow) {
                const preCode = codeWindow.querySelector('pre code, .window-content');
                if (preCode) textToCopy = preCode.textContent.trim();
            }
        }

        if (!textToCopy) {
            const parent = copyBtn.parentElement;
            if (parent) {
                const codeEl = parent.querySelector('code, pre');
                if (codeEl) textToCopy = codeEl.textContent.trim();
            }
        }

        if (textToCopy) {
            try {
                await navigator.clipboard.writeText(textToCopy);
                const originalHtml = copyBtn.innerHTML;
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ!';
                showToast('✓ تم نسخ الأمر إلى الحافظة!');

                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = originalHtml;
                }, 2000);
            } catch (err) {
                showToast('تعذر النسخ تلقائياً، يرجى التحديد والنسخ يدوياً.');
            }
        }
    });

    // ----------------------------------------------------
    // 16. البحث والفلترة الحية لصفحات المهارات (Live Search & Filter)
    // ----------------------------------------------------
    const searchInput = document.querySelector('.search-input');
    const searchClearBtn = document.querySelector('.search-clear-btn');
    const chipBtns = document.querySelectorAll('.chip-btn');
    const filterableCards = document.querySelectorAll('.tool-card, .vuln-card, .script-card');

    if (searchInput || chipBtns.length > 0) {
        let activeCategory = 'all';

        function applySubpageFilter() {
            const query = (searchInput ? searchInput.value : '').toLowerCase().trim();

            if (searchClearBtn) {
                searchClearBtn.style.display = query ? 'block' : 'none';
            }

            filterableCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category') || '';
                const cardText = card.textContent.toLowerCase();

                const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
                const matchesQuery = !query || cardText.includes(query);

                if (matchesCategory && matchesQuery) {
                    card.style.display = '';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    card.style.display = 'none';
                }
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', applySubpageFilter);
        }

        if (searchClearBtn && searchInput) {
            searchClearBtn.addEventListener('click', () => {
                searchInput.value = '';
                searchInput.focus();
                applySubpageFilter();
            });
        }

        chipBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                chipBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.getAttribute('data-category') || 'all';
                applySubpageFilter();
            });
        });
    }

    // ----------------------------------------------------
    // 17. محاكي أداة PyPort-Scanner Pro التفاعلي (Web Simulator)
    // ----------------------------------------------------
    const simRunBtn = document.getElementById('sim-run-btn');
    const simTargetInput = document.getElementById('sim-target');
    const simProfileSelect = document.getElementById('sim-profile');
    const simThreadsSelect = document.getElementById('sim-threads');
    const simOutput = document.getElementById('sim-output');
    const simProgressWrap = document.getElementById('sim-progress-wrap');
    const simProgress = document.getElementById('sim-progress');
    const simClearBtn = document.getElementById('sim-clear-btn');
    const simDownloadBtn = document.getElementById('sim-download-btn');

    let currentScanData = null;

    if (simRunBtn && simOutput) {
        simClearBtn.addEventListener('click', () => {
            simOutput.innerHTML = '<div class="term-line prompt">root@ft7y:~$ clear</div>';
            if (simDownloadBtn) simDownloadBtn.style.display = 'none';
        });

        simRunBtn.addEventListener('click', () => {
            const rawTarget = (simTargetInput ? simTargetInput.value.trim() : '') || '10.10.10.85';
            const target = rawTarget.replace(/[&<>\"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[char]));
            const profile = simProfileSelect ? simProfileSelect.value : 'top20';
            const workers = simThreadsSelect ? simThreadsSelect.value : '50';

            simRunBtn.disabled = true;
            simRunBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الفحص...';
            if (simProgressWrap) simProgressWrap.style.display = 'block';
            if (simProgress) simProgress.style.width = '0%';
            if (simDownloadBtn) simDownloadBtn.style.display = 'none';

            simOutput.innerHTML = `
                <div class="term-line prompt">root@ft7y:~$ python pyport_scanner.py -t ${target} -p ${profile} -w ${workers} -b</div>
                <div class="term-line banner">  ███████╗████████╗███████╗██╗   ██╗    ███████╗███████╗ ██████╗</div>
                <div class="term-line banner">  ██╔════╝╚══██╔══╝╚════██║╚██╗ ██╔╝    ██╔════╝██╔════╝██╔════╝</div>
                <div class="term-line banner">  █████╗     ██║       ██╔╝ ╚████╔╝     ███████╗█████╗  ██║     </div>
                <div class="term-line banner">  ██╔══╝     ██║      ██╔╝   ╚██╔╝      ╚════██║██╔══╝  ██║     </div>
                <div class="term-line banner">  ██║        ██║      ███████╗██║       ███████║███████╗╚██████╗</div>
                <div class="term-line banner">  -- PyPort-Scanner Pro v2.5 by Mohamed Fathi (Ft7y.Sec) --</div>
                <div class="term-line info">[*] Target Host : ${target} (Resolved: 10.10.10.85)</div>
                <div class="term-line info">[*] Concurrency : ${workers} Workers | Timeout: 0.8s</div>
                <div class="term-line info">[*] Scan Started : ${new Date().toLocaleTimeString()}</div>
                <div class="term-line info">-----------------------------------------------------------------</div>
            `;

            const simulatedResults = [
                { port: 21, service: "FTP", banner: "vsftpd 3.0.3 (Ubuntu)", latency: "24ms" },
                { port: 22, service: "SSH", banner: "OpenSSH 8.9p1 Ubuntu-3ubuntu0.1", latency: "18ms" },
                { port: 53, service: "DNS", banner: "ISC BIND 9.18.1", latency: "15ms" },
                { port: 80, service: "HTTP", banner: "Apache/2.4.52 (Ubuntu) Server", latency: "12ms" },
                { port: 139, service: "NetBIOS", banner: "Samba smbd 4.6.2", latency: "31ms" },
                { port: 443, service: "HTTPS", banner: "OpenSSL/3.0.2 nginx/1.18.0", latency: "19ms" },
                { port: 445, service: "SMB", banner: "Windows Server 2022 SMBv3", latency: "22ms" },
                { port: 3306, service: "MySQL", banner: "MySQL Community Server 8.0.35", latency: "28ms" },
                { port: 8080, service: "HTTP-Proxy", banner: "Werkzeug/2.2.2 Python/3.10.12", latency: "14ms" }
            ];

            let step = 0;
            const totalSteps = simulatedResults.length;

            const interval = setInterval(() => {
                if (step < totalSteps) {
                    const item = simulatedResults[step];
                    const line = document.createElement('div');
                    line.className = 'term-line success';
                    line.innerHTML = `[+] Port <span style="color:#00ff66;font-weight:bold;">${item.port}</span>/TCP <strong>OPEN</strong> (${item.service}) <span style="color:#38bdf8;">| ${item.banner}</span> <span style="color:#94a3b8;font-size:11px;">[${item.latency}]</span>`;
                    simOutput.appendChild(line);
                    simOutput.scrollTop = simOutput.scrollHeight;

                    step++;
                    const percent = Math.floor((step / totalSteps) * 100);
                    if (simProgress) simProgress.style.width = `${percent}%`;
                } else {
                    clearInterval(interval);
                    const finishLine = document.createElement('div');
                    finishLine.className = 'term-line info';
                    finishLine.innerHTML = `
                        -----------------------------------------------------------------<br>
                        <span style="color:#00ff66;font-weight:bold;">[✓] Scan Finished: ${totalSteps} open port(s) detected in 1.34s.</span>
                    `;
                    simOutput.appendChild(finishLine);
                    simOutput.scrollTop = simOutput.scrollHeight;

                    simRunBtn.disabled = false;
                    simRunBtn.innerHTML = '<i class="fa-solid fa-play"></i> بدء الفحص الآن';
                    if (simDownloadBtn) simDownloadBtn.style.display = 'inline-flex';

                    currentScanData = {
                        scanner: "PyPort-Scanner Pro v2.5",
                        author: "Mohamed Fathi (Ft7y.Sec)",
                        target: target,
                        timestamp: new Date().toISOString(),
                        open_ports: simulatedResults
                    };
                    showToast('✓ اكتمل فحص المنافذ بنجاح!');
                }
            }, 220);
        });

        if (simDownloadBtn) {
            simDownloadBtn.addEventListener('click', () => {
                if (!currentScanData) return;
                const blob = new Blob([JSON.stringify(currentScanData, null, 4)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `pyport_scan_${currentScanData.target}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('✓ تم تحميل تقرير الفحص بنجاح!');
            });
        }
    }

    // ----------------------------------------------------
    // 18. محاكي أداة SubDomain Reckoner التفاعلي (Live OSINT)
    // ----------------------------------------------------
    const subRunBtn = document.getElementById('sub-run-btn');
    const subTargetInput = document.getElementById('sub-target');
    const subOutput = document.getElementById('sub-output');
    const subProgressWrap = document.getElementById('sub-progress-wrap');
    const subProgress = document.getElementById('sub-progress');
    const subClearBtn = document.getElementById('sub-clear-btn');
    const subExportBtn = document.getElementById('sub-export-btn');

    let currentSubData = null;

    if (subRunBtn && subOutput) {
        subClearBtn.addEventListener('click', () => {
            subOutput.innerHTML = '<div class="term-line prompt">root@ft7y:~$ clear</div>';
            if (subExportBtn) subExportBtn.style.display = 'none';
        });

        subRunBtn.addEventListener('click', () => {
            const domain = (subTargetInput ? subTargetInput.value.trim() : '') || 'tesla.com';

            subRunBtn.disabled = true;
            subRunBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الاستطلاع...';
            if (subProgressWrap) subProgressWrap.style.display = 'block';
            if (subProgress) subProgress.style.width = '0%';
            if (subExportBtn) subExportBtn.style.display = 'none';

            subOutput.innerHTML = `
                <div class="term-line prompt">root@ft7y:~$ python subdomain_reckoner.py -d ${domain} --probe</div>
                <div class="term-line banner">  ███████╗██╗   ██╗██████╗ ██████╗  ██████╗ ███╗   ███╗ █████╗</div>
                <div class="term-line banner">  -- SubDomain Reckoner v2.0 by Mohamed Fathi (Ft7y.Sec) --</div>
                <div class="term-line info">[*] Target Domain: ${domain}</div>
                <div class="term-line info">[*] Mode         : Passive OSINT (crt.sh + HackerTarget API)</div>
                <div class="term-line warn">[*] Querying Certificate Transparency Logs...</div>
            `;

            const simulatedSubs = [
                { sub: `api.${domain}`, ip: "104.26.10.12", code: 200, title: "API Gateway Service", server: "cloudflare" },
                { sub: `auth.${domain}`, ip: "104.26.11.12", code: 200, title: "Single Sign-On Login", server: "nginx" },
                { sub: `admin.${domain}`, ip: "198.51.100.4", code: 403, title: "403 Forbidden - Internal Only", server: "Apache" },
                { sub: `dev.${domain}`, ip: "203.0.113.88", code: 200, title: "Development Portal Staging", server: "Werkzeug" },
                { sub: `vpn.${domain}`, ip: "198.51.100.99", code: 302, title: "GlobalProtect Portal Login", server: "PAN-OS" },
                { sub: `mail.${domain}`, ip: "104.26.12.12", code: 200, title: "Webmail Access Client", server: "Microsoft-IIS/10.0" },
                { sub: `cdn.${domain}`, ip: "151.101.65.140", code: 200, title: "Static Content Delivery", server: "Fastly" }
            ];

            let i = 0;
            const total = simulatedSubs.length;

            const interval = setInterval(() => {
                if (i < total) {
                    const item = simulatedSubs[i];
                    const line = document.createElement('div');
                    line.className = 'term-line success';
                    const codeColor = item.code === 200 ? '#00ff66' : (item.code === 403 ? '#f87171' : '#facc15');
                    line.innerHTML = `[+] <span style="color:#00ff66;font-weight:bold;">${item.sub}</span> | IP: ${item.ip} | <span style="color:${codeColor};font-weight:bold;">[${item.code}]</span> | ${item.title} <span style="color:#94a3b8;">(${item.server})</span>`;
                    subOutput.appendChild(line);
                    subOutput.scrollTop = subOutput.scrollHeight;

                    i++;
                    const percent = Math.floor((i / total) * 100);
                    if (subProgress) subProgress.style.width = `${percent}%`;
                } else {
                    clearInterval(interval);
                    const finishLine = document.createElement('div');
                    finishLine.className = 'term-line info';
                    finishLine.innerHTML = `
                        -----------------------------------------------------------------<br>
                        <span style="color:#00ff66;font-weight:bold;">[✓] Finished: Discovered ${total} active subdomains for ${domain}.</span>
                    `;
                    subOutput.appendChild(finishLine);
                    subOutput.scrollTop = subOutput.scrollHeight;

                    subRunBtn.disabled = false;
                    subRunBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> استكشاف النطاقات';
                    if (subExportBtn) subExportBtn.style.display = 'inline-flex';

                    currentSubData = simulatedSubs.map(s => `${s.sub} [IP: ${s.ip}] - [${s.code}]`).join('\n');
                    showToast('✓ تم استكشاف النطاقات بنجاح!');
                }
            }, 250);
        });

        if (subExportBtn) {
            subExportBtn.addEventListener('click', () => {
                if (!currentSubData) return;
                const blob = new Blob([currentSubData], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `subdomains_discovered.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('✓ تم تصدير قائمة النطاقات!');
            });
        }
    }

    // ----------------------------------------------------
    // 19. محاكي تنبيهات الـ SOC وهجمات المعمل (Wazuh SIEM Simulator)
    // ----------------------------------------------------
    const socButtons = document.querySelectorAll('.btn-soc-attack');
    const socOutput = document.getElementById('soc-output');
    const socClearBtn = document.getElementById('soc-clear-btn');

    const attackScenarios = {
        mimikatz: {
            title: "محاولة استخراج كلمات المرور من ذاكرة LSASS عبر Mimikatz",
            desc: "تم رصد محاولة قراءة غير مصرح بها لعملية lsass.exe عبر استدعاء OpenProcess بأذونات PROCESS_VM_READ المشبوهة.",
            level: "CRITICAL",
            levelBadge: "Level 14 - Critical",
            source: "Sysmon Event 10 (ProcessAccess)",
            rule: "Rule ID 100120 - Mimikatz / Sekurlsa Detection",
            mitre: "T1003.001 - OS Credential Dumping: LSASS Memory",
            agent: "WS01.LAB.LOCAL (192.168.10.20)",
            remediation: "عزل الجهاز فورياً، تفعيل Credential Guard، وإلغاء صلاحيات حساب المستخدم المستغل."
        },
        bruteforce: {
            title: "هجوم تخمين مكثف SSH Brute Force Attack",
            desc: "تجاوز معدل محاولات تسجيل الدخول الفاشلة عتبة 10 محاولات خلال 15 ثانية من نفس عنوان IP للمهاجم.",
            level: "HIGH",
            levelBadge: "Level 10 - High",
            source: "Linux Auth Log (/var/log/auth.log)",
            rule: "Rule ID 5712 - SSH brute force attempt detected",
            mitre: "T1110.001 - Password Guessing",
            agent: "Kali-Host (192.168.10.50)",
            remediation: "حظر عنوان IP المهاجم عبر Fail2ban / UFW، وحظر كلمة السر وإلزام تسجيل الدخول بمفاتيح SSH."
        },
        portscan: {
            title: "فحص استطلاعي سريع للشبكة Nmap SYN Port Scan",
            desc: "رصد إرسال مئات حزم TCP SYN دون إكمال المصافحة الثلاثية بهدف رسم خريطة المنافذ والخدمات العاملة.",
            level: "HIGH",
            levelBadge: "Level 8 - Warning",
            source: "Suricata IDS / Wazuh Network Decoders",
            rule: "Rule ID 87102 - Network Port Scan Activity Detected",
            mitre: "T1046 - Network Service Discovery",
            agent: "pfSense Firewall Gateway (192.168.10.1)",
            remediation: "إدراج IP المصدر في قائمة الحظر المؤقتة لجدار الحماية pfSense."
        },
        domainadmin: {
            title: "إنشاء أو إضافة مستخدم لمجموعة Domain Admins",
            desc: "تم استدعاء إضافة حساب مستخدم جديد إلى مجموعة مدراء الدومين الحساسة في وقت غير معتاد خارج ساعات العمل.",
            level: "CRITICAL",
            levelBadge: "Level 13 - Critical",
            source: "Windows Security Event 4728 (Member Added to Security Group)",
            rule: "Rule ID 60105 - Privileged Group Membership Modification",
            mitre: "T1078.002 - Domain Accounts Privilege Abuse",
            agent: "DC01.LAB.LOCAL (192.168.10.10)",
            remediation: "سحب الصلاحية فوراً، مراجعة سجلات جلسة المستخدم المنفذ، والتحقق من سلامة Domain Controller."
        }
    };

    if (socButtons.length > 0 && socOutput) {
        if (socClearBtn) {
            socClearBtn.addEventListener('click', () => {
                socOutput.innerHTML = `
                    <div class="soc-event-card info-event">
                        <div class="event-top">
                            <span class="badge-soc-status online"><span class="pulse-dot"></span> Wazuh Manager Active</span>
                            <span class="event-time">192.168.10.10 (DC01.LAB.LOCAL)</span>
                        </div>
                        <div class="event-title">تم مسح السجل - المعمل جاهز للاختبار</div>
                        <div class="event-desc">انقر على أحد أزرار محاكاة الهجمات أعلاه لتوليد أحداث أمنية ورصدها في الزمن الحقيقي.</div>
                    </div>
                `;
            });
        }

        socButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const attackType = btn.getAttribute('data-attack');
                const data = attackScenarios[attackType];
                if (!data) return;

                const card = document.createElement('div');
                const isCrit = data.level === 'CRITICAL';
                card.className = `soc-event-card ${isCrit ? 'critical' : 'high'}`;

                card.innerHTML = `
                    <div class="event-top">
                        <span class="badge-soc-status ${isCrit ? 'critical' : 'high'}">
                            <i class="fa-solid fa-triangle-exclamation"></i> ${data.levelBadge}
                        </span>
                        <span class="event-time">${new Date().toLocaleTimeString()} | ${data.agent}</span>
                    </div>
                    <div class="event-title">${data.title}</div>
                    <div class="event-desc">${data.desc}</div>
                    <div class="event-meta-tags">
                        <span class="meta-tag"><i class="fa-solid fa-shield-virus"></i> ${data.rule}</span>
                        <span class="meta-tag"><i class="fa-solid fa-fingerprint"></i> ${data.source}</span>
                        <span class="meta-tag"><i class="fa-solid fa-bullseye"></i> MITRE: ${data.mitre}</span>
                    </div>
                    <div style="margin-top: 10px; font-size: 12px; color: #a7f3d0; background: rgba(16,185,129,0.08); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(16,185,129,0.2);">
                        <strong>الإجراء الدفاعي الموصى به:</strong> ${data.remediation}
                    </div>
                `;

                socOutput.prepend(card);
                showToast(`🚨 تم رصد تنبيه أمني جديد: ${data.level}`);
            });
        });
    }

    // ----------------------------------------------------
    // 20. نظام النوافذ المنبثقة للتقارير (Writeup Modals System)
    // ----------------------------------------------------
    window.openWriteup = function(id) {
        var modalId = 'modal-' + id;
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            var closeBtn = modal.querySelector('.wup-modal-close');
            if (closeBtn) closeBtn.focus();
        }
    };

    window.closeWriteup = function(id) {
        var modalId = 'modal-' + id;
        var modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    window.closeWriteupIfOutside = function(event, id) {
        var modal = document.getElementById('modal-' + id);
        if (modal && event.target === modal) {
            window.closeWriteup(id);
        }
    };

    // Close any modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.wup-modal-overlay.open').forEach(function(modal) {
                modal.classList.remove('open');
            });
            document.body.style.overflow = '';
        }
    });

});


/* Security hardening: external links opened in a new tab must not retain
   an opener reference, including links injected by future components. */
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});
