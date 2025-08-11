// Combined JavaScript for Arjun K Raghav Investment Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();

    // --- Scroll Animations ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // --- Enhanced Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        // Toggle menu when clicking the hamburger button
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking menu items
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnButton = mobileMenuButton.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnButton && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });

        // Close menu when pressing Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // --- Calculator Tabs ---
    const tabs = document.querySelectorAll('.calculator-tab');
    const panels = document.querySelectorAll('.calculator-panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.add('hidden'));
            tab.classList.add('active');
            const panelId = tab.getAttribute('data-tab') + '-panel';
            const panel = document.getElementById(panelId);
            if(panel) panel.classList.remove('hidden');
        });
    });

    // --- Accordion Functionality ---
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    const accordionContents = document.querySelectorAll('.accordion-content');

    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            const targetContent = document.getElementById(toggle.getAttribute('aria-controls'));

            // Close all other accordions
            accordionToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    const otherContent = document.getElementById(otherToggle.getAttribute('aria-controls'));
                    if (otherContent) {
                        otherContent.classList.add('hidden');
                        otherToggle.setAttribute('aria-expanded', 'false');
                        otherToggle.innerHTML = '<i class="fas fa-plus"></i>';
                    }
                }
            });

            // Toggle current accordion
            if (isExpanded) {
                if (targetContent) {
                    targetContent.classList.add('hidden');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.innerHTML = '<i class="fas fa-plus"></i>';
                }
            } else {
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                    toggle.setAttribute('aria-expanded', 'true');
                    toggle.innerHTML = '<i class="fas fa-minus"></i>';
                }
            }
        });
    });

    // Make entire accordion header clickable
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', (e) => {
            // Prevent double-firing if button is clicked directly
            if (e.target.closest('.accordion-toggle')) return;

            const toggle = header.querySelector('.accordion-toggle');
            if (toggle) toggle.click();
        });
    });

    // --- Calculator Functions ---
    function formatCurrency(value) { 
        return new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'INR', 
            maximumFractionDigits: 0 
        }).format(value); 
    }

    function createChart(canvas, chartInstance, chartConfig) {
        if (chartInstance) chartInstance.destroy();
        if (typeof Chart !== 'undefined') {
            return new Chart(canvas, chartConfig);
        }
        return null;
    }
    
    const chartDefaultOptions = {
        responsive: true, 
        maintainAspectRatio: false,
        scales: { 
            y: { 
                beginAtZero: true, 
                ticks: { 
                    callback: (v) => '₹' + (v / 100000).toFixed(1) + 'L' 
                } 
            }, 
            x: { 
                grid: { 
                    display: false 
                } 
            } 
        },
        plugins: { 
            legend: { 
                display: false 
            }, 
            tooltip: { 
                callbacks: { 
                    label: (c) => `Value: ${formatCurrency(c.raw)}` 
                } 
            } 
        }
    };
    
    function setupSliderSync(sliderId, inputId, callback) {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(inputId);
        if (slider && input) {
            slider.addEventListener('input', (e) => { 
                input.value = e.target.value; 
                callback(); 
            });
            input.addEventListener('input', (e) => { 
                slider.value = e.target.value; 
                callback(); 
            });
        }
    }

    // --- SIP Calculator ---
    function initializeSipCalculator() {
        const sipAmountEl = document.getElementById('sipAmount');
        const sipRateEl = document.getElementById('sipRate');
        const sipYearsEl = document.getElementById('sipYears');
        const sipInvestedEl = document.getElementById('sipInvested');
        const sipReturnsEl = document.getElementById('sipReturns');
        const sipTotalEl = document.getElementById('sipTotal');
        const sipChartCanvas = document.getElementById('sipChart');

        if (!sipAmountEl || !sipRateEl || !sipYearsEl) return;

        let sipChart;

        function calculateAndDisplaySip() {
            const P = parseFloat(sipAmountEl.value) || 0;
            const r = parseFloat(sipRateEl.value) / 100;
            const t = parseInt(sipYearsEl.value) || 0;
            
            if (P <= 0 || r < 0 || t <= 0) return;
            
            const i = r / 12;
            const totalMonths = t * 12;
            let futureValue = 0;
            const labels = [];
            const data = [];
            
            for (let year = 1; year <= t; year++) {
                futureValue = P * ((Math.pow(1 + i, year * 12) - 1) / i);
                labels.push(currentYear + year);
                data.push(futureValue.toFixed(0));
            }
            
            const investedAmount = P * totalMonths;
            const totalReturns = futureValue - investedAmount;
            
            if (sipInvestedEl) sipInvestedEl.textContent = formatCurrency(investedAmount);
            if (sipReturnsEl) sipReturnsEl.textContent = formatCurrency(totalReturns);
            if (sipTotalEl) sipTotalEl.textContent = formatCurrency(futureValue);
            
            if (sipChartCanvas && typeof Chart !== 'undefined') {
                const ctx = sipChartCanvas.getContext('2d');
                sipChart = createChart(ctx, sipChart, { 
                    type: 'line', 
                    data: { 
                        labels, 
                        datasets: [{ 
                            label: 'Investment Value', 
                            data, 
                            backgroundColor: 'rgba(229, 57, 53, 0.1)', 
                            borderColor: '#E53935', 
                            borderWidth: 3, 
                            fill: true, 
                            tension: 0.4, 
                            pointBackgroundColor: '#E53935', 
                            pointRadius: 4, 
                            pointHoverRadius: 6 
                        }] 
                    }, 
                    options: chartDefaultOptions 
                });
            }
        }
        
        setupSliderSync('sipAmountSlider', 'sipAmount', calculateAndDisplaySip);
        setupSliderSync('sipRateSlider', 'sipRate', calculateAndDisplaySip);
        setupSliderSync('sipYearsSlider', 'sipYears', calculateAndDisplaySip);
        calculateAndDisplaySip();
    }

    // --- Step-Up SIP Calculator ---
    function initializeStepUpSipCalculator() {
        const stepUpSipAmountEl = document.getElementById('stepUpSipAmount');
        const stepUpSipRateEl = document.getElementById('stepUpSipRate');
        const stepUpSipYearsEl = document.getElementById('stepUpSipYears');
        const stepUpSipIncrementEl = document.getElementById('stepUpSipIncrement');
        const stepUpSipInvestedEl = document.getElementById('stepUpSipInvested');
        const stepUpSipReturnsEl = document.getElementById('stepUpSipReturns');
        const stepUpSipTotalEl = document.getElementById('stepUpSipTotal');
        const stepUpSipChartCanvas = document.getElementById('stepUpSipChart');

        if (!stepUpSipAmountEl || !stepUpSipRateEl || !stepUpSipYearsEl) return;

        let stepUpSipChart;

        function calculateAndDisplayStepUpSip() {
            const P = parseFloat(stepUpSipAmountEl.value) || 0;
            const r = parseFloat(stepUpSipRateEl.value) / 100;
            const t = parseInt(stepUpSipYearsEl.value) || 0;
            const increment = parseFloat(stepUpSipIncrementEl.value) / 100 || 0;
            
            if (P <= 0 || r < 0 || t <= 0) return;
            
            const monthlyRate = r / 12;
            let totalInvested = 0;
            let futureValue = 0;
            let currentSip = P;
            const labels = [];
            const data = [];
            
            for (let year = 1; year <= t; year++) {
                // Calculate for current year
                const yearlyInvestment = currentSip * 12;  
                totalInvested += yearlyInvestment;
                
                // Future value calculation for step-up SIP
                futureValue += currentSip * ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate) * Math.pow(1 + monthlyRate, (t - year) * 12);
                
                labels.push(currentYear + year);
                data.push(futureValue.toFixed(0));
                
                // Increase SIP amount for next year
                currentSip = currentSip * (1 + increment);
            }
            
            const totalReturns = futureValue - totalInvested;
            
            if (stepUpSipInvestedEl) stepUpSipInvestedEl.textContent = formatCurrency(totalInvested);
            if (stepUpSipReturnsEl) stepUpSipReturnsEl.textContent = formatCurrency(totalReturns);
            if (stepUpSipTotalEl) stepUpSipTotalEl.textContent = formatCurrency(futureValue);
            
            if (stepUpSipChartCanvas && typeof Chart !== 'undefined') {
                const ctx = stepUpSipChartCanvas.getContext('2d');
                stepUpSipChart = createChart(ctx, stepUpSipChart, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            label: 'Investment Value',
                            data,
                            backgroundColor: 'rgba(229, 57, 53, 0.1)',
                            borderColor: '#E53935',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#E53935',
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }]
                    },
                    options: chartDefaultOptions
                });
            }
        }
        
        setupSliderSync('stepUpSipAmountSlider', 'stepUpSipAmount', calculateAndDisplayStepUpSip);
        setupSliderSync('stepUpSipRateSlider', 'stepUpSipRate', calculateAndDisplayStepUpSip);
        setupSliderSync('stepUpSipYearsSlider', 'stepUpSipYears', calculateAndDisplayStepUpSip);
        setupSliderSync('stepUpSipIncrementSlider', 'stepUpSipIncrement', calculateAndDisplayStepUpSip);
        calculateAndDisplayStepUpSip();
    }

    // --- Inflation Calculator ---
    function initializeInflationCalculator() {
        const inflationCostEl = document.getElementById('inflationCost');
        const inflationRateEl = document.getElementById('inflationRate');
        const inflationYearsEl = document.getElementById('inflationYears');
        const inflationTotalEl = document.getElementById('inflationTotal');
        const inflationStartValueEl = document.getElementById('inflationStartValue');
        const inflationChartCanvas = document.getElementById('inflationChart');

        if (!inflationCostEl || !inflationRateEl || !inflationYearsEl) return;

        let inflationChart;

        function calculateAndDisplayInflation() {
            const presentValue = parseFloat(inflationCostEl.value) || 0;
            const inflationRate = parseFloat(inflationRateEl.value) / 100;
            const years = parseInt(inflationYearsEl.value) || 0;
            
            if (presentValue <= 0 || inflationRate < 0 || years <= 0) return;
            
            const labels = [];
            const data = [];
            
            for (let year = 1; year <= years; year++) {
                const futureValue = presentValue * Math.pow(1 + inflationRate, year);
                labels.push(currentYear + year);
                data.push(futureValue.toFixed(0));
            }
            
            const finalValue = presentValue * Math.pow(1 + inflationRate, years);
            
            if (inflationStartValueEl) inflationStartValueEl.textContent = formatCurrency(presentValue);
            if (inflationTotalEl) inflationTotalEl.textContent = formatCurrency(finalValue);
            
            if (inflationChartCanvas && typeof Chart !== 'undefined') {
                const ctx = inflationChartCanvas.getContext('2d');
                inflationChart = createChart(ctx, inflationChart, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            label: 'Future Cost',
                            data,
                            backgroundColor: 'rgba(229, 57, 53, 0.1)',
                            borderColor: '#E53935',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#E53935',
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }]
                    },
                    options: chartDefaultOptions
                });
            }
        }
        
        setupSliderSync('inflationCostSlider', 'inflationCost', calculateAndDisplayInflation);
        setupSliderSync('inflationRateSlider', 'inflationRate', calculateAndDisplayInflation);
        setupSliderSync('inflationYearsSlider', 'inflationYears', calculateAndDisplayInflation);
        calculateAndDisplayInflation();
    }

    // --- SWP Calculator ---
    function initializeSwpCalculator() {
        const swpInvestmentEl = document.getElementById('swpInvestment');
        const swpWithdrawalEl = document.getElementById('swpWithdrawal');
        const swpRateEl = document.getElementById('swpRate');
        const swpYearsEl = document.getElementById('swpYears');
        const swpTotalEl = document.getElementById('swpTotal');
        const swpWithdrawnEl = document.getElementById('swpWithdrawn');
        const swpChartCanvas = document.getElementById('swpChart');

        if (!swpInvestmentEl || !swpWithdrawalEl || !swpRateEl || !swpYearsEl) return;

        let swpChart;

        function calculateAndDisplaySwp() {
            const initialInvestment = parseFloat(swpInvestmentEl.value) || 0;
            const monthlyWithdrawal = parseFloat(swpWithdrawalEl.value) || 0;
            const annualReturn = parseFloat(swpRateEl.value) / 100;
            const years = parseInt(swpYearsEl.value) || 0;
            
            if (initialInvestment <= 0 || monthlyWithdrawal <= 0 || annualReturn < 0 || years <= 0) return;
            
            const monthlyReturn = annualReturn / 12;
            const totalMonths = years * 12;
            let remainingAmount = initialInvestment;
            const labels = [];
            const data = [];
            
            for (let year = 1; year <= years; year++) {
                for (let month = 1; month <= 12; month++) {
                    // Apply monthly growth
                    remainingAmount = remainingAmount * (1 + monthlyReturn);
                    // Subtract monthly withdrawal
                    remainingAmount -= monthlyWithdrawal;
                    
                    // If amount goes negative, set to 0
                    if (remainingAmount < 0) {
                        remainingAmount = 0;
                    }
                }
                labels.push(currentYear + year);
                data.push(Math.max(0, remainingAmount.toFixed(0)));
            }
            
            const totalWithdrawn = monthlyWithdrawal * totalMonths;
            const finalAmount = Math.max(0, remainingAmount);
            
            if (swpWithdrawnEl) swpWithdrawnEl.textContent = formatCurrency(totalWithdrawn);
            if (swpTotalEl) swpTotalEl.textContent = formatCurrency(finalAmount);
            
            if (swpChartCanvas && typeof Chart !== 'undefined') {
                const ctx = swpChartCanvas.getContext('2d');
                swpChart = createChart(ctx, swpChart, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            label: 'Remaining Value',
                            data,
                            backgroundColor: 'rgba(229, 57, 53, 0.1)',
                            borderColor: '#E53935',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#E53935',
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }]
                    },
                    options: chartDefaultOptions
                });
            }
        }
        
        setupSliderSync('swpInvestmentSlider', 'swpInvestment', calculateAndDisplaySwp);
        setupSliderSync('swpWithdrawalSlider', 'swpWithdrawal', calculateAndDisplaySwp);
        setupSliderSync('swpRateSlider', 'swpRate', calculateAndDisplaySwp);
        setupSliderSync('swpYearsSlider', 'swpYears', calculateAndDisplaySwp);
        calculateAndDisplaySwp();
    }

    /* ===== VIDEO TESTIMONIAL SLIDER - TEMPORARILY DISABLED =====
    function initializeVideoSlider() {
        // Video slider code commented out
    }
    ===== END VIDEO TESTIMONIAL SLIDER ===== */

    // --- LinkedIn Pop-up Logic ---
    function initializeLinkedInPopup() {
        const linkedinPopup = document.getElementById('linkedin-popup');
        const popupTextEl = document.getElementById('popup-text');
        const popupCloseBtn = document.getElementById('popup-close-btn');
        
        if (!linkedinPopup || !popupTextEl || !popupCloseBtn) return;
        
        const posts = [
            { text: "Mutual Fund Industry gets hotter, Abakkus Asset Manager joins the race..." },
            { text: "Now you can complete your Mutual Fund KYC completely online through CAMS & KFintech..." },
            { text: "Market Cap Reshuffle by AMFI (June 2025). Check out the new entrants & exits..." }
        ];

        let currentPostIndex = 0;
        let popupInterval;

        function hidePopup() {
            linkedinPopup.classList.remove('show');
        }

        function showPopup() {
            currentPostIndex = (currentPostIndex + 1) % posts.length;
            const post = posts[currentPostIndex];
            
            popupTextEl.textContent = post.text;
            linkedinPopup.classList.add('show');
            setTimeout(hidePopup, 8000);
        }
        
        linkedinPopup.addEventListener('click', (e) => {
            if (e.target !== popupCloseBtn && !popupCloseBtn.contains(e.target)) {
                window.open('https://www.linkedin.com/in/arjun-k-raghav-a2793a321/', '_blank');
            }
        });

        popupCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hidePopup();
            clearInterval(popupInterval); 
        });

        setTimeout(() => {
            showPopup();
            popupInterval = setInterval(showPopup, 15000);
        }, 5000);
    }

    // --- Enhanced Form Validation with Google Sheets Integration ---
    function initializeFormValidation() {
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxnBjctmi6nr-fppAfi4xgx9Al7skTiQ_QzWRurrAl57f6aXs7JNglsam41odSoEQ/exec';

        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                // Get form fields
                const name = form.querySelector('#name')?.value.trim();
                const place = form.querySelector('#place')?.value.trim();
                const age = form.querySelector('#age')?.value;
                const phone = form.querySelector('#phone')?.value.trim();
                const message = form.querySelector('#message')?.value.trim() || '';

                // Validate required fields
                if (!name || !place || !age || !phone) {
                    alert('Please fill in all required fields.');
                    return;
                }

                if (age < 18 || age > 100) {
                    alert('Please enter a valid age between 18 and 100.');
                    return;
                }

                // Show loading state
                form.classList.add('form-loading');
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Sending...';

                try {
                    // Determine page source
                    let pageSource = 'Unknown';
                    const path = window.location.pathname;
                    if (path.includes('index.html') || path === '/') {
                        pageSource = 'Home Page';
                    } else if (path.includes('mutual.html')) {
                        pageSource = 'Mutual Funds Page';
                    } else if (path.includes('iap.html')) {
                        pageSource = 'IAP Page';
                    } else if (path.includes('pms.html')) {
                        pageSource = 'PMS Page';
                    } else if (path.includes('start.html')) {
                        pageSource = 'Start Investment Page';
                    }

                    // Prepare form data
                    const formData = new FormData();
                    formData.append('name', name);
                    formData.append('place', place);
                    formData.append('age', age);
                    formData.append('phone', phone);
                    formData.append('message', message);
                    formData.append('pageSource', pageSource);

                    // Submit to Google Sheets
                    const response = await fetch(SCRIPT_URL, {
                        method: 'POST',
                        body: formData
                    });

                    const result = await response.json();

                    if (result.result === 'success') {
                        // Show success popup
                        showSuccessPopup();
                        // Reset form
                        form.reset();
                    } else {
                        throw new Error(result.message || 'Submission failed');
                    }

                } catch (error) {
                    console.error('Error:', error);
                    alert('Sorry, there was an error submitting your form. Please try again.');
                } finally {
                    // Remove loading state
                    form.classList.remove('form-loading');
                    submitBtn.innerHTML = originalBtnText;
                }
            });
        });
    }

    // --- Success Popup Functions ---
    function showSuccessPopup() {
        const overlay = document.getElementById('successOverlay');
        const popup = document.getElementById('successPopup');
        
        if (overlay && popup) {
            overlay.classList.add('show');
            popup.classList.add('show');
        }
    }

    function closeSuccessPopup() {
        const overlay = document.getElementById('successOverlay');
        const popup = document.getElementById('successPopup');
        
        if (overlay && popup) {
            overlay.classList.remove('show');
            popup.classList.remove('show');
        }
    }

    // Close popup when clicking overlay
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeSuccessPopup();
            }
        });
    }

    // --- Testimonial Cards Sequential Animation ---
    function initializeTestimonialAnimation() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (testimonialCards.length === 0) {
            console.log('No testimonial cards found');
            return;
        }
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Testimonial section is visible, starting animation');
                    
                    // Trigger animation for each card
                    testimonialCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('slide-in');
                            console.log(`Card ${index + 1} animation triggered`);
                        }, 100); // Small delay to ensure smooth start
                    });
                    
                    // Stop observing after animation starts
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.2, // Trigger when 20% of section is visible
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before fully visible
        });
        
        // Find and observe the testimonial section
        const testimonialSection = document.querySelector('.testimonial-card')?.closest('section');
        if (testimonialSection) {
            observer.observe(testimonialSection);
            console.log('Testimonial observer set up successfully');
        } else {
            console.log('Testimonial section not found');
        }
    }

    // --- Smooth Scrolling for Internal Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize all components
    initializeSipCalculator();
    initializeStepUpSipCalculator();
    initializeInflationCalculator();
    initializeSwpCalculator();
    // initializeVideoSlider(); // Commented out
    initializeLinkedInPopup();
    initializeFormValidation();
    initializeTestimonialAnimation();

}); // Main DOMContentLoaded closing brace

// Global function for popup (needed for onclick in HTML)
function closeSuccessPopup() {
    const overlay = document.getElementById('successOverlay');
    const popup = document.getElementById('successPopup');
    
    if (overlay && popup) {
        overlay.classList.remove('show');
        popup.classList.remove('show');
    }
}
