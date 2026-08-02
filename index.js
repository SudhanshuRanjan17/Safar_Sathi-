/* ==========================================================================
   GLOBAL ERROR BOUNDARY
   ========================================================================== */
window.onerror = function (message, source, lineno, colno, error) {
    const errorMsg = `${message}\nat ${source}:${lineno}:${colno}`;
    console.error("Global Error Caught: ", errorMsg);
    
    // Show error overlay on phone screen
    const overlay = document.getElementById('system-error-overlay');
    const descEl = document.getElementById('error-overlay-desc');
    if (overlay && descEl) {
        descEl.innerText = errorMsg;
        overlay.classList.remove('hidden');
    } else {
        alert("CRITICAL ERROR:\n" + errorMsg);
    }
    return false;
};

/* ==========================================================================
   SAFARSETU APPLICATION STATE
   ========================================================================== */
const appState = {
    currentScreen: 'splash',
    language: 'en',
    onboardingSlide: 0,
    walletBalance: 750,
    setuCoins: 250,
    activePayMode: 'cash', // 'cash' or 'wallet'
    lowDataMode: false,
    activeFestival: 'none', // 'none', 'chhath', 'durga', 'shaadi'

    // Default Fallback User Profile
    userProfile: {
        salutation: 'Mr.',
        firstName: 'Abhinav',
        middleName: '',
        lastName: 'Narayan',
        gender: 'Male',
        dob: '1995-08-15',
        phone: '9876543210',
        email: 'abhinav.narayan@bihar.gov.in',
        religion: 'Hindu'
    },

    // App Onboarding Permissions State
    appPermissions: {
        location: false,
        contacts: false,
        notifications: false,
        microphone: false
    },

    festivalAutoSuggest: true,

    // New Simulated and Advanced State Variables
    isDarkMode: false,
    isOffline: false,
    simulateError: false,
    womensSafetyMode: false,
    scheduledTrips: [],
    isEmptyHistory: false,
    tripProtectionActive: false,
    activeVoiceField: 'pickup',
    routeSteps: [],
    currentRouteStepIndex: 0,
    activeMapStyle: 'voyager',
    navHistory: [],

    // Booking States
    bookingType: 'ride', // 'ride', 'tempo', 'pilgrimage'
    selectedVehicle: 'Safar E-Rickshaw',
    selectedFare: 90,
    pickupLocation: '',
    dropLocation: '',
    pickupCoords: [25.5941, 85.1376], // Patna Junction
    dropCoords: [25.6835, 85.2212],  // Hajipur Crossing
    routeDistance: 12.4, // km
    routeDuration: 25,  // mins

    // Multi-stop Wedding Stops
    weddingStops: [
        { label: 'A', name: "Patna Junction (Groom's Home)", coords: [25.5941, 85.1376] },
        { label: 'B', name: "Mithila Marriage Hall (Mandap)", coords: [25.6110, 85.1480] },
        { label: 'C', name: "Maurya Reception Hall (Reception)", coords: [25.6025, 85.1550] }
    ],

    // Wedding Booking States
    selectedWeddingCar: '',
    selectedWeddingPkg: '',
    selectedWeddingPrice: 0,
    weddingDate: '2026-11-20',
    weddingTime: '18:30',
    weddingDistrict: 'Patna',
    weddingVenue: 'Mithila Marriage Hall, Patna',
    weddingGuests: 150,
    selectedWeddingItems: {},
    favoriteDrivers: ['Ramesh Singh'],
    blockedDrivers: [],
    
    // SafarShaadi Specific States
    shaadiSelection: { religion: 'Hindu', caste: 'Brahmin', details: '' },
    shaadiBudget: 500000,
    shaadiSpent: 0,
    shaadiGuests: [
        { id: 'g1', name: 'Manoj Mishra (Mama)', meal: 'Veg', status: 'Confirmed' },
        { id: 'g2', name: 'Shalini Singh (Bua)', meal: 'Veg', status: 'Pending' },
        { id: 'g3', name: 'Imran Hashmi (Friend)', meal: 'Non-Veg', status: 'Confirmed' },
        { id: 'g4', name: 'Vikram Aditya (Colleague)', meal: 'Veg', status: 'Pending' }
    ],
    shaadiChecklist: {
        'h-lagan': true,
        'h-godan': false,
        'h-haldi': false,
        'h-matkor': false,
        'h-jaimala': false
    },
    shaadiBookings: [],
    shaadiViewStack: ['hub'],

    // Maps Leaflet Objects
    leafletMap: null,
    leafletLiveMap: null,
    pickupMarker: null,
    dropMarker: null,
    routeLine: null,
    weddingMarkers: [],
    weddingLines: null,
    liveTrackingMarker: null,
    liveTrackingInterval: null,

    // Maps Google Objects
    googleMap: null,
    googlePickupMarker: null,
    googleDropMarker: null,
    googleRouteLine: null,

    // Animation frames
    marigoldAnimationId: null,
    sosCountdownInterval: null,
    callTimerInterval: null,

    // Booking history
    bookingHistory: [
        { id: 1, type: 'Ganga Auto', route: 'Patna Jct to Hajipur', price: 150, date: '16 Jun', status: 'Completed' },
        { id: 2, type: 'Mithila Mini', route: 'Golghar to Bailey Rd', price: 110, date: '14 Jun', status: 'Completed' }
    ]
};

// Covered Cities list for Geofencing
const coveredCities = [
    { name: "Patna", coords: [25.5941, 85.1376], radius: 25 },       // 25km radius
    { name: "Gaya", coords: [24.7914, 85.0002], radius: 20 },        // 20km
    { name: "Muzaffarpur", coords: [26.1209, 85.3647], radius: 20 }, // 20km
    { name: "Darbhanga", coords: [26.1542, 85.8918], radius: 20 },   // 20km
    { name: "Bhagalpur", coords: [25.2425, 87.0145], radius: 20 },    // 20km
    // Major Indian Metros and Regional Centers
    { name: "Delhi NCR", coords: [28.6139, 77.2090], radius: 60 },
    { name: "Mumbai", coords: [19.0760, 72.8777], radius: 50 },
    { name: "Bengaluru", coords: [12.9716, 77.5946], radius: 50 },
    { name: "Kolkata", coords: [22.5726, 88.3639], radius: 45 },
    { name: "Chennai", coords: [13.0827, 80.2707], radius: 40 },
    { name: "Hyderabad", coords: [17.3850, 78.4867], radius: 45 },
    { name: "Pune", coords: [18.5204, 73.8567], radius: 35 },
    { name: "Ahmedabad", coords: [23.0225, 72.5714], radius: 35 },
    { name: "Jaipur", coords: [26.9124, 75.7873], radius: 30 },
    { name: "Lucknow", coords: [26.8467, 80.9462], radius: 30 },
    { name: "Ranchi", coords: [23.3441, 85.3096], radius: 30 }
];

// Autocomplete database search simulator (fallback list)
const biharPlaces = [
    { name: "Patna Junction Gate 1, Patna, Bihar", coords: [25.5941, 85.1376] },
    { name: "Jay Prakash Narayan Airport (Patna Airport), Patna, Bihar", coords: [25.5913, 85.0880] },
    { name: "Gandhi Maidan, Golghar, Patna, Bihar", coords: [25.6110, 85.1480] },
    { name: "Hajipur Bridge Crossing, Hajipur, Bihar", coords: [25.6835, 85.2212] },
    { name: "Mithila Marriage Hall, Kankarbagh, Patna, Bihar", coords: [25.5895, 85.1444] },
    { name: "Vikas Bhawan, Bailey Road, Patna, Bihar", coords: [25.6088, 85.1120] },
    { name: "Gaya Mahabodhi Temple, Gaya, Bihar", coords: [24.6959, 84.9914] },
    { name: "Gaya Airport, Gaya, Bihar", coords: [24.7440, 84.9512] },
    { name: "Muzaffarpur Station Chowk, Muzaffarpur, Bihar", coords: [26.1209, 85.3647] },
    { name: "Darbhanga Tower Market, Darbhanga, Bihar", coords: [26.1542, 85.8918] },
    { name: "Darbhanga Airport, Darbhanga, Bihar", coords: [26.1928, 85.9142] },
    { name: "Bhagalpur University, Bhagalpur, Bihar", coords: [25.2425, 87.0145] },
    { name: "Deoghar Baidyanath Temple, Jharkhand", coords: [24.4938, 86.6994] },
    { name: "Maurya Lok Shopping Complex, Patna, Bihar", coords: [25.6095, 85.1325] },
    { name: "Patna Sahib Gurudwara, Patna City, Bihar", coords: [25.5855, 85.2275] },
    { name: "Eco Park (Rajdhani Vatika), Patna, Bihar", coords: [25.6030, 85.1185] },
    { name: "Sanjay Gandhi Biological Park (Patna Zoo), Patna, Bihar", coords: [25.5975, 85.0975] },
    { name: "Mahavir Mandir, Patna Junction, Bihar", coords: [25.5962, 85.1370] },
    { name: "Nalanda University Ruins, Nalanda, Bihar", coords: [25.1558, 85.4468] },
    { name: "Rajgir Glass Bridge & Nature Safari, Rajgir, Bihar", coords: [25.0250, 85.4215] },
    { name: "Hajipur Junction Station, Hajipur, Bihar", coords: [25.6985, 85.2155] },
    { name: "Sonepur Mela Ground, Sonepur, Bihar", coords: [25.6980, 85.1720] },
    { name: "India Gate, New Delhi, Delhi", coords: [28.6129, 77.2295] },
    { name: "Connaught Place, New Delhi, Delhi", coords: [28.6304, 77.2177] },
    { name: "Gateway of India, Colaba, Mumbai", coords: [18.9220, 72.8347] },
    { name: "Chhatrapati Shivaji Terminal, Mumbai", coords: [18.9400, 72.8354] },
    { name: "Lalbagh Botanical Garden, Bengaluru, Karnataka", coords: [12.9507, 77.5901] },
    { name: "Victoria Memorial, Kolkata, West Bengal", coords: [22.5448, 88.3426] },
    { name: "Howrah Bridge, Kolkata, West Bengal", coords: [22.5851, 88.3468] },
    { name: "Charminar, Hyderabad, Telangana", coords: [17.3616, 78.4747] },
    { name: "Marina Beach, Chennai, Tamil Nadu", coords: [13.0499, 80.2824] }
];

/* ==========================================================================
   INITIALIZATION & CLOCK
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    // Load religion theme on startup
    const savedReligion = localStorage.getItem('safarsetu-religion-theme') || appState.userProfile.religion || 'Hindu';
    applyReligionTheme(savedReligion);

    goToScreen('splash');

    setTimeout(() => {
        if (appState.currentScreen === 'splash') {
            goToScreen('onboarding');
        }
    }, 2800);

    setLanguage('en');
    updateDynamicUserElements();

    const chatInput = document.getElementById('chat-text-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendSimulatedChatMessage();
        });
    }

    // Dynamic OTP input listeners for smooth navigation & backspacing
    const otpInputs = document.querySelectorAll('.otp-box');
    otpInputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value === '' && index > 0) {
                otpInputs[index - 1].focus();
                otpInputs[index - 1].value = ''; // Automatically delete previous character on backspace
            }
        });
        input.addEventListener('input', (e) => {
            if (input.value.length === 1 && index < 3) {
                otpInputs[index + 1].focus();
            }
        });
    });

    const pickupInput = document.getElementById('pickup-autocomplete');
    if (pickupInput) {
        pickupInput.addEventListener('change', () => {
            setTimeout(() => resolveLocationInput('pickup'), 200);
        });
        pickupInput.addEventListener('blur', () => {
            setTimeout(() => {
                resolveLocationInput('pickup');
                const suggestionsBox = document.getElementById('autocomplete-suggestions-box');
                if (suggestionsBox) suggestionsBox.classList.add('hidden');
            }, 200);
        });
    }
    const dropInput = document.getElementById('drop-autocomplete');
    if (dropInput) {
        dropInput.addEventListener('change', () => {
            setTimeout(() => resolveLocationInput('drop'), 200);
        });
        dropInput.addEventListener('blur', () => {
            setTimeout(() => {
                resolveLocationInput('drop');
                const suggestionsBox = document.getElementById('autocomplete-suggestions-box');
                if (suggestionsBox) suggestionsBox.classList.add('hidden');
            }, 200);
        });
    }
});

function updateClock() {
    const clockEl = document.getElementById('status-clock');
    if (clockEl) {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        clockEl.innerText = `${hours}:${minutes}`;
    }
}

/* ==========================================================================
   SCREEN STATE MACHINE & NAVIGATION
   ========================================================================== */
function triggerSkeletonScreen(containerId, duration = 1000, renderCallback) {
    const container = document.getElementById(containerId);
    if (!container) {
        if (renderCallback) renderCallback();
        return;
    }

    // Add shimmer class
    container.classList.add('loading-skeleton');

    setTimeout(() => {
        container.classList.remove('loading-skeleton');
        if (renderCallback) renderCallback();
    }, duration);
}

function goToScreen(screenId) {
    goToScreenInternal(screenId, false);
}

