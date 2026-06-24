document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            // Animate burger bars
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = nav.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
            spans[1].style.opacity = nav.classList.contains('active') ? '0' : '1';
            spans[2].style.transform = nav.classList.contains('active') ? 'rotate(-45deg) translate(6px, -6px)' : 'none';
        });
    }

    // 3. Scroll Reveal Transitions
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check on load

    // 4. Interactive Live Macro Calculator (Bypass APIs)
    const weightSlider = document.getElementById('weightSlider');
    const weightValue = document.getElementById('weightValue');

    // Base Ghee Idli + Sambar Nutrition for 250 grams
    const BASE_WEIGHT = 250;
    const BASE_CALORIES = 380;
    const BASE_PROTEIN = 10;
    const BASE_FAT = 12;
    const BASE_CARBS = 58;
    const BASE_FIBER = 4;
    const BASE_SUGAR = 6;

    const updateCalculator = () => {
        if (!weightSlider) return;
        const weight = parseInt(weightSlider.value, 10);
        if (weightValue) weightValue.textContent = `${weight} g`;

        const ratio = weight / BASE_WEIGHT;

        // Scale macros mathematically
        const scaledCalories = Math.round(BASE_CALORIES * ratio);
        const scaledProtein = (BASE_PROTEIN * ratio).toFixed(1);
        const scaledFat = (BASE_FAT * ratio).toFixed(1);
        const scaledCarbs = (BASE_CARBS * ratio).toFixed(1);
        const scaledFiber = (BASE_FIBER * ratio).toFixed(1);
        const scaledSugar = (BASE_SUGAR * ratio).toFixed(1);

        // Update elements
        document.getElementById('calcCalories').textContent = scaledCalories;
        document.getElementById('calcProtein').textContent = `${scaledProtein}g`;
        document.getElementById('calcFat').textContent = `${scaledFat}g`;
        document.getElementById('calcCarbs').textContent = `${scaledCarbs}g`;
        document.getElementById('calcFiber').textContent = `${scaledFiber}g`;
        document.getElementById('calcSugar').textContent = `${scaledSugar}g`;
    };

    if (weightSlider) {
        weightSlider.addEventListener('input', updateCalculator);
        updateCalculator(); // Initial calculation
    }

    // 5. Version Control & Download Modal Logic
    const downloadCountEl = document.getElementById('downloadCount');
    let downloads = parseInt(localStorage.getItem('puniad_downloads_mock') || '1428', 10);

    // Periodically simulate global download increases
    downloads += Math.floor(Math.random() * 3) + 1;
    localStorage.setItem('puniad_downloads_mock', downloads);
    if (downloadCountEl) downloadCountEl.textContent = downloads.toLocaleString();

    // Elements for dynamic version insertion
    const footerStableVer = document.getElementById('footerStableVer');
    const footerLatestVer = document.getElementById('footerLatestVer');
    const modalStableVer = document.getElementById('modalStableVer');
    const modalLatestVer = document.getElementById('modalLatestVer');
    const downloadStableLink = document.getElementById('downloadStableLink');
    const downloadLatestLink = document.getElementById('downloadLatestLink');
    const versionModal = document.getElementById('versionModal');
    const closeVersionModal = document.querySelector('.close-version-modal');

    // Fetch version mapping from version.json
    fetch('version.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load version metadata');
            return response.json();
        })
        .then(data => {
            if (data.stable) {
                if (footerStableVer) footerStableVer.textContent = 'v' + data.stable.version;
                if (modalStableVer) modalStableVer.textContent = 'v' + data.stable.version;
                if (downloadStableLink) {
                    downloadStableLink.setAttribute('href', data.stable.path);
                    downloadStableLink.setAttribute('download', '');
                }
                // Update the static download banner version metadata if it exists
                const mainVerStrongs = document.querySelectorAll('#downloadVersionMeta');
                mainVerStrongs.forEach(el => {
                    el.textContent = data.stable.version + ' (Stable)';
                });
            }
            if (data.latest) {
                if (footerLatestVer) footerLatestVer.textContent = 'v' + data.latest.version;
                if (modalLatestVer) modalLatestVer.textContent = 'v' + data.latest.version;
                if (downloadLatestLink) {
                    downloadLatestLink.setAttribute('href', data.latest.path);
                    downloadLatestLink.setAttribute('download', '');
                }
            }
        })
        .catch(err => {
            console.warn('[VERSION LOADER] Using fallback defaults:', err.message);
        });

    // Intercept download triggers to open the selection modal
    const downloadButtons = document.querySelectorAll('.download-btn-trigger');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (versionModal) {
                versionModal.style.display = 'flex';
            }
        });
    });

    // Modal Close Triggers
    if (closeVersionModal) {
        closeVersionModal.addEventListener('click', () => {
            if (versionModal) versionModal.style.display = 'none';
        });
    }

    if (versionModal) {
        window.addEventListener('click', (e) => {
            if (e.target === versionModal) {
                versionModal.style.display = 'none';
            }
        });
    }

    // Increment download counter when actual download link is clicked inside modal
    const registerDownloadClick = () => {
        downloads += 1;
        localStorage.setItem('puniad_downloads_mock', downloads);
        if (downloadCountEl) downloadCountEl.textContent = downloads.toLocaleString();
        if (versionModal) versionModal.style.display = 'none';
    };

    if (downloadStableLink) downloadStableLink.addEventListener('click', registerDownloadClick);
    if (downloadLatestLink) downloadLatestLink.addEventListener('click', registerDownloadClick);

    // 6. Interactive CSS Study Notes Mockup Animation Loop
    const typewriter = document.getElementById('typewriterText');
    const capBtn = document.getElementById('capQuestionBtn');
    const ssBlock = document.getElementById('mockScreenshotBlock');

    if (typewriter && capBtn && ssBlock) {
        const textStates = [
            { type: "write", content: "Reviewing Normal forms..." },
            { type: "capture", delay: 1000 },
            { type: "append", content: "\n\nQuestion 1: [Screenshot:shot_DBMS_L2_1803_question.jpg]" },
            { type: "zoom", delay: 2500 },
            { type: "clear", delay: 2000 }
        ];

        let stateIndex = 0;
        let charIndex = 0;
        let currentText = "";

        const runNotesLoop = () => {
            const state = textStates[stateIndex];

            if (state.type === "write") {
                if (charIndex < state.content.length) {
                    currentText += state.content.charAt(charIndex);
                    typewriter.textContent = currentText;
                    charIndex++;
                    setTimeout(runNotesLoop, 60);
                } else {
                    stateIndex++;
                    setTimeout(runNotesLoop, 1000);
                }
            } else if (state.type === "capture") {
                // Highlight mock capture menu button
                capBtn.classList.add('active');
                setTimeout(() => {
                    capBtn.classList.remove('active');
                    stateIndex++;
                    runNotesLoop();
                }, state.delay);
            } else if (state.type === "append") {
                if (charIndex < state.content.length) {
                    currentText += state.content.charAt(charIndex);
                    typewriter.textContent = currentText;
                    charIndex++;
                    setTimeout(runNotesLoop, 30);
                } else {
                    // Display screenshot block
                    ssBlock.style.display = "block";
                    stateIndex++;
                    setTimeout(runNotesLoop, 800);
                }
            } else if (state.type === "zoom") {
                // Trigger CSS scale effect in styles.css
                setTimeout(() => {
                    stateIndex++;
                    runNotesLoop();
                }, state.delay);
            } else if (state.type === "clear") {
                setTimeout(() => {
                    ssBlock.style.display = "none";
                    currentText = "";
                    typewriter.textContent = "";
                    charIndex = 0;
                    stateIndex = 0;
                    setTimeout(runNotesLoop, 1000);
                }, state.delay);
            }
        };

        // Start notes simulation loop
        setTimeout(runNotesLoop, 1500);
    }

    // 7. Dynamic Copyright Year
    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
});
