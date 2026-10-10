/* Manual Arabic / English copy for the homepage's first translation batch. */
(() => {
    const translations = new Map(Object.entries({
        'تخطي إلى المحتوى': 'Skip to content',
        'مؤشرات السوق': 'Market snapshot',
        'تحديث كل ساعة': 'Updated hourly',
        'بيتكوين': 'Bitcoin', 'إيثيريوم': 'Ethereum', 'سولانا': 'Solana', 'بي إن بي': 'BNB', 'مونيرو': 'Monero',
        'الجنيه المصري': 'Egyptian pound', 'جارٍ جلب الأسعار…': 'Loading prices…',
        'أسعار USDT تقريبية بالدولار ·': 'USDT prices are approximate USD values ·',
        'الرئيسية': 'Home', 'المهارات': 'Skills', 'تقارير CTF': 'CTF Write-ups', 'المشاريع': 'Projects', 'تواصل معي': 'Contact',
        'ملف مهني مستقل': 'Independent Portfolio', 'مصر': 'Egypt', 'أمن سيبراني، اختبار اختراق، وأتمتة أمنية': 'Cybersecurity, penetration testing, and security automation',
        'أعمل على تطوير مهاراتي في اختبار الاختراق وأمن تطبيقات الويب والأتمتة الأمنية من خلال مختبرات عملية وتحديات CTF ومشاريع موثّقة. هنا أشارك منهجي في التحليل، والأدوات التي أبنيها، وما أتعلمه من كل تجربة.': 'I build my skills in penetration testing, web application security, and security automation through hands-on labs, CTF challenges, and documented projects. Here, I share my analysis process, the tools I build, and what I learn from each experience.',
        'استعرض مشاريعي': 'Explore my projects', 'تصفح CTF Write-ups': 'Browse CTF write-ups', 'الصورة الشخصية': 'Profile photo',
        'Offensive Security': 'Offensive Security', 'Security Automation': 'Security Automation', 'Continuous Learning': 'Continuous Learning',
        'المهارات التقنية': 'Technical Skills', '10+ أدوات وأوامر': '10+ tools and commands',
        'اختبار الاختراق والشبكات': 'Penetration Testing & Networks', 'مسح الشبكات واكتشاف المنافذ والخدمات وتحليل البروتوكولات وفحص الثغرات.': 'Network scanning, port and service discovery, protocol analysis, and vulnerability assessment.',
        'Network Scanning': 'Network Scanning', 'Exploitation': 'Exploitation', 'دخول القسم واستعراض الأوامر': 'Explore tools and commands',
        'أمن تطبيقات الويب': 'Web Application Security', 'فهم واكتشاف ثغرات الويب وفق معايير OWASP Top 10 وطرق الحماية والـ APIs.': 'Understand and identify web vulnerabilities using OWASP Top 10, security controls, and API security practices.',
        'Web Vulnerabilities': 'Web Vulnerabilities', 'دخول القسم واستعراض الثغرات': 'Explore vulnerabilities',
        'سكربتات وأتمتة': 'Scripts & Automation', 'البرمجة والأتمتة': 'Programming & Automation', 'تطوير سكربتات مخصصة لأتمتة مهام الفحص والاستطلاع وخطوط الـ DevSecOps.': 'Build custom scripts to automate scanning, reconnaissance, and DevSecOps pipelines.',
        'دخول القسم واستعراض الأكواد': 'Explore code and scripts',
        'معامل وسيناريوهات': 'Labs & Scenarios', 'الأنظمة والمعامل': 'Systems & Labs', 'التعامل مع بيئات التشغيل الأمنية وبناء معامل Active Directory و SOC المنزلية.': 'Work with security environments and build home labs for Active Directory and SOC workflows.',
        'دخول القسم واستعراض المعامل': 'Explore labs and scenarios',
        'أرشيف التحديات والتقارير الموثقة': 'CTF Archive & Documented Reports', 'فتح الأرشيف الكامل': 'Open the full archive',
        'سجل متكامل وموثق خطوة بخطوة لاختبار الاختراق، حلول آلات Hack The Box و TryHackMe، وتحليلات الثغرات البرمجية والتحقيق الجنائي الرقمي بالأدلة والأوامر. اضغط على أي مكان في هذه البطاقة لاستعراض كافة التقارير مقسمة حسب كل منصة.': 'A step-by-step archive of penetration tests, Hack The Box and TryHackMe machine write-ups, vulnerability analysis, and digital forensics, with evidence and commands. Open this card to browse reports by platform.',
        '16 لقطة': '16 screenshots', '13 لقطة': '13 screenshots', '7 لقطات': '7 screenshots', '11 لقطة': '11 screenshots', '3 لقطات': '3 screenshots', '10 لقطات': '10 screenshots',
        'استكشاف شبكي واستغلال الخدمات ورفع الصلاحيات الكامل.': 'Network reconnaissance, service exploitation, and full privilege escalation.',
        'تحليل Web Application و CMS والوصول للبيانات الحساسة.': 'Web application and CMS analysis leading to sensitive data.',
        'تحدي Linux يركز على أدوات الذكاء الاصطناعي وبيئات Docker.': 'A Linux challenge focused on AI tools and Docker environments.',
        'استغلال ثغرة Blind SQLi و motionEye RCE للحصول على Root.': 'Exploiting Blind SQL injection and motionEye RCE to gain root access.',
        'تحدي Spice Hut مع مسار الاستكشاف والأوامر وتصعيد الصلاحيات.': 'A Spice Hut challenge covering reconnaissance, commands, and privilege escalation.',
        'توثيق عملي لاختراق آلة DevHub واستغلال مسارات المصادقة.': 'A practical DevHub machine write-up covering authentication path exploitation.',
        '15+ آلة Hack The Box': '15+ Hack The Box machines', '5+ غرف TryHackMe': '5+ TryHackMe rooms', 'تقارير الويب والتحقيق الجنائي': 'Web security & forensics reports', 'دخول الأرشيف الكامل مقسماً حسب المنصة': 'Browse the archive by platform',
        'المشاريع والأدوات': 'Projects & Tools', 'كل المشاريع': 'All Projects', 'فاحص منافذ متعدد الخيوط (Multi-threaded) بلغة Python يتميز بالسرعة العالية في اكتشاف المنافذ المفتوحة والتقاط البانر (Banner Grabbing) لتحديد نوع الخدمات العاملة مع محاكي ويب فوري.': 'A fast, multithreaded Python port scanner that discovers open ports, grabs service banners, and includes an interactive web demo.',
        'تشغيل واستعراض الأداة': 'Launch and explore the tool',
        'أداة استطلاع وجمع النطاقات الفرعية آلياً من شهادات الأمان (crt.sh) وسجلات DNS العامة وفحص استجابتها مع حفظ النتائج في تقارير مرتبة ومحاكي استكشاف مباشر.': 'An OSINT tool that discovers subdomains from certificate records and public DNS, probes responses, and saves organized reports with a live exploration demo.',
        'بيئة معملية وأداة أتمتة لنشر خوادم Wazuh SIEM ومراقبة حركة البيانات وربط سجلات أحداث Sysmon ومحاكاة هجمات الشبكات مع لوحة تنبيهات تفاعلية.': 'A home lab and automation tool for deploying Wazuh SIEM, monitoring traffic, integrating Sysmon events, and simulating network attacks through an interactive alert dashboard.',
        'استعراض المعمل والمحاكي': 'Explore the lab and simulator', 'تواصل معي': 'Get in touch', 'يسعدني تواصلك دائماً': 'I’d be glad to hear from you',
        'سواء كنت تبحث عن استشارة أمنية، ترغب في التعاون في مشروع أو أداة برمجية، أو مناقشة ثغرة تقنية، لا تتردد في مراسلتي.': 'Whether you need a security consultation, want to collaborate on a project or tool, or discuss a technical vulnerability, feel free to contact me.',
        'البريد الإلكتروني': 'Email', 'الموقع': 'Location', 'مصر (Egypt) - متاح للعمل عن بُعد': 'Egypt · Available for remote work', 'الحالة': 'Availability', 'جاهز للمشاريع والتدريب': 'Open to projects and training',
        'الاسم:': 'Name:', 'البريد الإلكتروني:': 'Email:', 'الموضوع:': 'Subject:', 'الرسالة:': 'Message:', 'إرسال الرسالة': 'Send message',
        '© 2026 محمد فتحي (Mohamed Fathi). جميع الحقوق محفوظة.': '© 2026 Mohamed Fathi. All rights reserved.',
        'اختبار الاختراق': 'Penetration Testing', 'أمن التطبيقات': 'Application Security', 'البرمجة والأتمتة': 'Programming & Automation', 'الأنظمة والمعامل': 'Systems & Labs', 'زر العودة للأعلى': 'Back to top',
        'أسعار العملات التقديرية': 'Estimated market prices', 'بيتكوين BTC': 'Bitcoin BTC', 'إيثيريوم ETH': 'Ethereum ETH', 'سولانا SOL': 'Solana SOL', 'الجنيه المصري EGP، سعر الجنيه الواحد بالدولار': 'Egyptian pound EGP, value of one pound in USD',
        'تبديل الوضع': 'Toggle theme', 'القائمة': 'Menu'
        , 'التنقل الرئيسي': 'Primary navigation',
        'الانتقال إلى أرشيف تقارير CTF الشامل': 'Open the complete CTF write-up archive',
        'اسمك أو المعرّف الشخصي': 'Your name or handle', 'استفسار / تعاون أمني / مشروع': 'Inquiry / security collaboration / project', 'اكتب رسالتك هنا...': 'Write your message here…',
        'إغلاق النافذة': 'Close dialog',
    }));

    const normalized = value => value.replace(/\s+/g, ' ').trim();
    const originalText = new WeakMap();
    const originalAttrs = new WeakMap();
    const languageButton = document.getElementById('language-toggle');
    if (!languageButton) return;

    function translateDom(language) {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.title = language === 'en' ? 'Ft7y.Sec | Mohamed Fathi - Cybersecurity Researcher' : 'Ft7y.Sec | محمد فتحي - باحث أمن المعلومات';

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!parent || /^(SCRIPT|STYLE|CODE|PRE|TEXTAREA)$/.test(parent.tagName)) continue;
            if (!originalText.has(node)) originalText.set(node, node.nodeValue);
            const source = originalText.get(node);
            const key = normalized(source);
            if (language === 'en' && translations.has(key)) {
                const leading = source.match(/^\s*/)?.[0] || '';
                const trailing = source.match(/\s*$/)?.[0] || '';
                node.nodeValue = leading + translations.get(key) + trailing;
            } else if (language === 'ar') {
                node.nodeValue = source;
            }
        }

        document.querySelectorAll('[title], [aria-label], [placeholder]').forEach(element => {
            ['title', 'aria-label', 'placeholder'].forEach(attribute => {
                if (!element.hasAttribute(attribute)) return;
                let originals = originalAttrs.get(element);
                if (!originals) { originals = {}; originalAttrs.set(element, originals); }
                if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
                const value = originals[attribute];
                element.setAttribute(attribute, language === 'en' ? (translations.get(normalized(value)) || value) : value);
            });
        });

        languageButton.textContent = language === 'ar' ? 'EN' : 'عربي';
        languageButton.lang = language === 'ar' ? 'en' : 'ar';
        languageButton.title = language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';
        languageButton.setAttribute('aria-label', languageButton.title);
        try { localStorage.setItem('site-language', language); } catch (_) { /* Storage may be unavailable for local files. */ }
    }

    languageButton.addEventListener('click', () => {
        translateDom(document.documentElement.lang === 'ar' ? 'en' : 'ar');
    });

    let savedLanguage = null;
    try { savedLanguage = localStorage.getItem('site-language'); } catch (_) { /* Continue in the page's default language. */ }
    if (savedLanguage === 'en') translateDom('en');
})();