function goToScreenInternal(screenId, isBack = false) {
    const prevScreen = appState.currentScreen;

    // Manage history stack
    if (!isBack && prevScreen && prevScreen !== screenId) {
        if (screenId === 'home') {
            appState.navHistory = [];
        } else {
            appState.navHistory.push(prevScreen);
        }
    }

    appState.currentScreen = screenId;

    // Stop live maps animation loops
    if (appState.liveTrackingInterval) {
        clearInterval(appState.liveTrackingInterval);
        appState.liveTrackingInterval = null;
    }
    if (appState.marigoldAnimationId) {
        cancelAnimationFrame(appState.marigoldAnimationId);
        appState.marigoldAnimationId = null;
    }

    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));

    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.scrollTop = 0;
    }

    document.querySelectorAll('.nav-link-btn').forEach(btn => {
        if (btn.getAttribute('data-screen') === screenId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    try {
        // Screen specific startups with skeleton UI loader wrapping
        if (screenId === 'splash') {
            playSplashAnimation();
        } else if (screenId === 'ride-booking') {
            initLeafletInteractiveMap();
            triggerSkeletonScreen('vehicle-types-cards-container', 1200, () => {
                populateVehicleOptionList();
            });
        } else if (screenId === 'driver-matching') {
            setTimeout(() => {
                if (appState.currentScreen === 'driver-matching') {
                    simulateDriverMatchSuccess();
                }
            }, 4000);
        } else if (screenId === 'live-tracking') {
            initLeafletLiveTrackingMap();
        } else if (screenId === 'wedding-booking') {
            renderWeddingMarketplace();
            updateWeddingTotal();
        } else if (screenId === 'shaadi-planner') {
            appState.shaadiViewStack = ['hub'];
            updateShaadiCountdown();
            selectShaadiReligion(appState.shaadiSelection.religion);
            showShaadiSubView('hub');
        } else if (screenId === 'wedding-success') {
            startMarigoldPetalsShower();
            const recCar = document.getElementById('rec-wedding-car');
            const recTier = document.getElementById('rec-wedding-tier');
            const recDate = document.getElementById('rec-wedding-date');
            const recPrice = document.getElementById('rec-wedding-price');
            if (recCar) recCar.innerText = appState.selectedWeddingCar;
            if (recTier) recTier.innerText = `${appState.selectedWeddingPkg} Package`;
            if (recDate) recDate.innerText = appState.weddingDate;
            if (recPrice) recPrice.innerText = `₹${appState.selectedWeddingPrice.toLocaleString()}`;
        } else if (screenId === 'profile') {
            triggerSkeletonScreen('recent-bookings-container', 1000, () => {
                populateBookingHistory();
            });
            triggerSkeletonScreen('upcoming-bookings-container', 1000, () => {
                populateScheduledRides();
            });
            populateDriverPreferences();
            const coinsVal = document.getElementById('setu-coins-val');
            if (coinsVal) coinsVal.innerText = appState.setuCoins;
        } else if (screenId === 'payments') {
            const balanceDisplay = document.getElementById('wallet-balance-display');
            if (balanceDisplay) {
                triggerSkeletonScreen('wallet-balance-display', 1000, () => {
                    balanceDisplay.innerText = `₹${appState.walletBalance.toFixed(2)}`;
                });
            }
            syncPrimaryPayModeUI();
        } else if (screenId === 'notifications') {
            const notifContainer = document.querySelector('.notifications-list-container');
            if (notifContainer) {
                if (!notifContainer.id) notifContainer.id = 'notifications-list-container-id';
                triggerSkeletonScreen(notifContainer.id, 1000, () => {
                    populateNotifications();
                });
            }
        }
    } catch (e) {
        console.error("Error starting up screen " + screenId + ":", e);
        const overlay = document.getElementById('system-error-overlay');
        const descEl = document.getElementById('error-overlay-desc');
        if (overlay && descEl) {
            descEl.innerText = `Error on screen '${screenId}':\n${e.message}\n${e.stack || ''}`;
            overlay.classList.remove('hidden');
        }
    }
}

function goBack() {
    if (appState.navHistory && appState.navHistory.length > 0) {
        const prevScreen = appState.navHistory.pop();
        goToScreenInternal(prevScreen, true);
    } else {
        // Fallback to home if history is empty
        goToScreenInternal('home', true);
    }
}

function jumpToScreen(screenId) {
    showToast('Navigation', `Jumping to screen: ${screenId.replace('-', ' ')}`);
    goToScreen(screenId);
}

/* ==========================================================================
   ONBOARDING SCREEN CONTROLS
   ========================================================================== */
function setOnboardingSlide(index) {
    appState.onboardingSlide = index;

    // Update active slide
    document.querySelectorAll('.onboarding-slide').forEach((slide, idx) => {
        if (idx === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Update active dot
    document.querySelectorAll('.slider-dots .dot').forEach((dot, idx) => {
        if (idx === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // If it's the last slide, change Next button text to Get Started
    const nextLabel = document.getElementById('onboarding-next-label');
    if (nextLabel) {
        if (index === 2) {
            nextLabel.setAttribute('data-en', 'Get Started');
            nextLabel.setAttribute('data-hi', 'शुरू करें');
            nextLabel.setAttribute('data-mai', 'शुरू करू');
            nextLabel.setAttribute('data-bho', 'शुरू करीं');
        } else {
            nextLabel.setAttribute('data-en', 'Next');
            nextLabel.setAttribute('data-hi', 'आगे बढ़ें');
            nextLabel.setAttribute('data-mai', 'आगे');
            nextLabel.setAttribute('data-bho', 'आगे');
        }
        setLanguage(appState.language);
    }
}

function nextOnboardingSlide() {
    if (appState.onboardingSlide < 2) {
        setOnboardingSlide(appState.onboardingSlide + 1);
    } else {
        skipOnboarding();
    }
}

function skipOnboarding() {
    goToScreen('login');
}

/* ==========================================================================
   LOGIN & OTP VERIFICATION
   ========================================================================== */
let otpTimerInterval = null;

function validatePhoneInput() {
    const phoneVal = document.getElementById('user-mobile-input').value.trim();
    const termsCheck = document.getElementById('terms-check').checked;
    const btn = document.getElementById('btn-send-otp');
    if (phoneVal.length === 10 && /^\d+$/.test(phoneVal) && termsCheck) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

function sendOTP() {
    const phoneVal = document.getElementById('user-mobile-input').value.trim();
    document.getElementById('display-otp-number').innerText = `${phoneVal} (Enter OTP: 1234)`;
    document.getElementById('login-form-number').classList.add('hidden');
    document.getElementById('login-form-otp').classList.remove('hidden');

    // Clear any existing OTP inputs
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`otp-${i}`).value = '';
    }
    const otp1 = document.getElementById('otp-1');
    if (otp1) otp1.focus();

    showToast('OTP Sent', 'Simulated OTP is 1234.', false);

    let secondsLeft = 30;
    const timerEl = document.getElementById('otp-seconds');
    if (timerEl) {
        timerEl.innerText = `${secondsLeft}s`;
    }

    if (otpTimerInterval) clearInterval(otpTimerInterval);
    otpTimerInterval = setInterval(() => {
        secondsLeft--;
        if (timerEl) {
            if (secondsLeft > 0) {
                timerEl.innerText = `${secondsLeft}s`;
            } else {
                clearInterval(otpTimerInterval);
                const trans = {
                    en: 'Resend',
                    hi: 'पुनः भेजें',
                    mai: 'दोबारा',
                    bho: 'फिर से'
                };
                const text = trans[appState.language] || 'Resend';
                timerEl.innerHTML = `<span style="color: var(--primary-green); cursor: pointer; font-weight: 600;" onclick="sendOTP()">${text}</span>`;
            }
        }
    }, 1000);
}

function editPhoneNumber() {
    document.getElementById('login-form-number').classList.remove('hidden');
    document.getElementById('login-form-otp').classList.add('hidden');
    if (otpTimerInterval) {
        clearInterval(otpTimerInterval);
        otpTimerInterval = null;
    }
}

function focusNextOTP(el, index) {
    // Handled dynamically via addEventListener in DOMContentLoaded
}

function verifyOTP() {
    let code = '';
    for (let i = 1; i <= 4; i++) {
        const val = document.getElementById(`otp-${i}`).value;
        code += val;
    }
    if (code === '1234') {
        showToast('Login Successful', 'Please complete your profile details.', false);
        if (otpTimerInterval) {
            clearInterval(otpTimerInterval);
            otpTimerInterval = null;
        }

        // Capture phone
        const phoneInput = document.getElementById('user-mobile-input');
        if (phoneInput && phoneInput.value.trim()) {
            appState.userProfile.phone = phoneInput.value.trim();
        }

        goToScreen('register');
    } else {
        showToast('Verification Failed', 'Invalid OTP. Please enter 1234.', true);
    }
}

function selectGender(gender) {
    const genderInput = document.getElementById('reg-gender');
    if (genderInput) genderInput.value = gender;
    document.querySelectorAll('#screen-register .gender-card').forEach(card => {
        if (card.getAttribute('data-gender') === gender) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
}

function submitRegistration() {
    const salutation = document.getElementById('reg-salutation').value;
    const firstName = document.getElementById('reg-firstname').value.trim();
    const middleName = document.getElementById('reg-middlename').value.trim();
    const lastName = document.getElementById('reg-lastname').value.trim();
    const gender = document.getElementById('reg-gender').value;
    const religion = document.getElementById('reg-religion').value;
    const dob = document.getElementById('reg-dob').value;
    const email = document.getElementById('reg-email').value.trim();

    if (!firstName) {
        showToast('Required Field', 'Please enter your First Name.', true);
        return;
    }
    if (!lastName) {
        showToast('Required Field', 'Please enter your Last Name.', true);
        return;
    }
    if (!dob) {
        showToast('Required Field', 'Please enter your Date of Birth.', true);
        return;
    }
    if (!email) {
        showToast('Required Field', 'Please enter your Email Address.', true);
        return;
    }

    // Save to state
    appState.userProfile = {
        salutation,
        firstName,
        middleName,
        lastName,
        gender,
        religion,
        dob,
        phone: appState.userProfile.phone || '9876543210',
        email
    };

    // Apply theme
    applyReligionTheme(religion);

    showToast('Profile Created', `Welcome, ${salutation} ${firstName}!`, false);
    goToScreen('permissions');
}

function updateDynamicUserElements() {
    const p = appState.userProfile;
    if (!p) return;
    const fullName = `${p.firstName}${p.middleName ? ' ' + p.middleName : ''} ${p.lastName}`.trim();
    
    // Initials
    const firstChar = p.firstName ? p.firstName.trim().charAt(0).toUpperCase() : '';
    const lastChar = p.lastName ? p.lastName.trim().charAt(0).toUpperCase() : '';
    const initials = (firstChar + lastChar) || 'AN';

    // 1. Home screen avatar
    const homeAvatar = document.getElementById('home-avatar-div');
    if (homeAvatar) homeAvatar.innerText = initials;

    // 2. Profile screen avatar
    const profileAvatar = document.getElementById('profile-avatar-div');
    if (profileAvatar) profileAvatar.innerText = initials;

    // 3. Profile screen name, email, phone
    const profileName = document.getElementById('profile-name-h3');
    if (profileName) profileName.innerText = fullName;

    const profileEmail = document.getElementById('profile-email-p');
    if (profileEmail) profileEmail.innerText = p.email || `${p.firstName.toLowerCase()}@safarsetu.com`;

    const profilePhone = document.getElementById('profile-phone-span');
    if (profilePhone) {
        const formattedPhone = p.phone.length === 10 ? `+91 ${p.phone.slice(0, 5)} ${p.phone.slice(5)}` : p.phone;
        profilePhone.innerText = formattedPhone;
    }

    // 4. Payments screen UPI IDs
    const gpayUpi = document.getElementById('payments-gpay-upi-span');
    if (gpayUpi) gpayUpi.innerText = `${p.firstName.toLowerCase()}@okaxis`;

    const phonepeUpi = document.getElementById('payments-phonepe-upi-span');
    if (phonepeUpi) phonepeUpi.innerText = `${p.phone}@ybl`;

    // 5. Update bilingual greetings based on selected religion
    const greetingSpan = document.getElementById('home-greeting-span');
    if (greetingSpan) {
        const salutationMap = {
            'Mr.': { en: 'Mr.', hi: 'श्री', mai: 'श्री', bho: 'श्री' },
            'Mrs.': { en: 'Mrs.', hi: 'श्रीमती', mai: 'श्रीमती', bho: 'श्रीमती' },
            'Miss': { en: 'Miss', hi: 'सुश्री', mai: 'सुश्री', bho: 'सुश्री' }
        };
        const s = salutationMap[p.salutation] || { en: p.salutation, hi: p.salutation, mai: p.salutation, bho: p.salutation };

        const displayName = `${p.firstName} ${p.lastName}`;

        const greetings = {
            Hindu: { en: 'Namaskar', hi: 'नमस्कार', mai: 'प्रणाम', bho: 'प्रणाम' },
            Muslim: { en: 'Assalamualaikum', hi: 'अस्सलाम वालेकुम', mai: 'अस्सलाम वालेकुम', bho: 'अस्सलाम वालेकुम' },
            Sikh: { en: 'Sat Sri Akal', hi: 'सत श्री अकाल', mai: 'सत श्री अकाल', bho: 'सत श्री अकाल' },
            Christian: { en: 'God Bless You', hi: 'ईश्वर आपका भला करे', mai: 'ईश्वर अहाँक कल्याण करथि', bho: 'भगवान राउर भला करें' },
            Buddhist: { en: 'Namo Buddhaya', hi: 'नमो बुद्धाय', mai: 'नमो बुद्धाय', bho: 'नमो बुद्धाय' },
            Jain: { en: 'Jai Jinendra', hi: 'जय जिनेन्द्र', mai: 'जय जिनेन्द्र', bho: 'जय जिनेन्द्र' }
        };

        const religion = p.religion || 'Hindu';
        const g = greetings[religion] || greetings.Hindu;

        greetingSpan.setAttribute('data-en', `${g.en}, ${s.en} ${displayName}!`);
        greetingSpan.setAttribute('data-hi', `${g.hi}, ${s.hi} ${displayName}!`);
        greetingSpan.setAttribute('data-mai', `${g.mai}, ${s.mai} ${displayName}!`);
        greetingSpan.setAttribute('data-bho', `${g.bho}, ${s.bho} ${displayName}!`);

        // Re-apply language translating so it immediately reflects
        if (typeof setLanguage === 'function') {
            setLanguage(appState.language);
        }
    }
}

let currentRequestedPermission = null;

function requestPermission(type) {
    currentRequestedPermission = type;
    const dialog = document.getElementById('os-permission-dialog');
    const promptIcon = document.getElementById('os-prompt-icon');
    const promptTitle = document.getElementById('os-prompt-title');
    const promptDesc = document.getElementById('os-prompt-desc');

    if (!dialog || !promptIcon || !promptTitle || !promptDesc) return;

    const details = {
        location: {
            icon: '🗺️',
            title: 'Location Access',
            desc: 'Allow SafarSetu to access this device\'s location to show nearby rides and track your journey?'
        },
        contacts: {
            icon: '👥',
            title: 'Contacts Access',
            desc: 'Allow SafarSetu to access your contacts to quickly share live ride status and send Emergency SOS to friends?'
        },
        notifications: {
            icon: '🔔',
            title: 'Notifications Access',
            desc: 'Allow SafarSetu to send you notifications for ride status updates, safety alerts, and best booking offers?'
        },
        microphone: {
            icon: '🎙️',
            title: 'Microphone Access',
            desc: 'Allow SafarSetu to access your microphone for voice searches and wedding planning assistance?'
        }
    };

    const d = details[type];
    if (d) {
        promptIcon.innerText = d.icon;
        promptTitle.innerText = d.title;
        promptDesc.innerText = d.desc;
        dialog.classList.remove('hidden');
        triggerHaptic('success');
    }
}

function grantPermission(allowed) {
    const dialog = document.getElementById('os-permission-dialog');
    if (dialog) dialog.classList.add('hidden');

    const type = currentRequestedPermission;
    if (!type) return;

    if (allowed) {
        appState.appPermissions[type] = true;
        
        // Update Card UI
        const card = document.getElementById(`perm-card-${type}`);
        if (card) card.classList.add('allowed');

        const btn = document.getElementById(`perm-btn-${type}`);
        if (btn) {
            btn.innerHTML = `<span class="text-bilingual" data-en="✓ Allowed" data-hi="✓ स्वीकृत" data-mai="✓ स्वीकृत" data-bho="✓ स्वीकृत">✓ Allowed</span>`;
            // Refresh language on this button
            if (typeof setLanguage === 'function') {
                setLanguage(appState.language);
            }
        }
        showToast('Access Granted', `Permission for ${type} enabled!`, false);
        triggerHaptic('success');
    } else {
        showToast('Access Denied', `SafarSetu cannot use ${type} features.`, true);
        triggerHaptic('error');
    }
}

function grantAllPermissions() {
    const types = ['location', 'contacts', 'notifications', 'microphone'];
    types.forEach(type => {
        appState.appPermissions[type] = true;
        const card = document.getElementById(`perm-card-${type}`);
        if (card) card.classList.add('allowed');

        const btn = document.getElementById(`perm-btn-${type}`);
        if (btn) {
            btn.innerHTML = `<span class="text-bilingual" data-en="✓ Allowed" data-hi="✓ स्वीकृत" data-mai="✓ स्वीकृत" data-bho="✓ स्वीकृत">✓ Allowed</span>`;
        }
    });

    if (typeof setLanguage === 'function') {
        setLanguage(appState.language);
    }

    showToast('Success', 'All permissions successfully enabled!', false);
    triggerHaptic('success');
}

function continueToHome() {
    if (!appState.appPermissions.location) {
        showToast('Recommendation', 'GPS Location is required to request rides. Please enable Location access.', true);
        requestPermission('location');
        return;
    }
    showToast('Ready to Go', 'Welcome to your SafarSetu dashboard!', false);
    goToScreen('home');
}

/* ==========================================================================
   SERVICES & BOOKING TRIGGERS
   ========================================================================== */
function openRideSearch(vehicleType) {
    appState.bookingType = 'ride';
    if (vehicleType === 'bike') {
        appState.selectedVehicle = 'Setu Bike';
    } else {
        appState.selectedVehicle = 'Safar E-Rickshaw';
    }
    goToScreen('ride-booking');
}

function openOutstationBooking() {
    appState.bookingType = 'ride';
    appState.pickupLocation = "Patna Junction Gate 1, Patna";
    appState.pickupCoords = [25.5941, 85.1376];
    appState.dropLocation = "Gaya Mahabodhi Temple, Gaya";
    appState.dropCoords = [24.6959, 84.9914];
    appState.selectedVehicle = 'Vidyapati Sedan';
    showToast('Outstation Mode', 'Route set: Patna to Gaya. Confirm details.', false);
    goToScreen('ride-booking');
}

function openParcelBooking() {
    appState.bookingType = 'tempo';
    showToast('Parcel Delivery', 'Select a cargo vehicle for your parcel.', false);
    goToScreen('ride-booking');
}

function showMoreServicesAlert() {
    showToast('Coming Soon', 'Helicopter Tourism & Ganga Ferry services are under development!', false);
}

function setPromoSlide(index) {
    // Placeholder in case of carousel interactions
}

/* ==========================================================================
   DYNAMIC FOUR-LANGUAGE TRANSLATOR (Maithili/Bhojpuri added)
   ========================================================================== */
function setLanguage(lang) {
    appState.language = lang;

    // Toggle active state in presenter sidebar
    document.querySelectorAll('.language-buttons-sidebar .btn-control').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeSidebarBtn = document.getElementById(`btn-lang-${lang}`);
    if (activeSidebarBtn) activeSidebarBtn.classList.add('active');

    // Toggle active state in settings screen
    document.querySelectorAll('.language-selection-row .btn-lang-toggle').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeSettingsBtn = document.getElementById(`btn-set-${lang}`);
    if (activeSettingsBtn) activeSettingsBtn.classList.add('active');

    // Translate elements containing .text-bilingual
    document.querySelectorAll('.text-bilingual').forEach(el => {
        let text = el.getAttribute(`data-${lang}`);
        // Fallback to Hindi if Maithili/Bhojpuri translation is blank
        if (!text) text = el.getAttribute('data-hi');
        if (!text) text = el.getAttribute('data-en');
        if (text) {
            el.innerHTML = text;
        }
    });

    // Translate Inputs
    const mobileInput = document.getElementById('user-mobile-input');
    if (mobileInput) {
        mobileInput.placeholder = lang === 'en' ? '98765 43210' : '९८७६५ ४३२१०';
    }
    const searchPlaceholder = document.querySelector('.search-placeholder');
    if (searchPlaceholder) {
        const placeMap = {
            en: 'Where to, Bihar? (कहाँ जाना है?)',
            hi: 'कहाँ जाना है, बिहार?',
            mai: 'कतय जाएब, बिहार?',
            bho: 'कहाँ जाये के बा, बिहार?'
        };
        searchPlaceholder.innerText = placeMap[lang] || placeMap['en'];
    }
    const pickupInput = document.getElementById('pickup-autocomplete');
    if (pickupInput) {
        pickupInput.placeholder = lang === 'en' ? 'Pickup location (प्रस्थान स्थान)...' : 'प्रस्थान स्थान...';
    }
    const dropInput = document.getElementById('drop-autocomplete');
    if (dropInput) {
        dropInput.placeholder = lang === 'en' ? 'Where to? (कहाँ जाना है?)...' : 'कहाँ जाना है?...';
    }
}

/* ==========================================================================
   INTERACTIVE MAP ENGINE (LeafletJS styled like Google Maps)
   ========================================================================== */
function initLeafletInteractiveMap() {
    // Check if Leaflet is available in document
    if (typeof L === 'undefined') {
        console.error('Leaflet is not loaded!');
        return;
    }

    // Destroy existing map instance to prevent leaks
    if (appState.leafletMap) {
        appState.leafletMap.remove();
        appState.leafletMap = null;
    }

    // Initialize map centered at Patna Jct
    appState.leafletMap = L.map('live-interactive-map', {
        zoomControl: false,
        attributionControl: false
    }).setView(appState.pickupCoords, 12);

    // Style tiles natively based on active theme and selected style
    const tileUrl = getTileLayerUrl(appState.activeMapStyle, appState.isDarkMode);
    L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: getTileLayerAttribution(appState.activeMapStyle)
    }).addTo(appState.leafletMap);

    // Define custom green (pickup) and gold (drop) icons
    const pickupIcon = L.divIcon({
        className: 'custom-map-marker',
        html: '<div style="background: #1B5E3F; border: 2px solid white; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    const dropIcon = L.divIcon({
        className: 'custom-map-marker',
        html: '<div style="background: #D93838; border: 2px solid white; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    // Create Draggable Pins
    appState.pickupMarker = L.marker(appState.pickupCoords, {
        draggable: true,
        icon: pickupIcon
    }).addTo(appState.leafletMap);

    appState.dropMarker = L.marker(appState.dropCoords, {
        draggable: true,
        icon: dropIcon
    }).addTo(appState.leafletMap);

    // Draw route preview polyline
    appState.routeLine = L.polyline([appState.pickupCoords, appState.dropCoords], {
        color: '#1B5E3F',
        weight: 5,
        dashArray: '5, 8'
    }).addTo(appState.leafletMap);

    // Update route visually during dragging (straight-line feedback to avoid fetch storm)
    appState.pickupMarker.on('drag', () => {
        const pLatLng = appState.pickupMarker.getLatLng();
        const dLatLng = appState.dropMarker.getLatLng();
        if (appState.routeLine) appState.routeLine.setLatLngs([pLatLng, dLatLng]);
    });
    appState.dropMarker.on('drag', () => {
        const pLatLng = appState.pickupMarker.getLatLng();
        const dLatLng = appState.dropMarker.getLatLng();
        if (appState.routeLine) appState.routeLine.setLatLngs([pLatLng, dLatLng]);
    });

    // Call direction API and geofence checks only on dragend
    appState.pickupMarker.on('dragend', () => {
        recalculateRoute();
        checkGeofenceServiceArea();
    });
    appState.dropMarker.on('dragend', () => {
        recalculateRoute();
        checkGeofenceServiceArea();
    });

    // Fit map bounds to show both markers
    fitMapBounds();
    recalculateRoute();
    checkGeofenceServiceArea();

    // Populate search inputs initially (leave blank for user typing)
    document.getElementById('pickup-autocomplete').value = '';
    document.getElementById('drop-autocomplete').value = '';
}

function fitMapBounds() {
    if (!appState.leafletMap) return;
    const group = new L.featureGroup([appState.pickupMarker, appState.dropMarker]);
    appState.leafletMap.fitBounds(group.getBounds().pad(0.15));
}

function recalculateRoute() {
    let pLat, pLng, dLat, dLng;

    if (appState.googlePickupMarker && appState.googleDropMarker && typeof google !== 'undefined') {
        const pPos = appState.googlePickupMarker.getPosition();
        const dPos = appState.googleDropMarker.getPosition();
        pLat = pPos.lat();
        pLng = pPos.lng();
        dLat = dPos.lat();
        dLng = dPos.lng();
    } else if (appState.pickupMarker && appState.dropMarker) {
        const pLatLng = appState.pickupMarker.getLatLng();
        const dLatLng = appState.dropMarker.getLatLng();
        pLat = pLatLng.lat;
        pLng = pLatLng.lng;
        dLat = dLatLng.lat;
        dLng = dLatLng.lng;
    } else {
        return; // No active markers to calculate route for
    }

    appState.pickupCoords = [pLat, pLng];
    appState.dropCoords = [dLat, dLng];

    // Determine API Key and url for routing
    const orsKey = document.getElementById('ors-api-key') ? document.getElementById('ors-api-key').value.trim() : '';

    let routingUrl = '';
    let useORS = false;

    if (orsKey) {
        // Use OpenRouteService Directions API
        routingUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${orsKey}&start=${pLng},${pLat}&end=${dLng},${dLat}`;
        useORS = true;
    } else {
        // Fallback to keyless OSRM API with steps requested
        routingUrl = `https://router.project-osrm.org/route/v1/driving/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson&steps=true`;
    }

    fetch(routingUrl)
        .then(res => {
            if (!res.ok) throw new Error("Routing API response not OK");
            return res.json();
        })
        .then(data => {
            let coordsList = [];
            let distanceKm = 0;
            let durationMins = 0;

            if (useORS) {
                // OpenRouteService geometry format is GeoJSON LineString under features[0].geometry.coordinates
                if (data.features && data.features.length > 0) {
                    const geom = data.features[0].geometry;
                    const props = data.features[0].properties;

                    // ORS returns coords as [lng, lat]
                    coordsList = geom.coordinates.map(c => [c[1], c[0]]);
                    // ORS returns distance in meters, duration in seconds
                    distanceKm = parseFloat((props.summary.distance / 1000).toFixed(1));
                    durationMins = Math.max(3, Math.round(props.summary.duration / 60));

                    // Parse turn-by-turn navigation steps
                    if (props.segments && props.segments[0] && props.segments[0].steps) {
                        appState.routeSteps = props.segments[0].steps.map(step => ({
                            instruction: step.instruction || "Drive along the road",
                            distance: step.distance,
                            duration: step.duration
                        }));
                    } else {
                        appState.routeSteps = generateFallbackSteps(appState.pickupLocation, appState.dropLocation, distanceKm);
                    }
                } else {
                    throw new Error("No route found in ORS response");
                }
            } else {
                // OSRM format is geometries under routes[0].geometry
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    coordsList = route.geometry.coordinates.map(c => [c[1], c[0]]);
                    distanceKm = parseFloat((route.distance / 1000).toFixed(1));
                    durationMins = Math.max(3, Math.round(route.duration / 60));

                    // Parse turn-by-turn navigation steps
                    if (route.legs && route.legs[0] && route.legs[0].steps) {
                        const steps = route.legs[0].steps;
                        appState.routeSteps = steps.map(step => {
                            let instruction = "";
                            const name = step.name ? `onto ${step.name}` : "";
                            const type = step.maneuver.type;
                            const modifier = step.maneuver.modifier || "";

                            if (type === "depart") {
                                instruction = `Head ${modifier} from ${appState.pickupLocation}`;
                            } else if (type === "arrive") {
                                instruction = `Arrive at ${appState.dropLocation}`;
                            } else if (type === "turn" || type === "ramp" || type === "fork") {
                                instruction = `Turn ${modifier} ${name}`;
                            } else if (type === "new name") {
                                instruction = `Continue onto ${step.name || "the road"}`;
                            } else {
                                instruction = `${type.charAt(0).toUpperCase() + type.slice(1)} ${modifier} ${name}`;
                            }
                            instruction = instruction.replace(/\s+/g, ' ').trim();
                            if (!instruction) {
                                instruction = "Continue straight";
                            }
                            return {
                                instruction: instruction,
                                distance: step.distance,
                                duration: step.duration
                            };
                        });
                    } else {
                        appState.routeSteps = generateFallbackSteps(appState.pickupLocation, appState.dropLocation, distanceKm);
                    }
                } else {
                    throw new Error("No route found in OSRM response");
                }
            }

            appState.routeDistance = distanceKm;
            appState.routeDuration = durationMins;

            // Update Leaflet Route Polyline
            if (appState.leafletMap && appState.routeLine) {
                appState.routeLine.setLatLngs(coordsList);
                fitMapBounds();
            }

            // Update Google Maps Route Polyline if active
            if (appState.googleMap && appState.googleRouteLine && typeof google !== 'undefined') {
                const googleCoords = coordsList.map(c => new google.maps.LatLng(c[0], c[1]));
                appState.googleRouteLine.setPath(googleCoords);

                const bounds = new google.maps.LatLngBounds();
                googleCoords.forEach(c => bounds.extend(c));
                appState.googleMap.fitBounds(bounds);
            }

            // Update Display Sheet Metrics
            const distEl = document.getElementById('metric-dist');
            const timeEl = document.getElementById('metric-time');
            if (distEl) distEl.innerText = `Distance: ${appState.routeDistance} km`;
            if (timeEl) timeEl.innerText = `ETA: ${appState.routeDuration} mins`;

            appState.currentRouteStepIndex = 0;
            updateNavigationHUD();
            updateVehicleFares();
        })
        .catch(err => {
            console.warn("Directions API fetch failed, falling back to straight line:", err);
            // Fallback to straight-line distance calculation
            const distanceMeters = getDistanceBetweenCoords(pLat, pLng, dLat, dLng);
            appState.routeDistance = parseFloat((distanceMeters / 1000).toFixed(1));
            appState.routeDuration = Math.max(3, Math.round(appState.routeDistance * 2.2));

            const straightCoords = [[pLat, pLng], [dLat, dLng]];

            if (appState.leafletMap && appState.routeLine) {
                appState.routeLine.setLatLngs(straightCoords);
                fitMapBounds();
            }

            if (appState.googleMap && appState.googleRouteLine && typeof google !== 'undefined') {
                const googleCoords = straightCoords.map(c => new google.maps.LatLng(c[0], c[1]));
                appState.googleRouteLine.setPath(googleCoords);

                const bounds = new google.maps.LatLngBounds();
                googleCoords.forEach(c => bounds.extend(c));
                appState.googleMap.fitBounds(bounds);
            }

            const distEl = document.getElementById('metric-dist');
            const timeEl = document.getElementById('metric-time');
            if (distEl) distEl.innerText = `Distance: ${appState.routeDistance} km`;
            if (timeEl) timeEl.innerText = `ETA: ${appState.routeDuration} mins`;

            appState.routeSteps = generateFallbackSteps(appState.pickupLocation, appState.dropLocation, appState.routeDistance);
            appState.currentRouteStepIndex = 0;
            updateNavigationHUD();
            updateVehicleFares();
        });
}

/* ==========================================================================
   SERVICE AREAS GEOFENCING SYSTEM (Patna, Gaya, Muzaffarpur)
   ========================================================================== */
function checkGeofenceServiceArea() {
    let pLat, pLng, dLat, dLng;

    if (appState.googlePickupMarker && appState.googleDropMarker && typeof google !== 'undefined') {
        const pPos = appState.googlePickupMarker.getPosition();
        const dPos = appState.googleDropMarker.getPosition();
        pLat = pPos.lat();
        pLng = pPos.lng();
        dLat = dPos.lat();
        dLng = dPos.lng();
    } else if (appState.pickupMarker && appState.dropMarker) {
        const pLatLng = appState.pickupMarker.getLatLng();
        const dLatLng = appState.dropMarker.getLatLng();
        pLat = pLatLng.lat;
        pLng = pLatLng.lng;
        dLat = dLatLng.lat;
        dLng = dLatLng.lng;
    } else {
        return; // No markers active
    }

    const pOk = isCoordinateInGeofence(pLat, pLng);
    const dOk = isCoordinateInGeofence(dLat, dLng);

    const alertBox = document.getElementById('geofence-alert');
    if (alertBox) {
        if (!pOk || !dOk) {
            alertBox.classList.remove('hidden');
        } else {
            alertBox.classList.add('hidden');
        }
    }
}

function isCoordinateInGeofence(lat, lng) {
    // Entire India coverage is enabled. Validate coordinates are within the geographic boundaries of India.
    // India coordinate boundaries: Lat 5.0 to 38.0, Lng 65.0 to 98.0
    return (lat >= 5.0 && lat <= 38.0 && lng >= 65.0 && lng <= 98.0);
}

function getDistanceBetweenCoords(lat1, lon1, lat2, lon2) {
    if (typeof L !== 'undefined') {
        try {
            return L.latLng(lat1, lon1).distanceTo(L.latLng(lat2, lon2));
        } catch (e) { }
    }
    const R = 6371e3; // meters
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in meters
}

/* ==========================================================================
   GPS DEVICE TRIGGER AND AUTOCOMPLETE SIMULATOR
   ========================================================================== */
function triggerDeviceGPS() {
    if (navigator.geolocation) {
        showToast('GPS Search', 'Accessing mobile location coordinates...', false);
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            appState.pickupCoords = [lat, lng];
            appState.pickupLocation = "My GPS Location (मेरा स्थान)";
            document.getElementById('pickup-autocomplete').value = appState.pickupLocation;

            if (appState.googlePickupMarker && appState.googleMap && typeof google !== 'undefined') {
                const gCoords = new google.maps.LatLng(lat, lng);
                appState.googlePickupMarker.setPosition(gCoords);
                appState.googleMap.setCenter(gCoords);

                const pPos = appState.googlePickupMarker.getPosition();
                const dPos = appState.googleDropMarker.getPosition();
                const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(pPos, dPos);
                appState.routeDistance = parseFloat((distanceMeters / 1000).toFixed(1));
                appState.routeDuration = Math.max(3, Math.round(appState.routeDistance * 2.2));
                if (appState.googleRouteLine) {
                    appState.googleRouteLine.setPath([pPos, dPos]);
                }
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(pPos);
                bounds.extend(dPos);
                appState.googleMap.fitBounds(bounds);

                document.getElementById('metric-dist').innerText = `Distance: ${appState.routeDistance} km`;
                document.getElementById('metric-time').innerText = `ETA: ${appState.routeDuration} mins`;
                updateVehicleFares();
                checkGeofenceServiceArea();
            } else if (appState.pickupMarker && appState.leafletMap) {
                appState.pickupMarker.setLatLng([lat, lng]);
                appState.leafletMap.setView([lat, lng], 14);
                recalculateRoute();
                checkGeofenceServiceArea();
            }
        }, (err) => {
            showToast('GPS Offline', 'Simulating GPS centering to Patna Junction.', true);
            // Fallback simulated placement
            setSimulatedLocation('pickup', 'Vikas Bhawan (Patna GPS Mock)', [25.6088, 85.1120]);
        });
    } else {
        showToast('GPS Error', 'Geolocation not supported.', true);
    }
}

function triggerSearchRoute() {
    const pickupVal = document.getElementById('pickup-autocomplete').value.trim();
    const dropVal = document.getElementById('drop-autocomplete').value.trim();

    if (!pickupVal) {
        showToast('Input Missing', 'Please enter a pickup location.', true);
        return;
    }
    if (!dropVal) {
        showToast('Input Missing', 'Please enter a destination (Where to?).', true);
        return;
    }

    showToast('Searching Route', 'Resolving pickup and destination...', false);
    resolveLocationInput('pickup');
    setTimeout(() => {
        resolveLocationInput('drop');
    }, 300);
}

let activeSuggestInput = 'pickup';
let suggestTimeout = null;

function suggestAutocomplete(type) {
    activeSuggestInput = type;
    const inputVal = document.getElementById(`${type}-autocomplete`).value.trim();
    const suggestionsBox = document.getElementById('autocomplete-suggestions-box');

    if (inputVal.length < 2) {
        suggestionsBox.classList.add('hidden');
        return;
    }

    // Dynamic positioning based on active input type
    if (type === 'pickup') {
        suggestionsBox.style.top = '50px';
    } else {
        suggestionsBox.style.top = '92px';
    }

    if (suggestTimeout) clearTimeout(suggestTimeout);
    suggestTimeout = setTimeout(() => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(inputVal)}&countrycodes=in&limit=5`;

        fetch(url, {
            headers: {
                'Accept-Language': 'en,hi'
            }
        })
            .then(res => res.json())
            .then(data => {
                suggestionsBox.innerHTML = '';
                if (!data || data.length === 0) {
                    fetchPhotonSuggestions(inputVal, type, suggestionsBox);
                } else {
                    data.forEach(item => {
                        const lat = parseFloat(item.lat);
                        const lon = parseFloat(item.lon);
                        const cleanName = cleanNominatimName(item.display_name);
                        createSuggestionItem(suggestionsBox, type, cleanName, [lat, lon]);
                    });
                    suggestionsBox.classList.remove('hidden');
                }
            })
            .catch(err => {
                console.warn("Nominatim fetch error, trying Photon:", err);
                fetchPhotonSuggestions(inputVal, type, suggestionsBox);
            });
    }, 300);
}

function fetchPhotonSuggestions(inputVal, type, suggestionsBox) {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(inputVal)}&limit=5`;
    fetch(photonUrl)
        .then(res => res.json())
        .then(photonData => {
            suggestionsBox.innerHTML = '';
            if (!photonData || !photonData.features || photonData.features.length === 0) {
                // Fall back to local biharPlaces as the final layer
                const filtered = biharPlaces.filter(p => p.name.toLowerCase().includes(inputVal.toLowerCase()));
                if (filtered.length === 0) {
                    suggestionsBox.classList.add('hidden');
                    return;
                }
                filtered.forEach(place => {
                    createSuggestionItem(suggestionsBox, type, place.name, place.coords);
                });
            } else {
                photonData.features.forEach(feat => {
                    const lon = feat.geometry.coordinates[0];
                    const lat = feat.geometry.coordinates[1];
                    const props = feat.properties;
                    const parts = [];
                    if (props.name) parts.push(props.name);
                    if (props.street) parts.push(props.street);
                    if (props.city) parts.push(props.city);
                    if (props.state) parts.push(props.state);
                    const displayName = parts.join(', ');
                    createSuggestionItem(suggestionsBox, type, displayName, [lat, lon]);
                });
            }
            suggestionsBox.classList.remove('hidden');
        })
        .catch(photonErr => {
            console.warn("Photon fetch error, using local fallback:", photonErr);
            const filtered = biharPlaces.filter(p => p.name.toLowerCase().includes(inputVal.toLowerCase()));
            if (filtered.length > 0) {
                suggestionsBox.innerHTML = '';
                filtered.forEach(place => {
                    createSuggestionItem(suggestionsBox, type, place.name, place.coords);
                });
                suggestionsBox.classList.remove('hidden');
            } else {
                suggestionsBox.classList.add('hidden');
            }
        });
}

function cleanNominatimName(fullName) {
    const parts = fullName.split(',');
    if (parts.length <= 3) return fullName.trim();
    return parts.slice(0, 3).join(',').trim();
}

function createSuggestionItem(container, type, name, coords) {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.innerText = name;
    div.onmousedown = (e) => {
        e.preventDefault();
        setSimulatedLocation(type, name, coords);
    };
    container.appendChild(div);
}

function setSimulatedLocation(type, name, coords) {
    const suggestionsBox = document.getElementById('autocomplete-suggestions-box');
    suggestionsBox.classList.add('hidden');

    document.getElementById(`${type}-autocomplete`).value = name;

    if (type === 'pickup') {
        appState.pickupLocation = name;
        appState.pickupCoords = coords;
        if (appState.pickupMarker) appState.pickupMarker.setLatLng(coords);
        if (appState.googlePickupMarker && typeof google !== 'undefined') {
            const gCoords = new google.maps.LatLng(coords[0], coords[1]);
            appState.googlePickupMarker.setPosition(gCoords);
            if (appState.googleMap) appState.googleMap.setCenter(gCoords);
        }
    } else {
        appState.dropLocation = name;
        appState.dropCoords = coords;
        if (appState.dropMarker) appState.dropMarker.setLatLng(coords);
        if (appState.googleDropMarker && typeof google !== 'undefined') {
            const gCoords = new google.maps.LatLng(coords[0], coords[1]);
            appState.googleDropMarker.setPosition(gCoords);
        }
    }

    if (appState.googleMap && appState.googlePickupMarker && appState.googleDropMarker && typeof google !== 'undefined') {
        const pPos = appState.googlePickupMarker.getPosition();
        const dPos = appState.googleDropMarker.getPosition();
        const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(pPos, dPos);
        appState.routeDistance = parseFloat((distanceMeters / 1000).toFixed(1));
        appState.routeDuration = Math.max(3, Math.round(appState.routeDistance * 2.2));
        if (appState.googleRouteLine) {
            appState.googleRouteLine.setPath([pPos, dPos]);
        }
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(pPos);
        bounds.extend(dPos);
        appState.googleMap.fitBounds(bounds);

        document.getElementById('metric-dist').innerText = `Distance: ${appState.routeDistance} km`;
        document.getElementById('metric-time').innerText = `ETA: ${appState.routeDuration} mins`;
        updateVehicleFares();
    } else {
        fitMapBounds();
        recalculateRoute();
    }

    checkGeofenceServiceArea();
}

function resolveLocationInput(type) {
    const val = document.getElementById(`${type}-autocomplete`).value.trim();

    if (!val || val.length < 3 || appState.simulateError) {
        openSystemErrorOverlay(
            "GPS Search Error (जीपीएस त्रुटि)",
            "Location not found in India! Please verify your spelling or pick from suggestions."
        );
        document.getElementById(`${type}-autocomplete`).value = type === 'pickup' ? appState.pickupLocation : appState.dropLocation;
        return;
    }

    showToast('Resolving Search', `Geocoding location: ${val}...`, false);

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&countrycodes=in&limit=1`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                const cleanName = cleanNominatimName(data[0].display_name);
                setSimulatedLocation(type, cleanName, [lat, lon]);
            } else {
                resolvePhotonLocation(type, val);
            }
        })
        .catch(err => {
            console.warn("Nominatim resolver error, trying Photon:", err);
            resolvePhotonLocation(type, val);
        });
}

function resolvePhotonLocation(type, val) {
    const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=1`;
    fetch(photonUrl)
        .then(res => res.json())
        .then(photonData => {
            if (photonData && photonData.features && photonData.features.length > 0) {
                const feat = photonData.features[0];
                const lon = feat.geometry.coordinates[0];
                const lat = feat.geometry.coordinates[1];
                const props = feat.properties;
                const parts = [];
                if (props.name) parts.push(props.name);
                if (props.city) parts.push(props.city);
                if (props.state) parts.push(props.state);
                const displayName = parts.join(', ');
                setSimulatedLocation(type, displayName, [lat, lon]);
            } else {
                resolveLocalFallbackLocation(type, val);
            }
        })
        .catch(photonErr => {
            console.warn("Photon resolver error, using local fallback:", photonErr);
            resolveLocalFallbackLocation(type, val);
        });
}

function resolveLocalFallbackLocation(type, val) {
    const matched = biharPlaces.find(p => p.name.toLowerCase().includes(val.toLowerCase()) || val.toLowerCase().includes(p.name.toLowerCase()));
    if (matched) {
        setSimulatedLocation(type, matched.name, matched.coords);
    } else {
        const hash = val.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const latOffset = ((hash % 80) / 1000) - 0.04;
        const lngOffset = (((hash * 3) % 80) / 1000) - 0.04;
        const simulatedCoords = [25.5941 + latOffset, 85.1376 + lngOffset];
        setSimulatedLocation(type, val, simulatedCoords);
    }
}

/* ==========================================================================
   DYNAMIC VEHICLE LISTING (CAR RIDE VS CARGO TEMPO)
   ========================================================================== */
function populateVehicleOptionList() {
    const container = document.getElementById('vehicle-types-cards-container');
    if (!container) return;

    container.innerHTML = '';

    if (appState.bookingType === 'tempo') {
        // Cargo trucks options list
        const tempoVehicles = [
            { name: "Setu Mini Tempo", icon: "🚛", base: 140, rate: 12, desc: "For small home shippings | छोटा टेम्पो" },
            { name: "Sonepur Chota Hathi", icon: "🚚", base: 250, rate: 16, desc: "Tata Ace for bulky shop supplies | छोटा हाथी" },
            { name: "Ganga Large Pickup", icon: "🚛", base: 450, rate: 22, desc: "Mahindra Bolero for heavy loads" }
        ];

        tempoVehicles.forEach((v, idx) => {
            const fare = Math.round(v.base + (appState.routeDistance * v.rate));
            const card = document.createElement('div');
            card.className = `vehicle-option-card ${idx === 0 ? 'active' : ''}`;
            card.setAttribute('data-fare', fare);
            card.onclick = () => selectVehicleCard(card, v.name, fare);

            card.innerHTML = `
                <span class="v-icon">${v.icon}</span>
                <div class="v-details">
                    <span class="v-name">${v.name}</span>
                    <span class="v-eta">${v.desc}</span>
                </div>
                <div class="v-price">₹${fare}</div>
            `;
            container.appendChild(card);

            if (idx === 0) {
                appState.selectedVehicle = v.name;
                appState.selectedFare = fare;
            }
        });
    } else {
        // Normal ride-hailing options
        const rideVehicles = [
            { name: "Safar E-Rickshaw", icon: "🛺", base: 30, rate: 6, desc: "3 mins away | Low Cost E-Rickshaw" },
            { name: "Ganga Auto", icon: "🛺", base: 50, rate: 9, desc: "5 mins away | Fast" },
            { name: "Vidyapati Sedan", icon: "🚗", base: 100, rate: 14, desc: "6 mins away | Comfort sedan" },
            { name: "Sonepur SUV", icon: "🚙", base: 180, rate: 19, desc: "8 mins away | Spacious" }
        ];

        rideVehicles.forEach((v, idx) => {
            const fare = Math.round(v.base + (appState.routeDistance * v.rate));
            const card = document.createElement('div');
            card.className = `vehicle-option-card ${idx === 0 ? 'active' : ''}`;
            card.setAttribute('data-fare', fare);
            card.onclick = () => selectVehicleCard(card, v.name, fare);

            card.innerHTML = `
                <span class="v-icon">${v.icon}</span>
                <div class="v-details">
                    <span class="v-name">${v.name}</span>
                    <span class="v-eta">${v.desc}</span>
                </div>
                <div class="v-price">₹${fare}</div>
            `;
            container.appendChild(card);

            if (idx === 0) {
                appState.selectedVehicle = v.name;
                appState.selectedFare = fare;
            }
        });
    }
    updateFareBreakdown();
}

function updateVehicleFares() {
    const cards = document.querySelectorAll('.vehicle-option-card');
    cards.forEach((card, idx) => {
        let base = 50, rate = 9;
        if (appState.bookingType === 'tempo') {
            const rates = [{ b: 140, r: 12 }, { b: 250, r: 16 }, { b: 450, r: 22 }];
            base = rates[idx]?.b || 140;
            rate = rates[idx]?.r || 12;
        } else {
            const rates = [{ b: 30, r: 6 }, { b: 50, r: 9 }, { b: 100, r: 14 }, { b: 180, r: 19 }];
            base = rates[idx]?.b || 30;
            rate = rates[idx]?.r || 6;
        }
        const fare = Math.round(base + (appState.routeDistance * rate));
        card.setAttribute('data-fare', fare);
        card.querySelector('.v-price').innerText = `₹${fare}`;
        if (card.classList.contains('active')) {
            appState.selectedFare = fare;
        }
    });
    updateFareBreakdown();
}

function selectVehicleCard(element, name, fare) {
    document.querySelectorAll('.vehicle-option-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');
    appState.selectedVehicle = name;
    appState.selectedFare = fare;
    updateFareBreakdown();
}

function openTempoBooking() {
    appState.bookingType = 'tempo';
    goToScreen('ride-booking');
}

function bookPilgrimage(pkgName, price) {
    appState.bookingType = 'pilgrimage';
    appState.selectedVehicle = pkgName;
    appState.selectedFare = price;

    // Set custom pre-defined points in map search fields
    document.getElementById('pickup-autocomplete').value = "Patna Jn, Patna";
    document.getElementById('drop-autocomplete').value = pkgName.split('to ')[1] + " Holy Site";

    appState.pickupCoords = [25.5941, 85.1376];
    if (pkgName.includes('Gaya')) appState.dropCoords = [24.6959, 84.9914];
    else if (pkgName.includes('Deoghar')) appState.dropCoords = [24.4938, 86.6994];
    else appState.dropCoords = [25.9863, 85.1256]; // Vaishali

    showToast('Package Booked', `Selected pilgrimage: ${pkgName}. Ready to request.`, false);
    goToScreen('ride-booking');
}

/* ==========================================================================
   LIVE TRACKING WITH GOOGLE/LEAFLET POLYLINE MOVEMENT
   ========================================================================== */
function initLeafletLiveTrackingMap() {
    if (typeof L === 'undefined') return;

    if (appState.leafletLiveMap) {
        appState.leafletLiveMap.remove();
        appState.leafletLiveMap = null;
    }

    appState.leafletLiveMap = L.map('live-tracking-leaflet-map', {
        zoomControl: false,
        attributionControl: false
    }).setView(appState.pickupCoords, 13);

    const tileUrl = getTileLayerUrl(appState.activeMapStyle, appState.isDarkMode);
    L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: getTileLayerAttribution(appState.activeMapStyle)
    }).addTo(appState.leafletLiveMap);

    // Render pickup & drop static pins
    const pIcon = L.divIcon({
        html: '<div style="background: #1B5E3F; border: 2px solid white; width: 10px; height: 10px; border-radius: 50%;"></div>',
        iconSize: [10, 10]
    });
    const dIcon = L.divIcon({
        html: '<div style="background: #D93838; border: 2px solid white; width: 10px; height: 10px; border-radius: 50%;"></div>',
        iconSize: [10, 10]
    });

    L.marker(appState.pickupCoords, { icon: pIcon }).addTo(appState.leafletLiveMap);
    L.marker(appState.dropCoords, { icon: dIcon }).addTo(appState.leafletLiveMap);

    // Draw route path line
    const pathLine = L.polyline([appState.pickupCoords, appState.dropCoords], {
        color: '#1B5E3F',
        weight: 5
    }).addTo(appState.leafletLiveMap);

    // Car icon moving along path
    const isCar = appState.selectedVehicle.includes('Sedan') || appState.selectedVehicle.includes('SUV') || appState.selectedVehicle.includes('Tempo') || appState.selectedVehicle.includes('Pickup');
    const vehicleEmoji = isCar ? '🚗' : (appState.selectedVehicle.includes('Bike') ? '🏍️' : '🛺');

    const carIcon = L.divIcon({
        className: 'moving-leaflet-car',
        html: `<div style="font-size: 20px; background: white; padding: 4px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.25); text-align: center; border: 1.5px solid var(--gold-accent); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">${vehicleEmoji}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    appState.liveTrackingMarker = L.marker(appState.pickupCoords, { icon: carIcon }).addTo(appState.leafletLiveMap);

    // Animate marker along line smoothly
    let currentStep = 0;
    const totalSteps = 200;

    // Zoom map to path
    appState.leafletLiveMap.fitBounds(pathLine.getBounds().pad(0.2));

    appState.liveTrackingInterval = setInterval(() => {
        // Skip interpolation if low data mode is active (snaps directly)
        if (appState.lowDataMode) {
            currentStep += 10;
        } else {
            currentStep++;
        }

        const ratio = currentStep / totalSteps;

        if (ratio <= 1.0) {
            // Interpolate coordinates
            const lat = appState.pickupCoords[0] + (appState.dropCoords[0] - appState.pickupCoords[0]) * ratio;
            const lng = appState.pickupCoords[1] + (appState.dropCoords[1] - appState.pickupCoords[1]) * ratio;

            if (appState.liveTrackingMarker) {
                appState.liveTrackingMarker.setLatLng([lat, lng]);
                // optional: center map on moving car
                appState.leafletLiveMap.setView([lat, lng], appState.leafletLiveMap.getZoom());
            }

            const minsLeft = Math.max(1, Math.round(appState.routeDuration * (1 - ratio)));
            updateTrackingETA(minsLeft);
        } else {
            clearInterval(appState.liveTrackingInterval);
            finishSimulatedRide();
        }
    }, 120);
}

/* ==========================================================================
   SAFETY SOS, LINK SHARE, & PHONE/CHAT SIMULATORS
   ========================================================================== */
function shareLiveTripLink() {
    showToast('Link Shared', 'Live tracking link shared with emergency contact +91 99887 76655.', false);
}

function triggerEmergencySOS() {
    const overlay = document.getElementById('sos-overlay');
    overlay.classList.remove('hidden');

    let timeRemaining = 15;
    const countEl = document.getElementById('sos-countdown');
    countEl.innerText = `${timeRemaining}s`;

    appState.sosCountdownInterval = setInterval(() => {
        timeRemaining--;
        countEl.innerText = `${timeRemaining}s`;
        if (timeRemaining <= 0) {
            clearInterval(appState.sosCountdownInterval);
            alert("EMERGENCY: Dispatching GPS coordinates directly to Patna Police Control dispatch unit.");
            cancelEmergencySOS();
        }
    }, 1000);
}

function cancelEmergencySOS() {
    const overlay = document.getElementById('sos-overlay');
    overlay.classList.add('hidden');
    if (appState.sosCountdownInterval) {
        clearInterval(appState.sosCountdownInterval);
        appState.sosCountdownInterval = null;
    }
    showToast('SOS Aborted', 'Emergency alert cancelled.');
}

function startDriverMatching() {
    resolveLocationInput('pickup');
    resolveLocationInput('drop');
    goToScreen('driver-matching');
}

function cancelRideBooking() {
    showToast('Ride Cancelled', 'Request cancelled.');
    goToScreen('home');
}

function simulateDriverMatchSuccess() {
    showToast('Driver Found', 'Ramesh Singh has accepted your request.');
    triggerHaptic('confirmed');
    goToScreen('live-tracking');
}

function updateTrackingETA(eta) {
    const etaVal = document.getElementById('tracking-eta-val');
    if (etaVal) {
        const trans = {
            en: `ETA: ${eta} mins`,
            hi: `समय: ${eta} मिनट`,
            mai: `समय: ${eta} मि.`,
            bho: `समय: ${eta} मिनट`
        };
        etaVal.innerText = trans[appState.language] || trans['en'];
    }
}

function finishSimulatedRide() {
    showToast('Destination Reached', 'Arrived safely.');
    triggerHaptic('success');

    const finalFare = appState.selectedFare;
    const tollFare = 40;
    const discount = 0;
    const grandTotal = finalFare + tollFare;

    document.getElementById('rec-base-fare').innerText = `₹${finalFare.toFixed(2)}`;
    document.getElementById('rec-toll-fare').innerText = `₹${tollFare.toFixed(2)}`;
    document.getElementById('rec-grand-total').innerText = `₹${grandTotal.toFixed(2)}`;

    // Set labels on receipt screen
    document.getElementById('receipt-pickup-txt').innerText = appState.pickupLocation;
    document.getElementById('receipt-drop-txt').innerText = appState.dropLocation;

    appState.bookingHistory.unshift({
        id: Date.now(),
        type: appState.selectedVehicle,
        route: `${appState.pickupLocation.substring(0, 15)}.. to ${appState.dropLocation.substring(0, 15)}..`,
        price: grandTotal,
        date: '16 Jun',
        status: 'Completed'
    });

    goToScreen('receipt');
}

/* Screen 6 Wedding Booking Functions moved to bottom of file to avoid duplication */

/* ==========================================================================
   SCREEN 6b: MARIGOLD PETAL SHOWER ANIMATION
   ========================================================================== */
function startMarigoldPetalsShower() {
    const canvas = document.getElementById('marigold-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const petals = [];
    const religion = appState.userProfile.religion || 'Hindu';

    // Disable shower completely in low-data mode
    if (appState.lowDataMode) return;

    let colors = [];
    if (religion === 'Hindu') {
        colors = ['#FF6600', '#FFB300', '#CC2200', '#D4AF37'];
    } else if (religion === 'Muslim') {
        colors = ['#C9A84C', '#1A6B3C', '#FFFFFF', '#D4AF37'];
    } else if (religion === 'Sikh') {
        colors = ['#F5A623', '#1B2A5E', '#E07B00', '#FFD700'];
    } else if (religion === 'Christian') {
        colors = ['#1A3C8F', '#3A62C4', '#FFFFFF', '#C9A84C'];
    } else if (religion === 'Buddhist') {
        colors = ['#7B2D2D', '#E8820C', '#D4AF37', '#FFF8DC'];
    } else if (religion === 'Jain') {
        colors = ['#6B1A1A', '#C9A84C', '#FFFFFF', '#FDFAF4'];
    }

    const count = (religion === 'Jain') ? 120 : (religion === 'Buddhist' ? 30 : 60);

    for (let i = 0; i < count; i++) {
        const p = {
            x: Math.random() * canvas.width,
            y: (religion === 'Buddhist') ? Math.random() * canvas.height : Math.random() * -canvas.height,
            r: Math.random() * 5 + 3,
            d: Math.random() * 1.2 + 0.8,
            color: colors[Math.floor(Math.random() * colors.length)],
            sway: Math.random() * 2 * Math.PI,
            swaySpeed: Math.random() * 0.02 + 0.01,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 1.5 - 0.7
        };

        if (religion === 'Buddhist') {
            p.currentRadius = Math.random() * 30 + 5;
            p.maxRadius = Math.random() * 40 + 20;
            p.opacity = 1;
        }

        petals.push(p);
    }

    function renderShower() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        petals.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);

            if (religion === 'Hindu') {
                // Marigold Ellipse
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, p.r, p.r * 1.7, 0, 0, 2 * Math.PI);
                ctx.fill();

                p.y += p.d;
                p.x += Math.sin(p.sway) * 0.5;
                p.sway += p.swaySpeed;
                p.rotation += p.rotationSpeed;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            } 
            else if (religion === 'Muslim') {
                // Star bursts (4-pointed star)
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.moveTo(0, -p.r * 1.8);
                ctx.quadraticCurveTo(0, 0, p.r * 1.8, 0);
                ctx.quadraticCurveTo(0, 0, 0, p.r * 1.8);
                ctx.quadraticCurveTo(0, 0, -p.r * 1.8, 0);
                ctx.quadraticCurveTo(0, 0, 0, -p.r * 1.8);
                ctx.fill();

                p.y += p.d * 1.1;
                p.x += Math.sin(p.sway) * 0.7;
                p.sway += p.swaySpeed;
                p.rotation += p.rotationSpeed * 1.2;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            } 
            else if (religion === 'Sikh') {
                // Gold waves/lines
                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.r * 0.4;
                ctx.beginPath();
                ctx.moveTo(-p.r * 0.5, -p.r * 1.5);
                ctx.bezierCurveTo(-p.r * 0.2, 0, p.r * 0.2, 0, p.r * 0.5, p.r * 1.5);
                ctx.stroke();

                p.y += p.d * 1.2;
                p.x += Math.sin(p.sway) * 0.4;
                p.sway += p.swaySpeed;
                p.rotation += p.rotationSpeed * 0.5;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            } 
            else if (religion === 'Christian') {
                // Confetti squares
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.r, -p.r * 1.5, p.r * 2, p.r * 3);

                p.y += p.d * 1.3;
                p.x += Math.sin(p.sway) * 0.8;
                p.sway += p.swaySpeed;
                p.rotation += p.rotationSpeed * 1.5;

                if (p.y > canvas.height) {
                    p.y = -20;
                    p.x = Math.random() * canvas.width;
                }
            } 
            else if (religion === 'Buddhist') {
                // Water ripples expanding outwards
                ctx.restore(); // restore immediately because we want full-canvas coordinates
                ctx.save();
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.currentRadius, 0, 2 * Math.PI);
                ctx.stroke();

                p.currentRadius += p.d * 0.6;
                p.opacity = Math.max(0, 1 - (p.currentRadius / p.maxRadius));

                if (p.currentRadius >= p.maxRadius) {
                    p.currentRadius = 2;
                    p.maxRadius = Math.random() * 40 + 20;
                    p.x = Math.random() * canvas.width;
                    p.y = Math.random() * canvas.height;
                    p.opacity = 1;
                }
            } 
            else if (religion === 'Jain') {
                // Golden stardust (tiny glowing dots drifting slowly)
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 5;
                ctx.beginPath();
                ctx.arc(0, 0, p.r * 0.35, 0, 2 * Math.PI);
                ctx.fill();

                p.y += p.d * 0.6; // slow fall
                p.x += Math.sin(p.sway) * 0.3;
                p.sway += p.swaySpeed;

                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
            }

            ctx.restore();
        });

        appState.marigoldAnimationId = requestAnimationFrame(renderShower);
    }

    appState.marigoldAnimationId = requestAnimationFrame(renderShower);
}

function triggerMarigoldShower() {
    goToScreen('wedding-success');
}

/* ==========================================================================
   SCREEN 8: RATINGS REVIEWS & STAR CONTROL
   ========================================================================== */
function setStarRating(rating) {
    document.querySelectorAll('.rating-stars-row .star').forEach((star, idx) => {
        if (idx < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });

    const emojiEl = document.getElementById('rating-emoji');
    const textEl = document.getElementById('rating-feedback-text');

    const reactions = {
        1: { emoji: '😠', en: 'Disappointing journey', hi: 'निराशाजनक यात्रा', mai: 'अधलाह यात्रा', bho: 'बेकार सवारी' },
        2: { emoji: '😕', en: 'Needs improvement', hi: 'सुधार की आवश्यकता', mai: 'सुधार चाही', bho: 'सुधार करे के बा' },
        3: { emoji: '😐', en: 'Average service', hi: 'सामान्य सेवा', mai: 'सामान्य', bho: 'ठीक ठाक' },
        4: { emoji: '🙂', en: 'Good ride', hi: 'अच्छी सवारी', mai: 'बढ़िया', bho: 'नीक लागल' },
        5: { emoji: '👳🏽‍♂️✨', en: 'Jai Bihar! Fantastic experience!', hi: 'जय बिहार! अति उत्तम अनुभव!', mai: 'अति सुंदर! जय मिथिला!', bho: 'गर्दा उड़ा देहलऽ! जय बिहार!' }
    };

    const reaction = reactions[rating];
    emojiEl.innerText = reaction.emoji;

    textEl.setAttribute('data-en', reaction.en);
    textEl.setAttribute('data-hi', reaction.hi);
    textEl.setAttribute('data-mai', reaction.mai);
    textEl.setAttribute('data-bho', reaction.bho);
    setLanguage(appState.language);
}

function toggleReviewTag(element) {
    element.classList.toggle('active');
}

function submitReview() {
    showToast('Review Submitted', 'Pranam for rating SafarSetu!', false);
    goToScreen('home');
}

/* ==========================================================================
   LOYALTY PROGRAM, REFERRALS, & PASS PURCHASING (NEW!)
   ========================================================================== */
function shareReferralCode() {
    appState.setuCoins += 50;
    document.getElementById('setu-coins-val').innerText = appState.setuCoins;
    showToast('Coins Earned!', 'Referral shared! +50 Setu Coins added to account.', false);
}

function purchaseCommuterPass() {
    appState.walletBalance -= 199;
    document.getElementById('wallet-balance-display').innerText = `₹${appState.walletBalance.toFixed(2)}`;

    const widget = document.getElementById('commuter-pass-widget');
    widget.style.opacity = '1';

    showToast('Pass Purchased', 'Patna - Hajipur commuting pass successfully activated!', false);
    goToScreen('profile');
}

function populateBookingHistory() {
    const container = document.getElementById('recent-bookings-container');
    if (!container) return;

    container.innerHTML = '';

    if (appState.isEmptyHistory || appState.bookingHistory.length === 0) {
        container.innerHTML = getEmptyStateHTML('bookings');
        return;
    }

    appState.bookingHistory.forEach(item => {
        const row = document.createElement('div');
        row.className = 'booking-history-item';
        row.innerHTML = `
            <div>
                <strong>${item.type} - <span style="color: ${item.status === 'Completed' ? 'var(--secondary-green)' : '#e65100'}">${item.status}</span></strong>
                <p>${item.route} | ₹${item.price}</p>
            </div>
            <span>${item.date}</span>
        `;
        container.appendChild(row);
    });
}

function getEmptyStateHTML(type) {
    const icon = type === 'bookings' ? '📅' : (type === 'notifications' ? '📭' : '🔍');
    const title = {
        en: type === 'bookings' ? "No rides booked yet" : (type === 'notifications' ? "Inbox is clean" : "Nothing found"),
        hi: type === 'bookings' ? "कोई बुकिंग नहीं है" : (type === 'notifications' ? "कोई सूचना नहीं है" : "कुछ नहीं मिला"),
        mai: type === 'bookings' ? "कोनो बुकिंग नै अछि" : (type === 'notifications' ? "कोनो सूचना नै अछि" : "किछु नै भेटल"),
        bho: type === 'bookings' ? "एगो बुकिंग नईखे" : (type === 'notifications' ? "कोनो सूचना नईखे" : "कुछु ना मिलल")
    };
    const desc = {
        en: type === 'bookings' ? "Your scheduled and past trips will appear here." : "We'll let you know when there's an offer or update.",
        hi: type === 'bookings' ? "आपकी आगामी और पिछली यात्राएं यहाँ दिखाई देंगी।" : "ऑफ़र या कोई अपडेट होने पर हम आपको सूचित करेंगे।",
        mai: type === 'bookings' ? "अहाँक यात्रा सभ एतय देखायत।" : "ऑफ़र वा अपडेट एतय देखायत।",
        bho: type === 'bookings' ? "रउआ यात्रा के जानकारी इहाँ देखाई।" : "ऑफ़र चाहे अपडेट इहाँ देखाई।"
    };

    return `
        <div class="empty-state-card">
            <span class="empty-icon">${icon}</span>
            <strong class="text-bilingual" data-en="${title.en}" data-hi="${title.hi}" data-mai="${title.mai}" data-bho="${title.bho}">${title[appState.language] || title.en}</strong>
            <p class="text-bilingual" data-en="${desc.en}" data-hi="${desc.hi}" data-mai="${desc.mai}" data-bho="${desc.bho}">${desc[appState.language] || desc.en}</p>
        </div>
    `;
}

function populateScheduledRides() {
    const container = document.getElementById('upcoming-bookings-container');
    if (!container) return;

    container.innerHTML = '';

    if (appState.isEmptyHistory || appState.scheduledTrips.length === 0) {
        container.innerHTML = getEmptyStateHTML('bookings');
        return;
    }

    appState.scheduledTrips.forEach(item => {
        const card = document.createElement('div');
        card.className = 'upcoming-card';
        card.innerHTML = `
            <div class="upcoming-details">
                <strong>${item.vehicle} (${item.type === 'ride' ? 'Ride' : 'Tempo'})</strong>
                <p>Route: ${item.pickup.substring(0, 14)}.. ➔ ${item.drop.substring(0, 14)}..</p>
                <p style="color:var(--gold-accent); font-weight:600;">📅 ${item.date} | ⏰ ${item.time}</p>
                <p>Est. Fare: ₹${item.fare}</p>
            </div>
            <button class="upcoming-cancel-btn" onclick="cancelScheduledRide(${item.id})">×</button>
        `;
        container.appendChild(card);
    });
}

function cancelScheduledRide(id) {
    appState.scheduledTrips = appState.scheduledTrips.filter(t => t.id !== id);
    populateScheduledRides();
    showToast('Cancelled', 'Scheduled ride successfully cancelled.', false);
}

function toggleSchedulePicker() {
    const picker = document.getElementById('schedule-picker-box');
    if (picker) {
        picker.classList.toggle('hidden');
    }
}

function confirmScheduleRide() {
    const dateVal = document.getElementById('schedule-date').value;
    const timeVal = document.getElementById('schedule-time').value;

    if (!dateVal || !timeVal) {
        showToast('Schedule Error', 'Please select both a valid date and time.', true);
        return;
    }

    // Create new scheduled ride
    const newRide = {
        id: Date.now(),
        type: appState.bookingType,
        vehicle: appState.selectedVehicle,
        pickup: appState.pickupLocation,
        drop: appState.dropLocation,
        date: dateVal,
        time: timeVal,
        fare: appState.selectedFare
    };

    appState.scheduledTrips.push(newRide);

    // Show confirmation
    showToast('Ride Scheduled', `Your ride is scheduled for ${dateVal} at ${timeVal}!`, false);

    // Reset picker inputs
    document.getElementById('schedule-date').value = '';
    document.getElementById('schedule-time').value = '';

    // Close picker
    const picker = document.getElementById('schedule-picker-box');
    if (picker) picker.classList.add('hidden');

    // Update profile upcoming lists if open
    populateScheduledRides();
}

function toggleTripProtection() {
    const check = document.getElementById('trip-protection-check');
    appState.tripProtectionActive = check ? check.checked : false;

    // Recompute breakdown and total fare
    updateFareBreakdown();

    if (appState.tripProtectionActive) {
        showToast('Insurance Added', 'Bihar Road Safety cover (₹5) has been added to your fare.');
    } else {
        showToast('Insurance Removed', 'Bihar Road Safety cover removed.');
    }
}

function updateFareBreakdown() {
    const breakdownEl = document.getElementById('fare-breakdown-list');
    if (!breakdownEl) return;

    // Estimate components out of standard selected fare
    const baseVal = Math.round(appState.selectedFare * 0.4);
    const distVal = Math.round(appState.selectedFare * 0.5);
    const timeVal = Math.round(appState.selectedFare * 0.1);

    // Surge warning toggle
    const surgeWarning = document.getElementById('surge-warning');
    let surgeMult = 1.0;
    if (appState.routeDistance > 5 && appState.bookingType === 'ride') {
        if (surgeWarning) surgeWarning.classList.remove('hidden');
        surgeMult = 1.2;
    } else {
        if (surgeWarning) surgeWarning.classList.add('hidden');
    }

    const preSurge = baseVal + distVal + timeVal;
    const surgeAmount = Math.round(preSurge * (surgeMult - 1));
    const protectionAmount = appState.tripProtectionActive ? 5 : 0;
    const gstAmount = Math.round((preSurge + surgeAmount) * 0.05);
    const grandTotal = preSurge + surgeAmount + protectionAmount + gstAmount;

    breakdownEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Base Fare (मूल किराया):</span>
            <strong>₹${baseVal}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Distance Charge (दूरी शुल्क):</span>
            <strong>₹${distVal}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Time Charge (समय शुल्क):</span>
            <strong>₹${timeVal}</strong>
        </div>
        ${surgeMult > 1.0 ? `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:var(--red-alert);">
            <span>⚡ High Demand Surge (1.2x):</span>
            <strong>+₹${surgeAmount}</strong>
        </div>
        ` : ''}
        ${appState.tripProtectionActive ? `
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:var(--secondary-green);">
            <span>🛡️ Safety Insurance cover:</span>
            <strong>+₹5</strong>
        </div>
        ` : ''}
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>GST (5%):</span>
            <strong>₹${gstAmount}</strong>
        </div>
        <hr style="border:0; border-top:1px dashed var(--border-card); margin:6px 0;">
        <div style="display:flex; justify-content:space-between; font-weight:700; color: var(--primary-green);">
            <span>Estimated Total:</span>
            <span>₹${grandTotal}</span>
        </div>
    `;
}

function toggleThemeMode() {
    appState.isDarkMode = !appState.isDarkMode;
    const phoneShell = document.getElementById('phone-container-shell');
    if (appState.isDarkMode) {
        phoneShell.classList.add('dark-theme');
        showToast('Dark Mode', 'Night-time mode activated for comfortable riding.', false);
    } else {
        phoneShell.classList.remove('dark-theme');
        showToast('Light Mode', 'Standard high contrast daylight theme activated.', false);
    }

    // Update Leaflet Map tiles dynamically if active
    const newTileUrl = getTileLayerUrl(appState.activeMapStyle, appState.isDarkMode);

    if (appState.leafletMap) {
        appState.leafletMap.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                layer.setUrl(newTileUrl);
            }
        });
    }
    if (appState.leafletLiveMap) {
        appState.leafletLiveMap.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                layer.setUrl(newTileUrl);
            }
        });
    }

    // Update Google Maps theme dynamically if active
    if (appState.googleMap && typeof google !== 'undefined') {
        const darkStyles = [
            { elementType: "geometry", stylers: [{ color: "#1a231f" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a231f" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#d4af37" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1612" }] }
        ];
        appState.googleMap.setOptions({
            styles: appState.isDarkMode ? darkStyles : []
        });
    }
}

function toggleOfflineMode() {
    appState.isOffline = !appState.isOffline;
    const banner = document.getElementById('offline-banner');
    const btn = document.getElementById('btn-sim-offline');

    if (appState.isOffline) {
        if (banner) banner.classList.remove('hidden');
        if (btn) btn.style.background = 'rgba(217, 56, 56, 0.4)';
        showToast('Offline Mode Active', 'Device offline. Serving cached map and passenger records.', true);
    } else {
        if (banner) banner.classList.add('hidden');
        if (btn) btn.style.background = 'rgba(217, 56, 56, 0.1)';
        showToast('Online Mode', 'GPS and network synchronization restored.', false);
    }
}

function toggleSimulateError() {
    appState.simulateError = !appState.simulateError;
    const btn = document.getElementById('btn-sim-error');

    if (appState.simulateError) {
        if (btn) btn.style.background = 'rgba(217, 56, 56, 0.4)';
        showToast('Error Mocking Active', 'Simulating location search & GPS routing failures.', true);
    } else {
        if (btn) btn.style.background = 'rgba(217, 56, 56, 0.1)';
        showToast('Error Mocking Disabled', 'Normal location resolution active.', false);
    }
}

function toggleEmptyStates() {
    appState.isEmptyHistory = !appState.isEmptyHistory;
    const btn = document.getElementById('btn-sim-empty');

    if (appState.isEmptyHistory) {
        if (btn) btn.style.background = 'rgba(212, 175, 55, 0.4)';
        showToast('Empty States Active', 'Simulating empty passenger profiles, inbox, and history cards.', false);
    } else {
        if (btn) btn.style.background = 'rgba(212, 175, 55, 0.1)';
        showToast('Empty States Disabled', 'Rendering default active sample cards.', false);
    }

    // Refresh screen lists if currently active
    if (appState.currentScreen === 'profile') {
        populateBookingHistory();
        populateScheduledRides();
    } else if (appState.currentScreen === 'notifications') {
        populateNotifications();
    } else if (appState.currentScreen === 'ride-booking') {
        populateVehicleOptionList();
    }
}

function toggleWomensSafetyMode(isEnabled) {
    appState.womensSafetyMode = isEnabled;
    const toggleInput = document.getElementById('womens-safety-toggle');
    if (toggleInput) toggleInput.checked = isEnabled;

    if (isEnabled) {
        showToast('Safety Shield Enabled', '🛡️ Female driver preference and Patna Police SOS dispatcher linked.', false);
    } else {
        showToast('Safety Shield Disabled', 'Standard settings applied.', false);
    }
}

function openSplitFareModal() {
    const overlay = document.getElementById('split-fare-overlay');
    const input = document.getElementById('split-fare-link-input');

    if (overlay && input) {
        const tripId = Math.floor(Math.random() * 9000) + 1000;
        input.value = `http://safarsetu.in/split/trip-${tripId}`;
        overlay.classList.remove('hidden');
    }
}

function copySplitFareLink() {
    const input = document.getElementById('split-fare-link-input');
    if (input) {
        input.select();
        input.setSelectionRange(0, 99999); // For mobile devices

        try {
            navigator.clipboard.writeText(input.value);
            showToast('Copied!', 'Split fare link copied to clipboard.', false);
        } catch (err) {
            showToast('Copied!', 'Link copied successfully.', false);
        }
    }
}

function closeSplitFareModal() {
    const overlay = document.getElementById('split-fare-overlay');
    if (overlay) overlay.classList.add('hidden');
}

let voiceSimTimeout1 = null;
let voiceSimTimeout2 = null;

function startVoiceSearch(field) {
    appState.activeVoiceField = field;
    const overlay = document.getElementById('voice-search-overlay');
    const transcript = document.getElementById('voice-search-text');

    if (overlay && transcript) {
        overlay.classList.remove('hidden');
        transcript.innerText = '"..."';

        const phrase = field === 'pickup' ? 'Patna Airport Chowk' : 'Golghar Maurya Hall';

        // Clear any old voice simulations
        if (voiceSimTimeout1) clearTimeout(voiceSimTimeout1);
        if (voiceSimTimeout2) clearTimeout(voiceSimTimeout2);

        voiceSimTimeout1 = setTimeout(() => {
            transcript.innerText = `"${phrase.substring(0, 8)}..."`;
        }, 800);

        voiceSimTimeout2 = setTimeout(() => {
            transcript.innerText = `"${phrase}"`;

            setTimeout(() => {
                closeVoiceSearch();
                setSimulatedLocation(field, phrase + ", Bihar", field === 'pickup' ? [25.5913, 85.0880] : [25.6110, 85.1480]);
                showToast('Voice matched', `Successfully resolved: ${phrase}`);
            }, 800);

        }, 1800);
    }
}

function closeVoiceSearch() {
    const overlay = document.getElementById('voice-search-overlay');
    if (overlay) overlay.classList.add('hidden');
    if (voiceSimTimeout1) clearTimeout(voiceSimTimeout1);
    if (voiceSimTimeout2) clearTimeout(voiceSimTimeout2);
}

function sendQuickReply(text) {
    appendChatMessage(text, 'sent');

    setTimeout(() => {
        const responses = [
            "Pranam bhaiya, litti stall ke paas hi khade hain Patna Junction gate 1 pe.",
            "Haan babu, Bailey road se mud rahe hain, bas 2 minute.",
            "Reaching in a minute. Vehicle is clean. AC is turned on."
        ];
        const resText = responses[Math.floor(Math.random() * responses.length)];
        appendChatMessage(resText, 'received');
    }, 1200);
}

function openSystemErrorOverlay(title, desc) {
    triggerHaptic('error');
    const overlay = document.getElementById('system-error-overlay');
    const titleEl = document.getElementById('error-overlay-title');
    const descEl = document.getElementById('error-overlay-desc');

    if (overlay && titleEl && descEl) {
        titleEl.innerText = title;
        descEl.innerText = desc;
        overlay.classList.remove('hidden');
    }
}

function closeSystemErrorOverlay() {
    const overlay = document.getElementById('system-error-overlay');
    if (overlay) overlay.classList.add('hidden');
}

function populateNotifications() {
    const container = document.querySelector('.notifications-list-container');
    if (!container) return;

    container.innerHTML = '';

    if (appState.isEmptyHistory) {
        container.innerHTML = getEmptyStateHTML('notifications');
        return;
    }

    container.innerHTML = `
        <div class="notification-item unread">
            <div class="notif-header-row">
                <span class="notif-tag gold">FESTIVAL OFFER</span>
                <span class="notif-time">Just Now</span>
            </div>
            <h4 class="text-bilingual" data-en="Chhath Puja Ghat Express!" data-hi="छठ पूजा घाट स्पेशल एक्सप्रेस!" data-mai="छठ घाट एक्सप्रेस" data-bho="छठ पूजा घाट स्पेशल!">Chhath Puja Ghat Express!</h4>
            <p class="text-bilingual" data-en="Free dedicated E-Rickshaw shuttle rides to Ganga river ghats for families." data-hi="श्रद्धालुओं के परिवारों के लिए गंगा घाटों तक निःशुल्क ई-रिक्शा शटल यात्रा सेवा।" data-mai="गंगा घाट फ्री ई-रिक्शा" data-bho="गंगा घाट खातिर फ्री ई-रिक्शा शटल सेवा।">Free dedicated E-Rickshaw shuttle rides to Ganga river ghats for families.</p>
        </div>

        <div class="notification-item">
            <div class="notif-header-row">
                <span class="notif-tag green">REWARDS</span>
                <span class="notif-time">2 hrs ago</span>
            </div>
            <h4 class="text-bilingual" data-en="Referral success!" data-hi="सफलतापूर्वक रेफ़र किया गया!" data-mai="रेफरल" data-bho="रेफरल सफल!">Referral success!</h4>
            <p class="text-bilingual" data-en="Your cousin registered using SETU50. 50 Setu Coins added to wallet." data-hi="आपके परिवार के सदस्य ने SETU50 कोड से रजिस्टर किया। आपके बटुए में 50 कॉइन्स जोड़े गए।" data-mai="५० कॉइन्स जोड़ल गेल" data-bho="रउआ कोड से रजिस्ट्रेशन भइल। 50 सेतु कॉइन्स जोड़ा गइल।">Your cousin registered using SETU50. 50 Setu Coins added to wallet.</p>
        </div>
    `;

    // Retranslate newly added notifications if necessary
    setLanguage(appState.language);
}

/* ==========================================================================
   SETTINGS CONFIGURATIONS (LOW DATA & PRIMARY PAYMENTS)
   ========================================================================== */
function toggleLowDataMode(isEnabled) {
    appState.lowDataMode = isEnabled;
    const phoneShell = document.getElementById('phone-container-shell');
    if (isEnabled) {
        phoneShell.classList.add('low-data');
        showToast('Low-Data Active', 'Map textures simplified and graphics loop frozen.', false);
    } else {
        phoneShell.classList.remove('low-data');
        showToast('Low-Data Disabled', 'Standard high-fidelity mode activated.', false);
    }
}

function selectPrimaryPayMode(mode) {
    appState.activePayMode = mode;
    syncPrimaryPayModeUI();

    // Update bottom ride selection drawer details
    const payIcon = document.getElementById('active-pay-icon');
    const payTitle = document.getElementById('active-pay-title');

    if (mode === 'cash') {
        payIcon.innerText = '💵';
        payTitle.setAttribute('data-en', 'Cash on Arrival');
        payTitle.setAttribute('data-hi', 'नकद भुगतान');
        payTitle.setAttribute('data-mai', 'नकद भुगतान');
        payTitle.setAttribute('data-bho', 'नकद भुगतान');
    } else {
        payIcon.innerText = '💳';
        payTitle.setAttribute('data-en', 'Safar Wallet');
        payTitle.setAttribute('data-hi', 'सफ़र वॉलेट');
        payTitle.setAttribute('data-mai', 'बटुआ');
        payTitle.setAttribute('data-bho', 'वॉलेट');
    }
    setLanguage(appState.language);
}

function syncPrimaryPayModeUI() {
    const cActive = document.getElementById('badge-cash-active');
    const wActive = document.getElementById('badge-wallet-active');
    const cOption = document.getElementById('pay-mode-cash');
    const wOption = document.getElementById('pay-mode-wallet');

    if (!cActive || !wActive) return;

    if (appState.activePayMode === 'cash') {
        cActive.classList.remove('hidden');
        wActive.classList.add('hidden');
        cOption.classList.add('active');
        wOption.classList.remove('active');
    } else {
        cActive.classList.add('hidden');
        wActive.classList.remove('hidden');
        cOption.classList.remove('active');
        wOption.classList.add('active');
    }
}

function addMoneySimulator() {
    const amount = prompt("Enter amount to load via UPI (राशि दर्ज करें):", "500");
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0) {
        appState.walletBalance += num;
        document.getElementById('wallet-balance-display').innerText = `₹${appState.walletBalance.toFixed(2)}`;
        showToast('Money Loaded', `Successfully loaded ₹${num} into wallet via GPay.`);
    }
}

/* ==========================================================================
   FESTIVAL MODE SWITCHER SIMULATION
   ========================================================================== */
function setFestivalMode(mode) {
    appState.activeFestival = mode;

    const banner = document.getElementById('festive-banner');
    const badge = document.getElementById('festive-badge');
    const title = document.getElementById('festive-title');
    const desc = document.getElementById('festive-desc');
    const graphic = document.getElementById('festive-graphic');

    if (!banner) return;

    // Reset themes
    banner.classList.remove('chhath-theme', 'durga-theme', 'shaadi-theme');

    if (mode === 'chhath') {
        banner.classList.add('chhath-theme');
        badge.innerText = 'CHHATH PUJA (छठ पूजा)';
        title.setAttribute('data-en', 'Ghat Express Shuttle Free');
        title.setAttribute('data-hi', 'घाट एक्सप्रेस ई-रिक्शा सेवा निःशुल्क');
        title.setAttribute('data-mai', 'घाट एक्सप्रेस निःशुल्क');
        title.setAttribute('data-bho', 'घाट एक्सप्रेस फ्री सेवा');

        desc.setAttribute('data-en', 'Dedicated shuttles transporting families to Ganga Ghats.');
        desc.setAttribute('data-hi', 'छठ व्रतियों के परिवारों को घाट तक निःशुल्क पहुँचाने की सेवा।');
        desc.setAttribute('data-mai', 'घाट पहुँचाने की सेवा।');
        desc.setAttribute('data-bho', 'छठ पूजा में घाट जाय खातिर फ्री ई-रिक्शा।');

        graphic.innerText = '☀️🌊';
        showToast('Festival Mode', 'Chhath Puja Special Ghat Express activated.', false);
    }
    else if (mode === 'durga') {
        banner.classList.add('durga-theme');
        badge.innerText = 'DURGA PUJA (दुर्गा पूजा)';
        title.setAttribute('data-en', 'Durga Puja Pandal Hopping');
        title.setAttribute('data-hi', 'दुर्गा पूजा पंडाल परिक्रमा पास');
        title.setAttribute('data-mai', 'पूजा पंडाल परिक्रमा');
        title.setAttribute('data-bho', 'पूजा पंडाल घूमे के पास');

        desc.setAttribute('data-en', 'Book dedicated daily fleets to tour Patna pandals.');
        desc.setAttribute('data-hi', 'पटना के प्रमुख पूजा पंडालों के दर्शन के लिए दिनभर की गाड़ियां बुक करें।');
        desc.setAttribute('data-mai', 'पूजा पंडाल घूमु');
        desc.setAttribute('data-bho', 'पटना के मुख्य-मुख्य पंडाल घूमे खातिर गाड़ी बुक करीं।');

        graphic.innerText = '🪔💮';
        showToast('Festival Mode', 'Durga Puja Pandal Hopping Mode activated.', false);
    }
    else if (mode === 'shaadi' || mode === 'none') {
        banner.classList.add('shaadi-theme');
        badge.innerText = 'SHAADI SPECIAL (शुभ मुहूर्त)';
        title.setAttribute('data-en', 'Save 15% on Wedding Convoy');
        title.setAttribute('data-hi', 'शादी गाड़ियों पर 15% बचाएं');
        title.setAttribute('data-mai', 'विवाहक गाड़ी पर १५% छूट');
        title.setAttribute('data-bho', 'शादी गाड़ी पर 15% छूट');

        desc.setAttribute('data-en', 'Book luxury decorated wedding fleets with Mithila decorations.');
        desc.setAttribute('data-hi', 'फूलों की सजावट के साथ बुक करें लक्ज़री गाड़ियां और बारात बसें।');
        desc.setAttribute('data-mai', 'सजल बारात गाड़ी');
        desc.setAttribute('data-bho', 'फूल से सजल गाड़ी आ बारात बस बुक करीं।');

        graphic.innerText = '🎺🌸';
        if (mode === 'shaadi') showToast('Festival Mode', 'Shaadi Muhurat packages active.', false);
    }

    setLanguage(appState.language);
    checkFestivalAutoSuggest();
}

/* ==========================================================================
   DYNAMIC GOOGLE MAPS API LOADER CONFIG
   ========================================================================== */
function initializeGoogleMaps() {
    const key = document.getElementById('gmaps-api-key').value.trim();
    if (!key) {
        showToast('API Key Missing', 'Please enter a valid Google Maps API Key to link.', true);
        return;
    }

    showToast('Linking Google Maps', 'Dynamically importing Google Maps script...', false);

    // Inject script tag
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&callback=onGoogleMapsLoaded`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
        showToast('Link Failed', 'Invalid API key or network block. Defaulting to Leaflet.', true);

        // Remove existing Leaflet map safely first if it exists
        if (appState.leafletMap) {
            try {
                appState.leafletMap.remove();
            } catch (e) {
                console.warn("Leaflet map remove failed:", e);
            }
            appState.leafletMap = null;
            appState.pickupMarker = null;
            appState.dropMarker = null;
            appState.routeLine = null;
        }

        const container = document.getElementById('live-interactive-map');
        if (container) container.innerHTML = '';
        initLeafletInteractiveMap();
    };

    document.head.appendChild(script);
}

window.gm_authFailure = function () {
    showToast('Maps Auth Error', 'Google Maps auth failed. Restoring Leaflet map...', true);

    // Safety check: Clean up Google Maps instance references
    appState.googleMap = null;
    appState.googlePickupMarker = null;
    appState.googleDropMarker = null;
    appState.googleRouteLine = null;

    // Remove existing Leaflet map safely first if it exists
    if (appState.leafletMap) {
        try {
            appState.leafletMap.remove();
        } catch (e) {
            console.warn("Leaflet map remove failed:", e);
        }
        appState.leafletMap = null;
        appState.pickupMarker = null;
        appState.dropMarker = null;
        appState.routeLine = null;
    }

    const container = document.getElementById('live-interactive-map');
    if (container) {
        container.innerHTML = ''; // Clear google maps DOM elements
    }
    // Re-initialize Leaflet Map
    initLeafletInteractiveMap();
};

window.onGoogleMapsLoaded = function () {
    showToast('Maps Connected', 'Google Maps API successfully initialized inside phone shell!', false);

    // Clear Leaflet map if it exists to prevent memory leaks and event fire conflicts
    if (appState.leafletMap) {
        try {
            appState.leafletMap.remove();
        } catch (e) {
            console.warn("Leaflet map remove failed:", e);
        }
        appState.leafletMap = null;
        appState.pickupMarker = null;
        appState.dropMarker = null;
        appState.routeLine = null;
    }

    const container = document.getElementById('live-interactive-map');
    if (!container || typeof google === 'undefined') return;

    container.innerHTML = ''; // Clear google maps DOM elements before Google Map renders

    // Create real Google Map instance
    appState.googleMap = new google.maps.Map(container, {
        center: { lat: appState.pickupCoords[0], lng: appState.pickupCoords[1] },
        zoom: 12,
        disableDefaultUI: true,
        styles: appState.isDarkMode ? [
            { elementType: "geometry", stylers: [{ color: "#1a231f" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#1a231f" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#d4af37" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1612" }] }
        ] : []
    });

    appState.googlePickupMarker = new google.maps.Marker({
        position: { lat: appState.pickupCoords[0], lng: appState.pickupCoords[1] },
        map: appState.googleMap,
        draggable: true,
        title: "Pickup"
    });

    appState.googleDropMarker = new google.maps.Marker({
        position: { lat: appState.dropCoords[0], lng: appState.dropCoords[1] },
        map: appState.googleMap,
        draggable: true,
        title: "Drop"
    });

    appState.googleRouteLine = new google.maps.Polyline({
        path: [
            { lat: appState.pickupCoords[0], lng: appState.pickupCoords[1] },
            { lat: appState.dropCoords[0], lng: appState.dropCoords[1] }
        ],
        geodesic: true,
        strokeColor: "#1B5E3F",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: appState.googleMap
    });

    appState.googlePickupMarker.addListener('drag', () => {
        const pPos = appState.googlePickupMarker.getPosition();
        const dPos = appState.googleDropMarker.getPosition();
        if (appState.googleRouteLine) appState.googleRouteLine.setPath([pPos, dPos]);
    });
    appState.googleDropMarker.addListener('drag', () => {
        const pPos = appState.googlePickupMarker.getPosition();
        const dPos = appState.googleDropMarker.getPosition();
        if (appState.googleRouteLine) appState.googleRouteLine.setPath([pPos, dPos]);
    });

    appState.googlePickupMarker.addListener('dragend', () => {
        recalculateRoute();
        checkGeofenceServiceArea();
    });
    appState.googleDropMarker.addListener('dragend', () => {
        recalculateRoute();
        checkGeofenceServiceArea();
    });

    // Bind Google Places autocomplete to inputs
    const pickupInput = document.getElementById('pickup-autocomplete');
    const dropInput = document.getElementById('drop-autocomplete');

    if (pickupInput) {
        const autocompletePickup = new google.maps.places.Autocomplete(pickupInput);
        autocompletePickup.bindTo('bounds', appState.googleMap);
        autocompletePickup.addListener('place_changed', () => {
            const place = autocompletePickup.getPlace();
            if (place.geometry && place.geometry.location) {
                appState.googleMap.setCenter(place.geometry.location);
                appState.googlePickupMarker.setPosition(place.geometry.location);
                appState.pickupLocation = place.formatted_address || place.name;
                recalculateRoute();
            }
        });
    }

    if (dropInput) {
        const autocompleteDrop = new google.maps.places.Autocomplete(dropInput);
        autocompleteDrop.bindTo('bounds', appState.googleMap);
        autocompleteDrop.addListener('place_changed', () => {
            const place = autocompleteDrop.getPlace();
            if (place.geometry && place.geometry.location) {
                appState.googleDropMarker.setPosition(place.geometry.location);
                appState.dropLocation = place.formatted_address || place.name;
                recalculateRoute();
            }
        });
    }

    // Trigger initial bounds rendering
    recalculateRoute();
};

/* ==========================================================================
   CALL, CHAT SIMULATOR UTILS
   ========================================================================== */
function triggerCallSimulator() {
    document.getElementById('call-simulator-overlay').classList.remove('hidden');
}

function closeCallSimulator() {
    document.getElementById('call-simulator-overlay').classList.add('hidden');
    if (appState.callTimerInterval) {
        clearInterval(appState.callTimerInterval);
        appState.callTimerInterval = null;
    }
}

function acceptSimulatedCall() {
    const statusText = document.querySelector('.call-status');
    statusText.classList.remove('animate-flicker');

    let seconds = 0;
    statusText.innerText = `Connected - 00:00`;

    appState.callTimerInterval = setInterval(() => {
        seconds++;
        let m = Math.floor(seconds / 60);
        let s = seconds % 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        statusText.innerText = `Connected - ${m}:${s}`;
    }, 1000);

    setTimeout(() => {
        closeCallSimulator();
        showToast('Call Completed', 'Call ended.');
    }, 7000);
}

function triggerChatSimulator() {
    document.getElementById('chat-simulator-overlay').classList.remove('hidden');
}

function closeChatSimulator() {
    document.getElementById('chat-simulator-overlay').classList.add('hidden');
}

function sendSimulatedChatMessage() {
    const input = document.getElementById('chat-text-input');
    const msgVal = input.value.trim();
    if (!msgVal) return;

    appendChatMessage(msgVal, 'sent');
    input.value = '';

    setTimeout(() => {
        const responses = [
            { en: "Aapka address mil gaya hai bhaiya. Bailey road se mud rahe hain.", hi: "आपका पता मिल गया है भैया। बेली रोड से मुड़ रहे हैं।" },
            { en: "Arriving in 2 minutes. Vehicle is neat and clean.", hi: "2 मिनट में पहुँच रहे हैं। गाड़ी पूरी तरह साफ़ है।" },
            { en: "Haan babu, litti stall ke paas hi khade hain Patna Junction gate 1 pe.", hi: "हाँ बाबू, लिट्टी दुकान के पास ही खड़े हैं पटना जंक्शन गेट 1 पे।" }
        ];
        const resObj = responses[Math.floor(Math.random() * responses.length)];
        const translatedMsg = appState.language === 'en' ? resObj.en : resObj.hi;
        appendChatMessage(translatedMsg, 'received');
    }, 1500);
}

function appendChatMessage(text, sender) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const msgBox = document.createElement('div');
    msgBox.className = `msg ${sender}`;
    msgBox.innerHTML = `<p>${text}</p>`;
    container.appendChild(msgBox);
    container.scrollTop = container.scrollHeight;
}

/* ==========================================================================
   TURN-BY-TURN NAVIGATION HUD HELPER FUNCTIONS
   ========================================================================== */
function generateFallbackSteps(pickup, drop, distanceKm) {
    const steps = [
        { instruction: `Start trip from ${pickup}`, distance: 0, duration: 0 },
        { instruction: `Continue straight for ${Math.round(distanceKm * 0.4)} km`, distance: distanceKm * 0.4 * 1000, duration: distanceKm * 0.4 * 60 },
        { instruction: `Turn left and merge onto highway`, distance: 100, duration: 10 },
        { instruction: `Drive towards ${drop} for next ${Math.round(distanceKm * 0.5)} km`, distance: distanceKm * 0.5 * 1000, duration: distanceKm * 0.5 * 60 },
        { instruction: `Arrive at destination: ${drop}`, distance: 0, duration: 0 }
    ];
    return steps;
}

function toggleDirectionsPanel() {
    const hud = document.getElementById('navigation-hud');
    if (hud) {
        hud.classList.toggle('hidden');
    }
}

function nextNavigationStep() {
    if (appState.routeSteps && appState.currentRouteStepIndex < appState.routeSteps.length - 1) {
        appState.currentRouteStepIndex++;
        updateNavigationHUD();
    }
}

function prevNavigationStep() {
    if (appState.routeSteps && appState.currentRouteStepIndex > 0) {
        appState.currentRouteStepIndex--;
        updateNavigationHUD();
    }
}

function updateNavigationHUD() {
    const hud = document.getElementById('navigation-hud');
    const instructionEl = document.getElementById('nav-hud-instruction');
    const subEl = document.getElementById('nav-hud-sub');
    const counterEl = document.getElementById('nav-step-counter');
    const iconEl = document.getElementById('nav-hud-icon');

    if (!instructionEl || !counterEl) return;

    if (!appState.routeSteps || appState.routeSteps.length === 0) {
        instructionEl.innerText = "No navigation steps available";
        counterEl.innerText = "0 / 0";
        if (iconEl) iconEl.innerText = "🧭";
        return;
    }

    const index = appState.currentRouteStepIndex;
    const step = appState.routeSteps[index];

    instructionEl.innerText = step.instruction;

    const distText = step.distance > 0 ? `${(step.distance / 1000).toFixed(2)} km` : "";
    const durText = step.duration > 0 ? `${Math.round(step.duration / 60)} mins` : "";
    if (subEl) {
        if (distText && durText) {
            subEl.innerText = `In ${distText} (${durText})`;
        } else if (distText) {
            subEl.innerText = `In ${distText}`;
        } else {
            subEl.innerText = "Route Guidance";
        }
    }

    counterEl.innerText = `${index + 1} / ${appState.routeSteps.length}`;

    if (iconEl) {
        const text = step.instruction.toLowerCase();
        if (text.includes("arrive") || text.includes("destination") || text.includes("reach") || index === appState.routeSteps.length - 1) {
            iconEl.innerText = "🏁";
        } else if (text.includes("left")) {
            iconEl.innerText = "⬅️";
        } else if (text.includes("right")) {
            iconEl.innerText = "➡️";
        } else if (text.includes("straight") || text.includes("continue") || text.includes("keep") || text.includes("merge")) {
            iconEl.innerText = "⬆️";
        } else if (text.includes("head") || text.includes("depart") || text.includes("start")) {
            iconEl.innerText = "🚗";
        } else {
            iconEl.innerText = "🧭";
        }
    }
}

/* ==========================================================================
   MAP TILE STYLE SELECTOR UTILS
   ========================================================================== */
function getTileLayerUrl(styleName, isDarkMode) {
    if (isDarkMode) {
        if (styleName === 'satellite') {
            return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        }
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else {
        const urls = {
            voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            esri: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
            satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        };
        return urls[styleName] || urls.voyager;
    }
}

function getTileLayerAttribution(styleName) {
    const attributions = {
        voyager: '© CartoDB Voyager',
        osm: '© OpenStreetMap contributors',
        esri: '© Esri World Street Map',
        satellite: '© Esri World Imagery'
    };
    return attributions[styleName] || '© CartoDB';
}

function toggleMapStyleSelector() {
    const selector = document.getElementById('map-style-selector');
    if (selector) {
        selector.classList.toggle('hidden');
    }
}

function closeMapStyleSelector() {
    const selector = document.getElementById('map-style-selector');
    if (selector) {
        selector.classList.add('hidden');
    }
}

function changeMapStyle(styleName) {
    appState.activeMapStyle = styleName;

    // Update active class in selector popup options
    document.querySelectorAll('.map-style-option').forEach(opt => {
        if (opt.getAttribute('data-style') === styleName) {
            opt.classList.add('active');
        } else {
            opt.classList.remove('active');
        }
    });

    const newUrl = getTileLayerUrl(styleName, appState.isDarkMode);

    if (appState.leafletMap) {
        appState.leafletMap.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                layer.setUrl(newUrl);
            }
        });
    }
    if (appState.leafletLiveMap) {
        appState.leafletLiveMap.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                layer.setUrl(newUrl);
            }
        });
    }

    showToast('Map Style Updated', `Switched map theme to ${styleName.toUpperCase()}`, false);
    closeMapStyleSelector();
}

/* ==========================================================================
   GLOBAL APP TOAST MESSAGING
   ========================================================================== */
function showToast(title, description, isAlert = false) {
    const toast = document.getElementById('toast-banner');
    if (!toast) return;

    document.getElementById('toast-title').innerText = title;
    document.getElementById('toast-desc').innerText = description;
    toast.style.borderColor = isAlert ? 'var(--red-alert)' : 'var(--gold-accent)';
    toast.querySelector('.toast-icon').innerText = isAlert ? '🚨' : '✨';

    toast.classList.add('active');
    setTimeout(closeToast, 3500);
}

function closeToast() {
    const toast = document.getElementById('toast-banner');
    if (toast) toast.classList.remove('active');
}

/* -------------------------------------------------------------------------- */
/* Wedding Booking Functions */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* Bihar Wedding Transport Marketplace Data & Functions */
/* -------------------------------------------------------------------------- */
const weddingMarketplaceData = {
    baraat: [
        { id: 'b1', name: 'Mahindra Bolero', capacity: '7 Seater', type: 'Non-AC', price: 3500, img: '🚙', driver: true },
        { id: 'b2', name: 'Mahindra Scorpio N', capacity: '7 Seater', type: 'AC', price: 5000, img: '🚙', driver: true },
        { id: 'b3', name: 'Mahindra XUV700', capacity: '7 Seater', type: 'AC', price: 6000, img: '🚘', driver: true },
        { id: 'b4', name: 'Toyota Innova Crysta', capacity: '7 Seater', type: 'AC', price: 6500, img: '🚐', driver: true },
        { id: 'b5', name: 'Toyota Fortuner', capacity: '7 Seater', type: 'AC', price: 10000, img: '🚙', driver: true },
        { id: 'b6', name: 'Maruti Ertiga', capacity: '7 Seater', type: 'AC', price: 3800, img: '🚗', driver: true },
        { id: 'b7', name: 'Maruti Dzire', capacity: '5 Seater', type: 'AC', price: 2500, img: '🚗', driver: true },
        { id: 'b8', name: 'Hyundai Aura', capacity: '5 Seater', type: 'AC', price: 2600, img: '🚗', driver: true },
        { id: 'b9', name: 'Honda City', capacity: '5 Seater', type: 'AC', price: 3500, img: '🚘', driver: true },
        { id: 'b10', name: 'Tempo Traveller (12)', capacity: '12 Seater', type: 'AC', price: 6000, img: '🚌', driver: true },
        { id: 'b11', name: 'Tempo Traveller (17)', capacity: '17 Seater', type: 'AC', price: 7500, img: '🚌', driver: true },
        { id: 'b12', name: 'Tempo Traveller (26)', capacity: '26 Seater', type: 'AC', price: 9500, img: '🚌', driver: true },
        { id: 'b13', name: 'Luxury Bus', capacity: '45 Seater', type: 'AC', price: 25000, img: '🚌', driver: true },
        { id: 'b14', name: 'AC Bus', capacity: '50 Seater', type: 'AC', price: 20000, img: '🚌', driver: true },
        { id: 'b15', name: 'Mini Bus', capacity: '30 Seater', type: 'AC', price: 15000, img: '🚌', driver: true }
    ],
    groom: [
        { id: 'g1', name: 'Mercedes E-Class', category: 'Luxury Sedan', price: 25000, img: '🏎️', premium: true, hourly: '₹3,500/hr' },
        { id: 'g2', name: 'BMW 5 Series', category: 'Luxury Sedan', price: 22000, img: '🏎️', premium: true, hourly: '₹3,000/hr' },
        { id: 'g3', name: 'BMW 7 Series', category: 'Luxury Flagship', price: 45000, img: '🏎️', premium: true, hourly: '₹6,000/hr' },
        { id: 'g4', name: 'Audi A6', category: 'Luxury Sedan', price: 20000, img: '🏎️', premium: true, hourly: '₹2,800/hr' },
        { id: 'g5', name: 'Audi Q7', category: 'Luxury SUV', price: 30000, img: '🚙', premium: true, hourly: '₹4,000/hr' },
        { id: 'g6', name: 'Toyota Fortuner Legender', category: 'Premium SUV', price: 15000, img: '🚙', premium: true, hourly: '₹2,000/hr' },
        { id: 'g7', name: 'Toyota Camry', category: 'Hybrid Luxury', price: 18000, img: '🚘', premium: true, hourly: '₹2,500/hr' },
        { id: 'g8', name: 'Land Rover Defender', category: 'Luxury Off-road', price: 40000, img: '🚙', premium: true, hourly: '₹5,500/hr' },
        { id: 'g9', name: 'Range Rover Vogue', category: 'Super Luxury SUV', price: 75000, img: '🚙', premium: true, hourly: '₹10,000/hr' },
        { id: 'g10', name: 'Lexus ES', category: 'Luxury Hybrid', price: 25000, img: '🚘', premium: true, hourly: '₹3,500/hr' },
        { id: 'g11', name: 'Jaguar XF', category: 'Sport Luxury', price: 24000, img: '🏎️', premium: true, hourly: '₹3,200/hr' },
        { id: 'g12', name: 'Rolls Royce Phantom', category: 'Ultra Luxury Class', price: 150000, img: '⚜️🏎️', premium: true, hourly: '₹20,000/hr' },
        { id: 'g13', name: 'Rolls Royce Ghost', category: 'Ultra Luxury Class', price: 120000, img: '⚜️🏎️', premium: true, hourly: '₹15,000/hr' },
        { id: 'g14', name: 'Bentley Flying Spur', category: 'Luxury Saloon', price: 100000, img: '🏎️', premium: true, hourly: '₹12,500/hr' },
        { id: 'g15', name: 'Mercedes G-Wagon', category: 'Luxury SUV', price: 80000, img: '🚙', premium: true, hourly: '₹11,000/hr' }
    ],
    procession: [
        { id: 'p1', name: 'White Royal Horse (Ghodi)', info: 'With traditional red/gold crown', price: 7000, img: '🐎', handler: true, safety: true },
        { id: 'p2', name: 'Decorated Wedding Horse', info: 'Bihari style decorated horse', price: 5500, img: '🐎', handler: true, safety: true },
        { id: 'p3', name: 'Elephant Booking (Gajraj)', info: 'Royal entrance with handler', price: 25000, img: '🐘', handler: true, safety: true },
        { id: 'p4', name: 'Camel Booking', info: 'Rajasthani style grand entry', price: 12000, img: '🐫', handler: true, safety: true },
        { id: 'p5', name: 'Traditional Buggy (Bagghi)', info: '2-Horse decorated carriage', price: 15000, img: '🛷', handler: true, safety: true },
        { id: 'p6', name: 'Royal Chariot', info: '4-Horse grand royal buggy', price: 20000, img: '🏰', handler: true, safety: true },
        { id: 'p7', name: 'Vintage Horse Carriage', info: 'Classic look buggy with lights', price: 18000, img: '🎠', handler: true, safety: true }
    ],
    logistics: [
        { id: 'l1', name: 'Baraat Band Booking', desc: '15 Musicians team with lights', price: 25000, img: '🎺' },
        { id: 'l2', name: 'DJ Vehicle', desc: 'Mobile sound system truck', price: 18000, img: '🔊' },
        { id: 'l3', name: 'Dhol Team', desc: '5 Punjabi/Bihari Dhol players', price: 8000, img: '🥁' },
        { id: 'l4', name: 'Brass Band', desc: 'English dress style brass band', price: 22000, img: '🎷' },
        { id: 'l5', name: 'Shehnai Artists', desc: '2 Artists with classical tunes', price: 6000, img: '🎶' },
        { id: 'l6', name: 'Flower Decoration Vehicle', desc: 'Auto decoration with fresh flowers', price: 12000, img: '🌸' },
        { id: 'l7', name: 'Generator Vehicle', desc: 'Silent mobile power backup generator', price: 8500, img: '🔌' },
        { id: 'l8', name: 'Welcome Procession Team', desc: 'Girls greeting team in traditional sarees', price: 10000, img: '🎎' }
    ],
    packages: [
        { id: 'pkg-silver', name: 'Silver Package', ribbon: 'silver', inclusions: '2 Scorpio, 1 Bolero, Groom Car', price: 15000, img: '🪙' },
        { id: 'pkg-gold', name: 'Gold Package', ribbon: 'gold', inclusions: '4 Scorpio, 2 Bolero, Groom Luxury Car, Band Arrangement', price: 35000, img: '🥇' },
        { id: 'pkg-royal', name: 'Royal Package', ribbon: 'diamond', inclusions: 'Luxury Groom Vehicle, 10+ Baraat Vehicles, Horse/Bagghi, Band + DJ, Full Coordination', price: 95000, img: '👑' }
    ]
};

function switchWeddingTab(tabId) {
    // Highlight active tab button
    document.querySelectorAll('.wedding-tabs-bar button').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    // Show corresponding pane
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `pane-${tabId}`);
    });
}

function renderWeddingMarketplace() {
    const categories = ['baraat', 'groom', 'procession', 'logistics', 'packages'];
    categories.forEach(cat => {
        const grid = document.getElementById(`grid-${cat}`);
        if (!grid) return;
        grid.innerHTML = '';
        
        const items = weddingMarketplaceData[cat];
        items.forEach(item => {
            const isSelected = !!appState.selectedWeddingItems[item.id];
            const card = document.createElement('div');
            card.className = `marketplace-card ${isSelected ? 'selected' : ''}`;
            card.dataset.id = item.id;
            card.onclick = () => toggleWeddingItem(item);

            let badgesHTML = '';
            let metaHTML = '';
            if (cat === 'baraat') {
                badgesHTML = `
                    <span class="m-badge ac">${item.type}</span>
                    <span class="m-badge driver">${item.capacity}</span>
                    ${item.driver ? '<span class="m-badge driver">Driver Included</span>' : ''}
                `;
            } else if (cat === 'groom') {
                badgesHTML = `
                    <span class="m-badge premium">${item.category}</span>
                    <span class="m-badge ac">${item.hourly}</span>
                `;
                metaHTML = `
                    <div class="photo-gallery-mock" onclick="event.stopPropagation();">
                        <div class="gallery-thumbnail">📸</div>
                        <div class="gallery-thumbnail">✨</div>
                        <div class="gallery-thumbnail">🌸</div>
                    </div>
                    <div class="card-meta-action" onclick="event.stopPropagation();">
                        <span class="card-desc">Deco: </span>
                        <select class="deco-select" onchange="event.stopPropagation();">
                            <option>Red Rose Classic</option>
                            <option>White Jasmine Royal</option>
                            <option>Marigold Traditional</option>
                            <option>Orchid Premium</option>
                        </select>
                    </div>
                `;
            } else if (cat === 'procession') {
                badgesHTML = `
                    <span class="m-badge premium">Handler Included</span>
                    <span class="m-badge safety">Safety Verified</span>
                `;
            }

            let mainContent = '';
            if (cat === 'packages') {
                mainContent = `
                    <div class="card-img-wrapper">${item.img}</div>
                    <div class="card-content">
                        <div class="card-title-row">
                            <span class="card-title">${item.name}</span>
                        </div>
                        <span class="card-desc">${item.inclusions}</span>
                        <div class="card-pricing-row">
                            <span class="card-price">₹${item.price.toLocaleString()}</span>
                        </div>
                    </div>
                    <span class="m-select-indicator">${isSelected ? '✓' : '+'}</span>
                `;
            } else {
                mainContent = `
                    <div class="card-img-wrapper">${item.img}</div>
                    <div class="card-content">
                        <div class="card-title-row">
                            <span class="card-title">${item.name}</span>
                        </div>
                        <div class="m-badge-container">${badgesHTML}</div>
                        ${item.info || item.desc ? `<span class="card-desc">${item.info || item.desc}</span>` : ''}
                        ${metaHTML}
                        <div class="card-pricing-row">
                            <span class="card-price">₹${item.price.toLocaleString()}</span>
                        </div>
                    </div>
                    <span class="m-select-indicator">${isSelected ? '✓' : '+'}</span>
                `;
            }

            card.innerHTML = mainContent;
            grid.appendChild(card);
        });
    });
}

function toggleWeddingItem(item) {
    if (appState.selectedWeddingItems[item.id]) {
        delete appState.selectedWeddingItems[item.id];
    } else {
        appState.selectedWeddingItems[item.id] = item;
    }
    renderWeddingMarketplace();
    updateWeddingTotal();
}

function updateWeddingTotal() {
    let total = 0;
    let count = 0;
    for (const key in appState.selectedWeddingItems) {
        if (Object.prototype.hasOwnProperty.call(appState.selectedWeddingItems, key)) {
            total += appState.selectedWeddingItems[key].price;
            count++;
        }
    }
    appState.selectedWeddingPrice = total;
    
    const countEl = document.getElementById('wedding-summary-count');
    const priceEl = document.getElementById('wedding-summary-price');
    if (countEl) countEl.innerText = `${count} items selected`;
    if (priceEl) priceEl.innerText = `Total: ₹${total.toLocaleString()}`;
}

function submitWeddingBooking() {
    let total = 0;
    let count = 0;
    const selectedNames = [];
    for (const key in appState.selectedWeddingItems) {
        if (Object.prototype.hasOwnProperty.call(appState.selectedWeddingItems, key)) {
            total += appState.selectedWeddingItems[key].price;
            selectedNames.push(appState.selectedWeddingItems[key].name);
            count++;
        }
    }

    if (count === 0) {
        showToast('Error', 'Please select at least one vehicle or package.', true);
        return;
    }

    appState.selectedWeddingPrice = total;
    appState.selectedWeddingCar = selectedNames.join(', ');
    appState.selectedWeddingPkg = `${count} Items`;
    
    appState.weddingDate = document.getElementById('wedding-date').value;
    appState.weddingTime = document.getElementById('wedding-time').value;
    appState.weddingVenue = document.getElementById('wedding-venue').value;
    appState.weddingGuests = parseInt(document.getElementById('wedding-guests').value) || 150;

    appState.bookingHistory.unshift({
        id: Date.now(),
        type: `Wedding convoy (${count} items)`,
        route: `${appState.weddingDistrict} to ${appState.weddingVenue}`,
        price: total,
        date: appState.weddingDate,
        status: 'Reserved'
    });

    goToScreen('wedding-success');
}

/* ==========================================================================
   SAFARSHAADI MODULE LOGIC & DATA
   ========================================================================== */
const shaadiCastesData = {
    'Hindu': ['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Yadav', 'Bhumihar', 'Rajput', 'Other'],
    'Muslim': ['Sunni', 'Shia', 'Pasmanda', 'Other'],
    'Sikh': ['Jatt', 'Khatri', 'Ramgarhia', 'Other'],
    'Christian': ['Catholic', 'Protestant', 'Orthodox', 'Other']
};

const shaadiTimelineData = {
    'Hindu': [
        { id: 'h-lagan', day: 'D-30', title_en: 'Lagan Patrika (लिखाई)', title_hi: 'लगन पत्रिका लेखन', desc_en: 'Auspicious wedding invitation card draft and writing of Muhurat details.', desc_hi: 'शुभ विवाह मुहूर्त के विवरण के साथ लगन पत्रिका का लेखन एवं ससुरारी प्रस्थान।', customs: 'Suhag & Tilak Puja' },
        { id: 'h-godan', day: 'D-15', title_en: 'Godan (गोधूलि दान)', title_hi: 'गोदान रस्म', desc_en: 'Cow donation simulation & spiritual prayer to ancestors.', desc_hi: 'पूर्वजों के आशीर्वाद हेतु धार्मिक अनुष्ठान और दान।', customs: 'Gaya Pitrapaksha Remembrance' },
        { id: 'h-haldi', day: 'D-3', title_en: 'Haldi Kutai & Gheehari', title_hi: 'हल्दी कुटाई व घीहरी', desc_en: 'Grinding of fresh turmeric by married ladies of the house.', desc_hi: 'अहिवात स्त्रियों द्वारा मंगलगान के साथ हल्दी कुटाई।', customs: 'Uptan Application' },
        { id: 'h-matkor', day: 'D-1', title_en: 'Matkor & Mandap Achhadan', title_hi: 'मटकोर व मंडप छादन', desc_en: 'Digging of soil for fertility worship and raising the canopy.', desc_hi: 'पवित्र मिट्टी लाने की रस्म एवं बांस का मंडप लगाना।', customs: 'Chamach-Geet Songs' },
        { id: 'h-jaimala', day: 'D-Day', title_en: 'Dwar Puja, Jaimala & Kanyadaan', title_hi: 'द्वार पूजा, जयमाला व कन्यादान', desc_en: 'Welcoming the groom fleet, garland exchange, and pheras.', desc_hi: 'बारात अगवानी, जयमाला, सात फेरे और कन्यादान।', customs: 'Vedic Agni Havan' },
        { id: 'h-kohbar', day: 'D+1', title_en: 'Kohbar Puja & Chaturthi', title_hi: 'कोहबर पूजन', desc_en: 'Post-wedding traditional rituals inside the painted Kohbar room.', desc_hi: 'वर-वधू द्वारा कोहबर चित्र दीवार पूजन और खेल-तमाशे।', customs: 'Mithila Painting Backdrop' },
        { id: 'h-bidai', day: 'D+2', title_en: 'Bidai & Vadhu Pravesh', title_hi: 'विदाई व गृह प्रवेश', desc_en: 'Tearful bride farewell with rice-throwing and new home welcome.', desc_hi: 'सजल आंखों से विदाई, अक्षत दान और वधू का नए गृह में स्वागत।', customs: 'Kalash Dwar Puja' }
    ],
    'Muslim': [
        { id: 'm-istikhara', day: 'D-30', title_en: 'Istikhara & Mangni', title_hi: 'इस्तिखारा और मंगनी', desc_en: 'Prayer to seek guidance from Allah for a successful marriage.', desc_hi: 'अल्लाह से निकाह की अनुमति और आशीष की दुआ के साथ सगाई।', customs: 'Exchange of Sweets' },
        { id: 'm-manjha', day: 'D-7', title_en: 'Manjha Ceremony', title_hi: 'मांझा रस्म', desc_en: 'Applying turmeric and sandalwood paste on the bride.', desc_hi: 'दुल्हन को हल्दी और चंदन का लेप लगाना। पीला परिधान।', customs: 'Dholak Geet' },
        { id: 'm-mehendi', day: 'D-2', title_en: 'Henna Night (मेहंदी रात)', title_hi: 'मेहंदी की रात', desc_en: 'Adorning the bride\'s hands with intricate Arabic henna patterns.', desc_hi: 'दुल्हन के हाथों और पैरों में सुंदर मेहंदी रचाना।', customs: 'Sangeet Celebrations' },
        { id: 'm-nikah', day: 'D-Day', title_en: 'Nikah, Mehr & Khutbah', title_hi: 'निकाह और मेहर रस्म', desc_en: 'Legal solemnization with witnesses, agreement of Mehr, signing Nikah Nama.', desc_hi: 'काजी साहब की मौजूदगी में इकरार, मेहर अदायगी और निकाहनामा दस्तखत।', customs: 'Ijab-o-Qubool Vows' },
        { id: 'm-walima', day: 'D+1', title_en: 'Walima Banquet', title_hi: 'वलीमा दावत', desc_en: 'Grand wedding reception hosted by the groom\'s family.', desc_hi: 'दूल्हे के परिवार की तरफ से दी जाने वाली वलीमा दावत।', customs: 'Gourmet Mughlai Feast' },
        { id: 'm-rukhsati', day: 'D+2', title_en: 'Rukhsati Ceremony', title_hi: 'रुखसती (विदाई)', desc_en: 'Emotional departure of the bride with holy Quran blessings.', desc_hi: 'पवित्र कुरान की साए में दुल्हन की रुखसती।', customs: 'Tearful Goodbye' }
    ],
    'Sikh': [
        { id: 's-kurmai', day: 'D-15', title_en: 'Kurmai / Shagan engagement', title_hi: 'कुड़माई और शगन', desc_en: 'Formal engagement at the Gurdwara Sahib.', desc_hi: 'गुरुद्वारे में अरदास के साथ सगाई की रस्म।', customs: 'Kara & Kirpan Gifts' },
        { id: 's-maiya', day: 'D-3', title_en: 'Maiya & Vatna cleansing', title_hi: 'माइयाँ व वटना', desc_en: 'Applying turmeric cleansing paste under red phulkari canopy.', desc_hi: 'मंगलगान के बीच वधू को हल्दी और तेल लगाना।', customs: 'Sangeet Songs' },
        { id: 's-gharoli', day: 'D-1', title_en: 'Gharoli holy water', title_hi: 'घड़ोली घड़ा रस्म', desc_en: 'Collecting holy water from Gurdwara for bride\'s bath.', desc_hi: 'शादी के स्नान के लिए गुरुद्वारा साहिब से पवित्र जल लाना।', customs: 'Bhajan-Gurbani' },
        { id: 's-anand', day: 'D-Day', title_en: 'Anand Karaj (Laavan pheras)', title_hi: 'आनंद कारज (चार लावां)', desc_en: 'Holy wedding ceremony revolving four times around Sri Guru Granth Sahib.', desc_hi: 'गुरु ग्रंथ साहिब के समक्ष वचनों के साथ आनंद कारज की परिक्रमा।', customs: 'Shabad Kirtan Music' },
        { id: 's-doli', day: 'D+1', title_en: 'Doli Departure', title_hi: 'डोली विदाई', desc_en: 'The bride leaves her paternal home in a decorated convoy.', desc_hi: 'माता-पिता के घर से आंसुओं के साथ विदाई।', customs: 'Sikh Wedding Shubh convoy' }
    ],
    'Christian': [
        { id: 'c-banns', day: 'D-30', title_en: 'Banns of Marriage', title_hi: 'विवाह की घोषणा', desc_en: 'Announcing the holy marriage publicly in church.', desc_hi: 'चर्च में शादी के नाम की घोषणा की रस्म।', customs: 'Spiritual Blessing' },
        { id: 'c-shower', day: 'D-2', title_en: 'Bridal Shower & Rehearsal', title_hi: 'ब्राइडल शॉवर और रिहर्सल', desc_en: 'Games and gifts celebration, followed by church procession rehearsal.', desc_hi: 'दुल्हन की सहेलियों संग पार्टी और चर्च रस्म की तैयारी।', customs: 'Pink Champagne toast' },
        { id: 'c-vows', day: 'D-Day', title_en: 'Holy Nuptial Vows Exchange', title_hi: 'चर्च विवाह व प्रतिज्ञा', desc_en: 'Exchange of vows, rings, and signing the marriage register.', desc_hi: 'अंगूठी विनिमय, बाइबिल सौगंध और पादरी की घोषणा।', customs: 'Walking down the aisle' },
        { id: 'c-reception', day: 'D+1', title_en: 'Grand Reception & Dance', title_hi: 'वेडिंग रिसेप्शन', desc_en: 'First dance, cutting of wedding cake, and toasts.', desc_hi: 'नवदंपति का पहला युगल नृत्य, केक काटना और दावत।', customs: 'Live Violin band music' }
    ]
};

const shaadiVendorsData = [
    { id: 'v1', category: 'priest', name: 'Pandit Mithilesh Dwivedi', rating: '4.9 ⭐', info_en: 'Maithili/Bhojpuri Vedic specialist, Shadi Mandap Havan.', info_hi: 'मैथिली/भोजपुरी वैदिक पंडित, विवाह मण्डप यज्ञ विशेषज्ञ।', price: 11000, img: '🕉️' },
    { id: 'v2', category: 'priest', name: 'Qazi Abdul Hamid', rating: '4.8 ⭐', info_en: 'Sunni Nikah specialist, Nikah-Khwan register.', info_hi: 'सुन्नी निकाह विशेषज्ञ, निकाह-ख्वां निकाहनामा लिखने वाले।', price: 7500, img: '🌙' },
    { id: 'v3', category: 'priest', name: 'Giani Gurbaksh Singh', rating: '4.9 ⭐', info_en: 'Patna Saheb Gurdwara Anand Karaj specialist.', info_hi: 'पटना साहिब गुरुद्वारा आनंद कारज अरदास विशेषज्ञ।', price: 9000, img: '☬' },
    { id: 'v4', category: 'priest', name: 'Rev. Father Joseph D\'Souza', rating: '4.7 ⭐', info_en: 'Catholic Nuptial Mass conductor.', info_hi: 'कैथोलिक मसीही विवाह पद्धति पादरी।', price: 8000, img: '✝️' },
    { id: 'v5', category: 'makeup', name: 'Radha Shringar Salon & Nai', rating: '4.8 ⭐', info_en: 'Bridal makeup, traditional Naua-Nain pedicure rituals.', info_hi: 'दुल्हन श्रृंगार और पारंपरिक नउआ-नैन पैर पूजा रस्में।', price: 15000, img: '💅' },
    { id: 'v6', category: 'makeup', name: 'Zoya Bridal Makeover', rating: '4.6 ⭐', info_en: 'Specialist in Arabic Halal cosmetics & hair styling.', info_hi: 'अरबी हलाल कॉस्मेटिक्स और हेयर स्टाइलिंग की विशेषज्ञ।', price: 12000, img: '💄' },
    { id: 'v7', category: 'catering', name: 'Mithila Shuddh Bhoj Catering', rating: '4.9 ⭐', info_en: 'Litti Chokha, Makhan Kheer, 100% vegetarian feast.', info_hi: 'विवाह विशेष शाकाहारी भोजन, लिट्टी-चोखा, मखाना खीर।', price: 45000, img: '🍲' },
    { id: 'v8', category: 'catering', name: 'Bismillah Halal Royal Caterers', rating: '4.8 ⭐', info_en: 'Authentic Mughlai Biryani, Shahi Tukda banquet.', info_hi: 'शाही मटन बिरयानी, चिकन लजीज और शाही टुकड़ा दावत।', price: 65000, img: '🍗' },
    { id: 'v9', category: 'decor', name: 'Mithila Art Stage Decorators', rating: '4.9 ⭐', info_en: 'Hand-painted Madhubani floral backdrops, fresh marigolds.', info_hi: 'हस्तनिर्मित मधुबनी चित्रकला आधारित स्टेज सज्जा।', price: 40000, img: '🎪' },
    { id: 'v10', category: 'decor', name: 'Royal Darbar Decorators', rating: '4.7 ⭐', info_en: 'Luxury lighting, golden pillars, jasmine hangings.', info_hi: 'शाही स्वर्ण खंभे और चमेली के फूलों का भव्य शामियाना।', price: 55000, img: '✨' },
    { id: 'v11', category: 'photo', name: 'Bihar Wedding Reels', rating: '4.9 ⭐', info_en: 'Cinematic drone shooting, Ganga Ghat pre-wedding.', info_hi: 'सिनेमैटिक ड्रोन शूटिंग और प्री-वेडिंग गंगा घाट।', price: 35000, img: '📷' },
    { id: 'v12', category: 'music', name: 'Patna Shehnai & Brass Band', rating: '4.8 ⭐', info_en: 'Royal Baraat welcome, classical Shehnai music.', info_hi: 'शाही बारात स्वागत धुनों और शहनाई वादक।', price: 22000, img: '🎺' },
    { id: 'v13', category: 'venue', name: 'Mithila Utsav Bhawan, Patna', rating: '4.8 ⭐', info_en: 'AC Hall, capacity 600 guests, royal decoration.', info_hi: 'एसी हॉल, 600 मेहमान क्षमता, शाही साज-सज्जा।', price: 120000, img: '🏰' }
];

let currentVendorCategory = 'all';

function updateShaadiCountdown() {
    const dateInput = document.getElementById('wedding-date');
    if (dateInput) {
        appState.weddingDate = dateInput.value;
    }
    const diffTime = new Date(appState.weddingDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysEl = document.getElementById('shaadi-countdown-days');
    if (daysEl) {
        daysEl.innerText = isNaN(diffDays) ? '0' : (diffDays < 0 ? '0' : diffDays);
    }
}

function showShaadiSubView(viewName) {
    document.querySelectorAll('.shaadi-sub-pane').forEach(p => p.classList.add('hidden'));
    
    const pane = document.getElementById(`shaadi-pane-${viewName}`);
    if (pane) {
        pane.classList.remove('hidden');
    }
    
    if (appState.shaadiViewStack[appState.shaadiViewStack.length - 1] !== viewName) {
        appState.shaadiViewStack.push(viewName);
    }
    
    const titleEl = document.getElementById('shaadi-screen-title');
    if (titleEl) {
        if (viewName === 'hub') {
            titleEl.setAttribute('data-en', 'SafarShaadi');
            titleEl.setAttribute('data-hi', 'सफ़र शादी');
            titleEl.setAttribute('data-mai', 'सफ़र विवाह');
            titleEl.setAttribute('data-bho', 'सफ़र शादी');
        } else if (viewName === 'religion') {
            titleEl.setAttribute('data-en', 'Select Community');
            titleEl.setAttribute('data-hi', 'समुदाय चुनें');
            titleEl.setAttribute('data-mai', 'समुदाय चुनु');
            titleEl.setAttribute('data-bho', 'समाज चुनीं');
        } else if (viewName === 'timeline') {
            titleEl.setAttribute('data-en', 'Ritual Timeline');
            titleEl.setAttribute('data-hi', 'रस्म समयचक्र');
            titleEl.setAttribute('data-mai', 'रस्म समयचक्र');
            titleEl.setAttribute('data-bho', 'रस्म टाइमलाइन');
            renderShaadiTimeline();
        } else if (viewName === 'vendors') {
            titleEl.setAttribute('data-en', 'Book Services & Vendors');
            titleEl.setAttribute('data-hi', 'वेंडर्स और सेवाएँ');
            titleEl.setAttribute('data-mai', 'वेंडर बुक करू');
            titleEl.setAttribute('data-bho', 'वेंडर्स बुक करीं');
            renderShaadiVendors();
        } else if (viewName === 'planner') {
            titleEl.setAttribute('data-en', 'Smart Planner & Budget');
            titleEl.setAttribute('data-hi', 'बजट और मेहमान');
            titleEl.setAttribute('data-mai', 'बजट आ मेहमान');
            titleEl.setAttribute('data-bho', 'बजट आ मेहमान');
            updateBudgetTracker();
            renderShaadiGuests();
        } else if (viewName === 'transport') {
            titleEl.setAttribute('data-en', 'Shubh Transport Convoy');
            titleEl.setAttribute('data-hi', 'मांगलिक वाहन बुकिंग');
            titleEl.setAttribute('data-mai', 'विवाह गाड़ी');
            titleEl.setAttribute('data-bho', 'लग्न गाड़ी बुकिंग');
            renderWeddingMarketplace();
            updateWeddingTotal();
        }
        if (typeof setLanguage === 'function') {
            setLanguage(appState.currentLanguage || 'en');
        }
    }
    
    const bannerEl = document.getElementById('shaadi-header-banner');
    if (bannerEl) {
        if (viewName === 'hub') {
            bannerEl.style.display = 'flex';
        } else {
            bannerEl.style.display = 'none';
        }
    }
}

function goBackShaadi() {
    if (appState.shaadiViewStack.length > 1) {
        appState.shaadiViewStack.pop();
        const prevView = appState.shaadiViewStack[appState.shaadiViewStack.length - 1];
        
        document.querySelectorAll('.shaadi-sub-pane').forEach(p => p.classList.add('hidden'));
        
        const pane = document.getElementById(`shaadi-pane-${prevView}`);
        if (pane) pane.classList.remove('hidden');
        
        const bannerEl = document.getElementById('shaadi-header-banner');
        if (bannerEl) {
            if (prevView === 'hub') {
                bannerEl.style.display = 'flex';
            } else {
                bannerEl.style.display = 'none';
            }
        }
        
        const titleEl = document.getElementById('shaadi-screen-title');
        if (titleEl && prevView === 'hub') {
            titleEl.setAttribute('data-en', 'SafarShaadi');
            titleEl.setAttribute('data-hi', 'सफ़र शादी');
            titleEl.setAttribute('data-mai', 'सफ़र विवाह');
            titleEl.setAttribute('data-bho', 'सफ़र शादी');
            setLanguage(appState.currentLanguage || 'en');
        }
    } else {
        goToScreen('home');
    }
}

function selectShaadiReligion(rel) {
    appState.shaadiSelection.religion = rel;
    
    document.querySelectorAll('.shaadi-option-card').forEach(card => {
        card.classList.remove('active');
    });
    const activeCard = document.getElementById(`rel-card-${rel}`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
    
    const detailsTitle = document.getElementById('shaadi-details-title');
    if (detailsTitle) {
        if (rel === 'Hindu') {
            detailsTitle.setAttribute('data-en', 'Caste Category');
            detailsTitle.setAttribute('data-hi', 'जाति श्रेणी');
            detailsTitle.setAttribute('data-mai', 'जाति');
            detailsTitle.setAttribute('data-bho', 'जाति चुनीं');
        } else if (rel === 'Muslim') {
            detailsTitle.setAttribute('data-en', 'Sect / School');
            detailsTitle.setAttribute('data-hi', 'फ़िरक़ा / संप्रदाय');
            detailsTitle.setAttribute('data-mai', 'फ़िरक़ा');
            detailsTitle.setAttribute('data-bho', 'फ़िरक़ा');
        } else if (rel === 'Sikh') {
            detailsTitle.setAttribute('data-en', 'Clan / Category');
            detailsTitle.setAttribute('data-hi', 'गोत्र / वर्ग');
            detailsTitle.setAttribute('data-mai', 'वर्ग');
            detailsTitle.setAttribute('data-bho', 'वर्ग');
        } else if (rel === 'Christian') {
            detailsTitle.setAttribute('data-en', 'Denomination');
            detailsTitle.setAttribute('data-hi', 'पंथ / संप्रदाय');
            detailsTitle.setAttribute('data-mai', 'पंथ');
            detailsTitle.setAttribute('data-bho', 'पंथ');
        }
        setLanguage(appState.currentLanguage || 'en');
    }
    
    const optionsList = document.getElementById('shaadi-details-options-list');
    if (optionsList) {
        optionsList.innerHTML = '';
        const castes = shaadiCastesData[rel] || ['General', 'Other'];
        
        castes.forEach(c => {
            const btn = document.createElement('div');
            btn.className = 'caste-card';
            if (appState.shaadiSelection.caste === c) {
                btn.classList.add('active');
            }
            btn.innerText = c;
            btn.onclick = () => selectShaadiCaste(c);
            optionsList.appendChild(btn);
        });
    }
    
    if (!shaadiCastesData[rel].includes(appState.shaadiSelection.caste)) {
        selectShaadiCaste(shaadiCastesData[rel][0]);
    } else {
        updateShaadiPrefRibbon();
    }
}

function selectShaadiCaste(caste) {
    appState.shaadiSelection.caste = caste;
    document.querySelectorAll('.caste-card').forEach(btn => {
        if (btn.innerText === caste) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    updateShaadiPrefRibbon();
}

function updateShaadiPrefRibbon() {
    const religionIcons = {
        'Hindu': '🕉️',
        'Muslim': '🌙',
        'Sikh': '☬',
        'Christian': '✝️'
    };
    const iconEl = document.getElementById('shaadi-pref-icon');
    if (iconEl) {
        iconEl.innerText = religionIcons[appState.shaadiSelection.religion] || '🌸';
    }
    const textEl = document.getElementById('shaadi-pref-religion');
    if (textEl) {
        textEl.innerText = `${appState.shaadiSelection.religion} / ${appState.shaadiSelection.caste} Community`;
    }
}

function renderShaadiTimeline() {
    const listEl = document.getElementById('shaadi-timeline-list');
    if (!listEl) return;
    
    listEl.innerHTML = '';
    const religion = appState.shaadiSelection.religion || 'Hindu';
    const rituals = shaadiTimelineData[religion] || shaadiTimelineData['Hindu'];
    
    rituals.forEach(r => {
        const isCompleted = !!appState.shaadiChecklist[r.id];
        const step = document.createElement('div');
        step.className = `timeline-step ${isCompleted ? 'completed' : ''}`;
        step.id = `timeline-step-${r.id}`;
        
        step.innerHTML = `
            <div class="timeline-header">
                <span class="timeline-day">${r.day}</span>
                <span class="timeline-title text-bilingual" data-en="${r.title_en}" data-hi="${r.title_hi}">${appState.currentLanguage === 'hi' ? r.title_hi : r.title_en}</span>
            </div>
            <p class="timeline-desc text-bilingual" data-en="${r.desc_en}" data-hi="${r.desc_hi}">${appState.currentLanguage === 'hi' ? r.desc_hi : r.desc_en}</p>
            <div class="timeline-action-row">
                <span class="timeline-customs">🌸 ${r.customs}</span>
                <input type="checkbox" class="timeline-checkbox" id="chk-${r.id}" ${isCompleted ? 'checked' : ''} onchange="toggleShaadiChecklist('${r.id}')">
            </div>
        `;
        listEl.appendChild(step);
    });
    
    if (typeof setLanguage === 'function') {
        setLanguage(appState.currentLanguage || 'en');
    }
}

function toggleShaadiChecklist(ritualId) {
    const chk = document.getElementById(`chk-${ritualId}`);
    if (chk) {
        appState.shaadiChecklist[ritualId] = chk.checked;
        const stepEl = document.getElementById(`timeline-step-${ritualId}`);
        if (stepEl) {
            if (chk.checked) {
                stepEl.classList.add('completed');
                triggerHaptic('success');
            } else {
                stepEl.classList.remove('completed');
            }
        }
    }
}

function switchVendorCategory(category) {
    currentVendorCategory = category;
    document.querySelectorAll('.shaadi-vendor-categories button').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`vcat-${category}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    renderShaadiVendors();
}

function filterShaadiVendors(query) {
    renderShaadiVendors(query);
}

function renderShaadiVendors(searchQuery = '') {
    const grid = document.getElementById('shaadi-vendors-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const q = searchQuery.toLowerCase().trim();
    
    const filtered = shaadiVendorsData.filter(v => {
        if (currentVendorCategory !== 'all' && v.category !== currentVendorCategory) {
            return false;
        }
        if (q) {
            const nameMatch = v.name.toLowerCase().includes(q);
            const infoEnMatch = v.info_en.toLowerCase().includes(q);
            const infoHiMatch = v.info_hi.toLowerCase().includes(q);
            const catMatch = v.category.toLowerCase().includes(q);
            return nameMatch || infoEnMatch || infoHiMatch || catMatch;
        }
        return true;
    });
    
    if (filtered.length === 0) {
        grid.innerHTML = `<div style="text-align:center; padding: 24px; color: #7f8c8d;" class="text-bilingual" data-en="No matching vendors found." data-hi="कोई वेंडर नहीं मिला।">No matching vendors found.</div>`;
        return;
    }
    
    filtered.forEach(v => {
        const isBooked = appState.shaadiBookings.includes(v.id);
        const card = document.createElement('div');
        card.className = 'vendor-card';
        
        card.innerHTML = `
            <div style="font-size: 32px; background: #FEF9E7; border-radius: 8px; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; border: 1px solid #E6D5B8;">
                ${v.img}
            </div>
            <div class="vendor-info">
                <div class="vendor-name-row">
                    <h5 class="vendor-name">${v.name}</h5>
                    <span class="vendor-rating">${v.rating}</span>
                </div>
                <p class="vendor-desc text-bilingual" data-en="${v.info_en}" data-hi="${v.info_hi}">${appState.currentLanguage === 'hi' ? v.info_hi : v.info_en}</p>
                <div class="vendor-meta">
                    <span class="vendor-price">₹${v.price.toLocaleString()}</span>
                    <button class="vendor-book-btn ${isBooked ? 'booked' : ''}" onclick="${isBooked ? '' : `bookShaadiVendor('${v.id}')`}">
                        <span class="text-bilingual" data-en="${isBooked ? 'Booked' : 'Book Now'}" data-hi="${isBooked ? 'बुक हो गया' : 'बुक करें'}">${isBooked ? 'Booked' : 'Book Now'}</span>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    
    if (typeof setLanguage === 'function') {
        setLanguage(appState.currentLanguage || 'en');
    }
}

function bookShaadiVendor(vendorId) {
    const vendor = shaadiVendorsData.find(v => v.id === vendorId);
    if (!vendor) return;
    
    if (!appState.shaadiBookings.includes(vendorId)) {
        appState.shaadiBookings.push(vendorId);
        appState.shaadiSpent += vendor.price;
    }
    
    appState.selectedWeddingCar = vendor.name;
    appState.selectedWeddingPkg = vendor.category.toUpperCase();
    appState.selectedWeddingPrice = vendor.price;
    
    showToast('Shaadi Booking Confirmed', `Successfully booked ${vendor.name}!`);
    triggerHaptic('success');
    
    goToScreen('wedding-success');
}

function updateBudgetTracker() {
    const budgetInput = document.getElementById('shaadi-budget-input');
    if (budgetInput) {
        budgetInput.value = appState.shaadiBudget;
    }
    
    const allocatedEl = document.getElementById('budget-allocated-val');
    const spentEl = document.getElementById('budget-spent-val');
    
    if (allocatedEl) allocatedEl.innerText = `₹${appState.shaadiBudget.toLocaleString()}`;
    if (spentEl) {
        spentEl.innerText = `₹${appState.shaadiSpent.toLocaleString()}`;
        if (appState.shaadiSpent > appState.shaadiBudget) {
            spentEl.className = 'red-text';
        } else {
            spentEl.className = 'green-text';
        }
    }
    
    const seg = document.getElementById('donut-seg-spent');
    if (seg) {
        const percentage = appState.shaadiBudget > 0 ? Math.min(100, Math.round((appState.shaadiSpent / appState.shaadiBudget) * 100)) : 0;
        seg.setAttribute('stroke-dasharray', `${percentage} ${100 - percentage}`);
        if (appState.shaadiSpent > appState.shaadiBudget) {
            seg.style.stroke = '#e74c3c';
        } else {
            seg.style.stroke = 'var(--primary-green)';
        }
    }
    
    const table = document.getElementById('shaadi-budget-table');
    if (table) {
        table.innerHTML = '';
        
        const cats = [
            { name: 'Priests & Clergy', key: 'priest', share: 0.05 },
            { name: 'Catering & Sweets', key: 'catering', share: 0.35 },
            { name: 'Decor & Stage', key: 'decor', share: 0.15 },
            { name: 'Nai & Makeup', key: 'makeup', share: 0.05 },
            { name: 'Photography', key: 'photo', share: 0.10 },
            { name: 'Music & DJ', key: 'music', share: 0.05 },
            { name: 'Venues', key: 'venue', share: 0.20 },
            { name: 'Shubh Transport', key: 'transport', share: 0.05 }
        ];
        
        cats.forEach(c => {
            const allocated = Math.round(appState.shaadiBudget * c.share);
            let spent = 0;
            appState.shaadiBookings.forEach(id => {
                const vendor = shaadiVendorsData.find(v => v.id === id);
                if (vendor && vendor.category === c.key) {
                    spent += vendor.price;
                }
            });
            
            if (c.key === 'transport') {
                spent += appState.selectedWeddingPrice || 0;
            }
            
            const div = document.createElement('div');
            div.className = 'budget-row';
            div.innerHTML = `
                <span>${c.name}</span>
                <strong>₹${spent.toLocaleString()} / ₹${allocated.toLocaleString()}</strong>
            `;
            table.appendChild(div);
        });
    }
}

function updateShaadiBudget(amount) {
    const val = parseInt(amount);
    if (!isNaN(val) && val > 0) {
        appState.shaadiBudget = val;
        updateBudgetTracker();
        showToast('Budget Updated', `New wedding budget allocated: ₹${val.toLocaleString()}`);
    }
}

function renderShaadiGuests() {
    const rows = document.getElementById('shaadi-guest-rows');
    if (!rows) return;
    
    rows.innerHTML = '';
    
    if (appState.shaadiGuests.length === 0) {
        rows.innerHTML = `<div style="text-align:center; padding:12px; font-size:11px; color:#7f8c8d;" class="text-bilingual" data-en="No guests added yet." data-hi="कोई मेहमान नहीं जोड़ा गया।">No guests added yet.</div>`;
        return;
    }
    
    appState.shaadiGuests.forEach(g => {
        const div = document.createElement('div');
        div.className = 'guest-row';
        div.innerHTML = `
            <span class="guest-name" title="${g.name}">${g.name}</span>
            <span class="guest-meta">${g.meal}</span>
            <button class="guest-status-btn ${g.status === 'Confirmed' ? 'confirmed' : 'pending'}" onclick="toggleGuestStatus('${g.id}')">
                ${g.status}
            </button>
            <button class="guest-delete-btn" onclick="deleteShaadiGuest('${g.id}')" title="Remove Guest">✖</button>
        `;
        rows.appendChild(div);
    });
}

function addShaadiGuest() {
    const nameInput = document.getElementById('guest-name-input');
    const mealInput = document.getElementById('guest-meal-input');
    if (!nameInput || !nameInput.value.trim()) {
        showToast('Error', 'Please enter a guest name.');
        return;
    }
    
    const newGuest = {
        id: 'g_' + Date.now(),
        name: nameInput.value.trim(),
        meal: mealInput.value,
        status: 'Pending'
    };
    
    appState.shaadiGuests.push(newGuest);
    nameInput.value = '';
    renderShaadiGuests();
    showToast('Guest Added', `${newGuest.name} added to the list.`);
    triggerHaptic('success');
}

function deleteShaadiGuest(guestId) {
    const guest = appState.shaadiGuests.find(g => g.id === guestId);
    appState.shaadiGuests = appState.shaadiGuests.filter(g => g.id !== guestId);
    renderShaadiGuests();
    if (guest) {
        showToast('Guest Removed', `${guest.name} removed from list.`);
    }
}

function toggleGuestStatus(guestId) {
    const guest = appState.shaadiGuests.find(g => g.id === guestId);
    if (guest) {
        guest.status = (guest.status === 'Confirmed') ? 'Pending' : 'Confirmed';
        renderShaadiGuests();
        triggerHaptic('success');
    }
}

function voiceSearchShaadiVendors() {
    const micBtn = document.querySelector('.shaadi-voice-search-bar .mic-btn');
    const searchInput = document.getElementById('shaadi-vendor-search-input');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = appState.currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.onstart = () => {
            if (micBtn) micBtn.classList.add('recording');
            showToast('Voice Search', 'Listening... Ask for Pandit, Caterer, Venue, etc.', false);
            triggerHaptic('success');
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (micBtn) micBtn.classList.remove('recording');
            showToast('Voice Search Error', 'Could not access speech. Trying simulation...', false);
            runSimulatedVendorVoiceSearch();
        };
        
        recognition.onend = () => {
            if (micBtn) micBtn.classList.remove('recording');
        };
        
        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;
            if (searchInput) {
                searchInput.value = speechResult;
            }
            showToast('Voice Matched', `Searching for: "${speechResult}"`);
            processVoiceQuery(speechResult);
        };
        
        recognition.start();
    } else {
        runSimulatedVendorVoiceSearch();
    }
}

function runSimulatedVendorVoiceSearch() {
    const micBtn = document.querySelector('.shaadi-voice-search-bar .mic-btn');
    const searchInput = document.getElementById('shaadi-vendor-search-input');
    
    if (micBtn) micBtn.classList.add('recording');
    showToast('Voice Search (Simulated)', 'Listening...', false);
    
    const phrases = [
        "Patna mein pandit chahiye",
        "Mithila catering kheer",
        "Bridal makeup artist",
        "Royal stage decorator",
        "Patna shehnai band"
    ];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    setTimeout(() => {
        if (micBtn) micBtn.classList.remove('recording');
        if (searchInput) {
            searchInput.value = phrase;
        }
        showToast('Voice Matched', `Searching for: "${phrase}"`);
        processVoiceQuery(phrase);
        triggerHaptic('success');
    }, 2000);
}

function processVoiceQuery(query) {
    const q = query.toLowerCase();
    let category = 'all';
    
    if (q.includes('pandit') || q.includes('priest') || q.includes('qazi') || q.includes('giani') || q.includes('father')) {
        category = 'priest';
    } else if (q.includes('makeup') || q.includes('beauty') || q.includes('nail') || q.includes('barber') || q.includes('nai') || q.includes('shringar')) {
        category = 'makeup';
    } else if (q.includes('cater') || q.includes('food') || q.includes('sweet') || q.includes('kheer') || q.includes('bhoj')) {
        category = 'catering';
    } else if (q.includes('decor') || q.includes('stage') || q.includes('light')) {
        category = 'decor';
    } else if (q.includes('photo') || q.includes('camera') || q.includes('shoot') || q.includes('reel')) {
        category = 'photo';
    } else if (q.includes('music') || q.includes('band') || q.includes('dj') || q.includes('shehnai')) {
        category = 'music';
    } else if (q.includes('venue') || q.includes('hall') || q.includes('bhawan') || q.includes('garden')) {
        category = 'venue';
    }
    
    switchVendorCategory(category);
    
    const searchInput = document.getElementById('shaadi-vendor-search-input');
    if (searchInput) {
        if (q.includes('mithila')) {
            searchInput.value = 'Mithila';
        } else if (q.includes('royal')) {
            searchInput.value = 'Royal';
        } else {
            searchInput.value = '';
        }
        renderShaadiVendors(searchInput.value);
    }
}

function triggerNotificationSim() {
    showToast('Offer!', 'Book Bodh Gaya or Deoghar package and get 150 Setu Coins cash back!');
}

// Bind interactive functions to window scope for ES Module bundling compatibility
window.setLanguage = setLanguage;
window.jumpToScreen = jumpToScreen;
window.triggerNotificationSim = triggerNotificationSim;
window.simulateDriverMatchSuccess = simulateDriverMatchSuccess;
window.triggerMarigoldShower = triggerMarigoldShower;
window.setOnboardingSlide = setOnboardingSlide;
window.skipOnboarding = skipOnboarding;
window.nextOnboardingSlide = nextOnboardingSlide;
window.validatePhoneInput = validatePhoneInput;
window.sendOTP = sendOTP;
window.editPhoneNumber = editPhoneNumber;
window.focusNextOTP = focusNextOTP;
window.verifyOTP = verifyOTP;
window.goToScreen = goToScreen;
window.openRideSearch = openRideSearch;
window.selectGender = selectGender;
window.submitRegistration = submitRegistration;
window.updateDynamicUserElements = updateDynamicUserElements;
window.requestPermission = requestPermission;
window.grantPermission = grantPermission;
window.grantAllPermissions = grantAllPermissions;
window.continueToHome = continueToHome;
/* ==========================================================================
   PRODUCTION-GRADE FEATURES: DRIVER PREFERENCES, HAPTICS & SMART ROUTING
   ========================================================================== */

function triggerHaptic(type) {
    if (!navigator.vibrate) return;
    try {
        if (type === 'success' || type === 'arrived') {
            navigator.vibrate(100);
        } else if (type === 'confirmed') {
            navigator.vibrate([100, 50, 100]);
        } else if (type === 'error') {
            navigator.vibrate([200, 100, 200]);
        }
    } catch (e) {
        console.warn("Haptic vibrate call failed:", e);
    }
}

function toggleFavoriteCurrentDriver() {
    const driverName = "Ramesh Singh";
    const index = appState.favoriteDrivers.indexOf(driverName);
    const favBtn = document.getElementById('fav-toggle-btn');

    if (index > -1) {
        appState.favoriteDrivers.splice(index, 1);
        showToast('Removed Favorite', `${driverName} removed from favorites.`);
        if (favBtn) favBtn.classList.remove('active');
    } else {
        appState.favoriteDrivers.push(driverName);
        showToast('Added Favorite', `${driverName} added to favorites! ❤️`);
        if (favBtn) favBtn.classList.add('active');
        const blockIndex = appState.blockedDrivers.indexOf(driverName);
        if (blockIndex > -1) {
            appState.blockedDrivers.splice(blockIndex, 1);
            const blockBtn = document.getElementById('block-toggle-btn');
            if (blockBtn) blockBtn.classList.remove('active');
        }
    }
    triggerHaptic('success');
}

function toggleBlockCurrentDriver() {
    const driverName = "Ramesh Singh";
    const index = appState.blockedDrivers.indexOf(driverName);
    const blockBtn = document.getElementById('block-toggle-btn');

    if (index > -1) {
        appState.blockedDrivers.splice(index, 1);
        showToast('Unblocked Driver', `${driverName} is now unblocked.`);
        if (blockBtn) blockBtn.classList.remove('active');
    } else {
        appState.blockedDrivers.push(driverName);
        showToast('Driver Blocked', `${driverName} blocked. You won't match again. 🚫`);
        if (blockBtn) blockBtn.classList.add('active');
        const favIndex = appState.favoriteDrivers.indexOf(driverName);
        if (favIndex > -1) {
            appState.favoriteDrivers.splice(favIndex, 1);
            const favBtn = document.getElementById('fav-toggle-btn');
            if (favBtn) favBtn.classList.remove('active');
        }
    }
    triggerHaptic('success');
}

function populateDriverPreferences() {
    const favList = document.getElementById('favorite-drivers-list');
    const blockList = document.getElementById('blocked-drivers-list');

    if (favList) {
        favList.innerHTML = '';
        if (appState.favoriteDrivers.length === 0) {
            favList.innerHTML = `<div class="pref-item-empty text-bilingual text-small" data-en="No favorites yet." data-hi="कोई पसंदीदा नहीं।">No favorites yet.</div>`;
        } else {
            appState.favoriteDrivers.forEach(name => {
                const div = document.createElement('div');
                div.className = 'pref-item';
                div.innerHTML = `
                    <span>❤️ ${name}</span>
                    <button onclick="removeDriverPref('favorite', '${name}')" title="Remove Favorite">✖</button>
                `;
                favList.appendChild(div);
            });
        }
    }

    if (blockList) {
        blockList.innerHTML = '';
        if (appState.blockedDrivers.length === 0) {
            blockList.innerHTML = `<div class="pref-item-empty text-bilingual text-small" data-en="No blocked drivers." data-hi="कोई ब्लॉक ड्राइवर नहीं।">No blocked drivers.</div>`;
        } else {
            appState.blockedDrivers.forEach(name => {
                const div = document.createElement('div');
                div.className = 'pref-item';
                div.innerHTML = `
                    <span>🚫 ${name}</span>
                    <button onclick="removeDriverPref('block', '${name}')" title="Unblock Driver">✖</button>
                `;
                blockList.appendChild(div);
            });
        }
    }
}

function removeDriverPref(type, name) {
    if (type === 'favorite') {
        appState.favoriteDrivers = appState.favoriteDrivers.filter(d => d !== name);
        showToast('Preference Removed', `${name} removed from favorites.`);
    } else {
        appState.blockedDrivers = appState.blockedDrivers.filter(d => d !== name);
        showToast('Preference Removed', `${name} unblocked.`);
    }
    populateDriverPreferences();
    triggerHaptic('success');
}

function triggerSmartSuggestionRide() {
    showToast('Smart Commute', 'Booking usual Home ➔ Work route...', false);
    triggerHaptic('success');

    appState.pickupLocation = 'Home (Kankarbagh Colony, Patna)';
    appState.dropLocation = 'Work (Vikas Bhawan, Bailey Road, Patna)';
    appState.pickupCoords = [25.5895, 85.1444];
    appState.dropCoords = [25.6088, 85.1120];

    goToScreen('ride-booking');

    setTimeout(() => {
        if (appState.pickupMarker && appState.dropMarker) {
            appState.pickupMarker.setLatLng(appState.pickupCoords);
            appState.dropMarker.setLatLng(appState.dropCoords);
            
            document.getElementById('pickup-autocomplete').value = appState.pickupLocation;
            document.getElementById('drop-autocomplete').value = appState.dropLocation;

            fitMapBounds();
            recalculateRoute();
        }
    }, 400);
}

window.openOutstationBooking = openOutstationBooking;
window.openParcelBooking = openParcelBooking;
window.showMoreServicesAlert = showMoreServicesAlert;
window.setPromoSlide = setPromoSlide;
window.selectVehicleCard = selectVehicleCard;
window.startDriverMatching = startDriverMatching;
window.cancelRideBooking = cancelRideBooking;
window.triggerCallSimulator = triggerCallSimulator;
window.triggerChatSimulator = triggerChatSimulator;
window.finishSimulatedRide = finishSimulatedRide;
window.switchWeddingTab = switchWeddingTab;
window.toggleWeddingItem = toggleWeddingItem;
window.selectWeddingCar = (el, name) => {};
window.selectWeddingPackage = (el, name, price) => {};
window.submitWeddingBooking = submitWeddingBooking;

// SafarShaadi bindings
window.updateShaadiCountdown = updateShaadiCountdown;
window.showShaadiSubView = showShaadiSubView;
window.goBackShaadi = goBackShaadi;
window.selectShaadiReligion = selectShaadiReligion;
window.selectShaadiCaste = selectShaadiCaste;
window.renderShaadiTimeline = renderShaadiTimeline;
window.toggleShaadiChecklist = toggleShaadiChecklist;
window.switchVendorCategory = switchVendorCategory;
window.filterShaadiVendors = filterShaadiVendors;
window.bookShaadiVendor = bookShaadiVendor;
window.updateShaadiBudget = updateShaadiBudget;
window.addShaadiGuest = addShaadiGuest;
window.deleteShaadiGuest = deleteShaadiGuest;
window.toggleGuestStatus = toggleGuestStatus;
window.voiceSearchShaadiVendors = voiceSearchShaadiVendors;
window.setStarRating = setStarRating;
window.toggleReviewTag = toggleReviewTag;
window.submitReview = submitReview;
window.addMoneySimulator = addMoneySimulator;
window.closeCallSimulator = closeCallSimulator;
window.acceptSimulatedCall = acceptSimulatedCall;
window.closeChatSimulator = closeChatSimulator;
window.sendSimulatedChatMessage = sendSimulatedChatMessage;
window.cancelEmergencySOS = cancelEmergencySOS;
window.triggerEmergencySOS = triggerEmergencySOS;
window.shareReferralCode = shareReferralCode;
window.purchaseCommuterPass = purchaseCommuterPass;
window.toggleLowDataMode = toggleLowDataMode;
window.selectPrimaryPayMode = selectPrimaryPayMode;
window.setFestivalMode = setFestivalMode;
window.initializeGoogleMaps = initializeGoogleMaps;
window.shareLiveTripLink = shareLiveTripLink;
window.triggerDeviceGPS = triggerDeviceGPS;
window.suggestAutocomplete = suggestAutocomplete;
window.openTempoBooking = openTempoBooking;
window.bookPilgrimage = bookPilgrimage;
window.closeToast = closeToast;
window.showToast = showToast;
window.resolveLocationInput = resolveLocationInput;

// Bind new advanced features
window.toggleThemeMode = toggleThemeMode;
window.toggleOfflineMode = toggleOfflineMode;
window.toggleSimulateError = toggleSimulateError;
window.toggleEmptyStates = toggleEmptyStates;
window.toggleWomensSafetyMode = toggleWomensSafetyMode;
window.toggleTripProtection = toggleTripProtection;
window.toggleSchedulePicker = toggleSchedulePicker;
window.confirmScheduleRide = confirmScheduleRide;
window.cancelScheduledRide = cancelScheduledRide;
window.openSplitFareModal = openSplitFareModal;
window.copySplitFareLink = copySplitFareLink;
window.closeSplitFareModal = closeSplitFareModal;
window.startVoiceSearch = startVoiceSearch;
window.closeVoiceSearch = closeVoiceSearch;
window.sendQuickReply = sendQuickReply;
window.closeSystemErrorOverlay = closeSystemErrorOverlay;
window.toggleDirectionsPanel = toggleDirectionsPanel;
window.nextNavigationStep = nextNavigationStep;
window.prevNavigationStep = prevNavigationStep;
window.toggleMapStyleSelector = toggleMapStyleSelector;
window.changeMapStyle = changeMapStyle;
window.goBack = goBack;
window.triggerSearchRoute = triggerSearchRoute;
window.triggerSmartSuggestionRide = triggerSmartSuggestionRide;
window.toggleFavoriteCurrentDriver = toggleFavoriteCurrentDriver;
window.toggleBlockCurrentDriver = toggleBlockCurrentDriver;
window.removeDriverPref = removeDriverPref;
window.triggerHaptic = triggerHaptic;

// Religion-Based Dynamic Theming System functions & bindings
function selectReligion(religion) {
    const cards = document.querySelectorAll('#screen-register .religion-card');
    cards.forEach(card => {
        if (card.getAttribute('data-religion') === religion) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    const input = document.getElementById('reg-religion');
    if (input) {
        input.value = religion;
    }
    triggerHaptic('success');
}

function applyReligionTheme(religion) {
    if (!religion) return;
    appState.userProfile.religion = religion;
    localStorage.setItem('safarsetu-religion-theme', religion);

    const appScreenContainer = document.getElementById('app-screen-container');
    if (appScreenContainer) {
        const themes = ['theme-hindu', 'theme-muslim', 'theme-sikh', 'theme-christian', 'theme-buddhist', 'theme-jain'];
        themes.forEach(t => appScreenContainer.classList.remove(t));
        appScreenContainer.classList.add(`theme-${religion.toLowerCase()}`);
    }

    const swatches = document.querySelectorAll('.theme-swatch');
    swatches.forEach(swatch => {
        if (swatch.id === `swatch-${religion}`) {
            swatch.classList.add('active');
        } else {
            swatch.classList.remove('active');
        }
    });

    const cards = document.querySelectorAll('#screen-register .religion-card');
    cards.forEach(card => {
        if (card.getAttribute('data-religion') === religion) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    const regReligionInput = document.getElementById('reg-religion');
    if (regReligionInput) {
        regReligionInput.value = religion;
    }

    updateDynamicUserElements();
    checkFestivalAutoSuggest();
}

function changeAppTheme(religion) {
    applyReligionTheme(religion);
    showToast('Theme Changed', `Theme updated to ${religion}!`, false);
    triggerHaptic('confirmed');
}

function checkFestivalAutoSuggest() {
    const banner = document.getElementById('festival-suggest-banner');
    if (!banner) return;

    if (!appState.festivalAutoSuggest || appState.activeFestival === 'none') {
        banner.classList.add('hidden');
        return;
    }

    const festivalMap = {
        chhath: { religion: 'Hindu', icon: '☀️', title: 'Chhath Puja Special', desc: 'Switch to Bhagwa (Hindu) theme for Chhath Puja?' },
        durga: { religion: 'Hindu', icon: '🪔', title: 'Durga Puja Special', desc: 'Switch to Bhagwa (Hindu) theme for Durga Puja?' },
        shaadi: { religion: 'Hindu', icon: '🎺', title: 'Shaadi Season', desc: 'Switch to Bhagwa (Hindu) theme for weddings?' },
        eid: { religion: 'Muslim', icon: '🌙', title: 'Eid Mubarak! 🌙', desc: 'Switch to Sabz (Muslim) theme for Eid?' },
        gurpurab: { religion: 'Sikh', icon: '☬', title: 'Happy Gurpurab!', desc: 'Switch to Basanti (Sikh) theme for Gurpurab?' },
        christmas: { religion: 'Christian', icon: '🎄', title: 'Merry Christmas!', desc: 'Switch to Royal (Christian) theme for Christmas?' }
    };

    const festData = festivalMap[appState.activeFestival];
    if (!festData) {
        banner.classList.add('hidden');
        return;
    }

    const currentReligion = appState.userProfile.religion || 'Hindu';
    if (currentReligion === festData.religion) {
        banner.classList.add('hidden');
        return;
    }

    const iconEl = banner.querySelector('.festival-banner-icon');
    const titleEl = document.getElementById('fest-banner-title');
    const descEl = document.getElementById('fest-banner-desc');
    const applyBtn = document.getElementById('fest-btn-apply-theme');

    if (iconEl) iconEl.innerText = festData.icon;
    if (titleEl) titleEl.innerText = festData.title;
    if (descEl) descEl.innerText = festData.desc;

    if (applyBtn) {
        applyBtn.onclick = () => {
            changeAppTheme(festData.religion);
            banner.classList.add('hidden');
        };
    }

    banner.classList.remove('hidden');
}

function dismissFestivalBanner() {
    const banner = document.getElementById('festival-suggest-banner');
    if (banner) {
        banner.classList.add('hidden');
    }
    triggerHaptic('success');
}

function playSplashAnimation() {
    const container = document.getElementById('splash-theme-animation-container');
    if (!container) return;
    
    const religion = appState.userProfile.religion || 'Hindu';
    
    let svgHtml = '';
    if (religion === 'Hindu') {
        svgHtml = `
            <svg viewBox="0 0 100 100" class="splash-theme-svg animate-diya">
                <path d="M20,50 Q50,90 80,50 Q80,45 70,45 Q50,60 30,45 Q20,45 20,50 Z" fill="#FF6600" />
                <path d="M30,45 Q50,55 70,45 C70,45 60,35 50,35 C40,35 30,45 30,45 Z" fill="#FFB300" opacity="0.8" />
                <path class="diya-flame" d="M50,35 C42,25 45,10 50,0 C55,10 58,25 50,35 Z" fill="#CC2200" />
            </svg>
        `;
    } else if (religion === 'Muslim') {
        svgHtml = `
            <svg viewBox="0 0 100 100" class="splash-theme-svg animate-crescent">
                <path d="M60,20 A30,30 0 1,0 80,60 A36,36 0 1,1 60,20 Z" fill="#C9A84C" />
                <polygon points="65,25 68,32 75,32 70,37 72,44 65,40 58,44 60,37 55,32 62,32" fill="#FFF" />
            </svg>
        `;
    } else if (religion === 'Sikh') {
        svgHtml = `
            <svg viewBox="0 0 100 100" class="splash-theme-svg animate-khanda">
                <g fill="none" stroke="#F5A623" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M50,15 L50,85 M45,70 L55,70 M40,80 L60,80" stroke-width="6" />
                    <circle cx="50" cy="50" r="18" stroke-width="5" />
                    <path d="M30,35 Q18,60 38,78 Q22,58 30,35 Z" fill="#F5A623" />
                    <path d="M70,35 Q82,60 62,78 Q78,58 70,35 Z" fill="#F5A623" />
                </g>
            </svg>
        `;
    } else if (religion === 'Christian') {
        svgHtml = `
            <svg viewBox="0 0 100 100" class="splash-theme-svg animate-cross">
                <g stroke="#3A62C4" stroke-width="1.5" opacity="0.6">
                    <line x1="50" y1="50" x2="50" y2="10" />
                    <line x1="50" y1="50" x2="50" y2="90" />
                    <line x1="50" y1="50" x2="10" y2="50" />
                    <line x1="50" y1="50" x2="90" y2="50" />
                    <line x1="50" y1="50" x2="20" y2="20" />
                    <line x1="50" y1="50" x2="80" y2="80" />
                    <line x1="50" y1="50" x2="20" y2="80" />
                    <line x1="50" y1="50" x2="80" y2="20" />
                </g>
                <path d="M45,25 H55 V40 H70 V50 H55 V85 H45 V50 H30 V40 H45 Z" fill="#1A3C8F" stroke="#C9A84C" stroke-width="2" />
            </svg>
        `;
    } else if (religion === 'Buddhist') {
        svgHtml = `
            <svg viewBox="0 0 100 100" class="splash-theme-svg animate-lotus">
                <g fill="#E8820C" opacity="0.9">
                    <path d="M50,40 C35,20 20,40 50,80 C80,40 65,20 50,40 Z" />
                    <path d="M50,50 C25,35 15,60 50,80 C85,60 75,35 50,50 Z" fill="#7B2D2D" />
                    <path d="M50,60 C40,50 35,65 50,80 C65,65 60,50 50,60 Z" fill="#D4AF37" />
                </g>
            </svg>
        `;
    } else if (religion === 'Jain') {
        svgHtml = `
            <svg viewBox="0 0 100 100" class="splash-theme-svg animate-mandala">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#C9A84C" stroke-width="2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#6B1A1A" stroke-width="1.5" />
                <g stroke="#C9A84C" stroke-width="1">
                    <path d="M50,10 C45,30 55,30 50,90" fill="none" />
                    <path d="M10,50 C30,45 30,55 90,50" fill="none" />
                    <path d="M22,22 C38,38 42,32 78,78" fill="none" />
                    <path d="M22,78 C38,62 42,68 78,22" fill="none" />
                </g>
                <circle cx="50" cy="50" r="8" fill="#C9A84C" />
            </svg>
        `;
    }
    
    container.innerHTML = svgHtml;
}

window.selectReligion = selectReligion;
window.applyReligionTheme = applyReligionTheme;
window.changeAppTheme = changeAppTheme;
window.checkFestivalAutoSuggest = checkFestivalAutoSuggest;
window.dismissFestivalBanner = dismissFestivalBanner;
window.playSplashAnimation = playSplashAnimation;

