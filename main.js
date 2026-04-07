import './style.css'

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const mfgYearSelect = document.getElementById('mfg-year');
    const mfgMonthSelect = document.getElementById('mfg-month');
    const mfgDaySelect = document.getElementById('mfg-day');
    const mfgDateError = document.getElementById('mfg-date-error');

    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    const form = document.getElementById('calculator-form');
    const resultSection = document.getElementById('result');
    const resultContainer = document.getElementById('result-container');

    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const expiryDateDisplay = document.getElementById('expiry-date-display');
    const timeRemainingDisplay = document.getElementById('time-remaining-display');
    const daysCountDisplay = document.getElementById('days-count-display');

    // State
    let currentMode = 'duration'; // 'duration' or 'date'

    // Initialize
    initDateDropdowns();
    setupTabs();

    // Set Default Date (Today)
    const today = new Date();
    mfgMonthSelect.value = today.getMonth();
    mfgYearSelect.value = today.getFullYear();
    updateDays();
    mfgDaySelect.value = today.getDate();

    // Event Listeners
    mfgYearSelect.addEventListener('change', () => {
        updateDays();
        validateManufacturingDate();
    });
    mfgMonthSelect.addEventListener('change', () => {
        updateDays();
        validateManufacturingDate();
    });
    mfgDaySelect.addEventListener('change', validateManufacturingDate);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate manufacturing date before calculating
        if (!validateManufacturingDate()) {
            return;
        }

        calculateExpiry();
    });

    // --- Functions ---

    function initDateDropdowns() {
        // Years: 15 years back only (no future years allowed)
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 15; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            mfgYearSelect.appendChild(option);
        }
    }

    function updateDays() {
        const year = parseInt(mfgYearSelect.value);
        const month = parseInt(mfgMonthSelect.value);
        const currentDay = parseInt(mfgDaySelect.value);

        // Clear days
        mfgDaySelect.innerHTML = '<option value="">Unspecified</option>';

        if (isNaN(year) || isNaN(month)) return;

        // Days in month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Get today's date for comparison
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        const todayDate = today.getDate();

        // Determine maximum selectable day
        let maxDay = daysInMonth;
        if (year === currentYear && month === currentMonth) {
            maxDay = Math.min(daysInMonth, todayDate);
        }

        for (let i = 1; i <= maxDay; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            mfgDaySelect.appendChild(option);
        }

        // Try to restore previous day if valid
        if (currentDay && currentDay <= maxDay) {
            mfgDaySelect.value = currentDay;
        } else if (currentDay > maxDay) {
            // Reset to last available day
            mfgDaySelect.value = maxDay;
        }
    }

    function validateManufacturingDate() {
        const year = parseInt(mfgYearSelect.value);
        const month = parseInt(mfgMonthSelect.value);
        const day = mfgDaySelect.value === "" ? 1 : parseInt(mfgDaySelect.value);

        if (isNaN(year) || isNaN(month)) {
            hideError();
            return true; // Can't validate yet
        }

        const mfgDate = new Date(year, month, day);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        if (mfgDate > today) {
            showError();
            return false;
        }

        hideError();
        return true;
    }

    function showError() {
        mfgDateError.classList.add('visible');
        mfgYearSelect.parentElement.classList.add('error');
        mfgMonthSelect.parentElement.classList.add('error');
        if (mfgDaySelect.value !== "") {
            mfgDaySelect.parentElement.classList.add('error');
        }
    }

    function hideError() {
        mfgDateError.classList.remove('visible');
        mfgYearSelect.parentElement.classList.remove('error');
        mfgMonthSelect.parentElement.classList.remove('error');
        mfgDaySelect.parentElement.classList.remove('error');
    }

    function setupTabs() {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active
                tab.classList.add('active');
                const targetId = `tab-${tab.dataset.tab}`;
                document.getElementById(targetId).classList.add('active');

                currentMode = tab.dataset.tab;
            });
        });
    }

    function calculateExpiry() {
        // 1. Get MFG Date
        const year = parseInt(mfgYearSelect.value);
        const month = parseInt(mfgMonthSelect.value);
        const day = mfgDaySelect.value === "" ? 1 : parseInt(mfgDaySelect.value);

        if (isNaN(year) || isNaN(month)) {
            alert('Please select a Manufacturing Month and Year.');
            return;
        }

        const mfgDate = new Date(year, month, day);
        let expiryDate = new Date();

        // 2. Calculate Expiry based on Mode
        if (currentMode === 'duration') {
            const months = parseInt(document.getElementById('shelf-life-months').value);
            if (isNaN(months)) {
                alert('Please enter a valid shelf life in months.');
                return;
            }
            expiryDate = new Date(mfgDate);
            expiryDate.setMonth(expiryDate.getMonth() + months);
        } else {
            const dateInput = document.getElementById('specific-expiry-date').value;
            if (!dateInput) {
                alert('Please select a specific expiry date.');
                return;
            }
            expiryDate = new Date(dateInput);
        }

        // 3. Process Result
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const diffTime = expiryDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isExpired = diffDays < 0;

        // Show Result
        resultSection.classList.add('visible');

        // Formatting
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        expiryDateDisplay.textContent = expiryDate.toLocaleDateString('en-US', dateOptions);

        // Status Styling
        resultContainer.classList.remove('valid', 'expired');

        if (isExpired) {
            // EXPIRED
            resultContainer.classList.add('expired');
            statusText.textContent = 'Product Expired';
            statusIcon.textContent = '!';

            timeRemainingDisplay.textContent = 'Expired';

            // Days Since
            const absDays = Math.abs(diffDays);
            if (absDays < 30) {
                daysCountDisplay.textContent = `${absDays} days ago`;
            } else {
                const monthsAgo = (absDays / 30).toFixed(1);
                daysCountDisplay.textContent = `${monthsAgo} months ago`;
            }

        } else {
            // VALID
            resultContainer.classList.add('valid');
            statusText.textContent = 'Product Valid';
            statusIcon.textContent = '✓';

            const remainingMonths = (diffDays / 30).toFixed(1);
            timeRemainingDisplay.textContent = `${remainingMonths} months left`;

            daysCountDisplay.textContent = `${diffDays} days left`;
        }
    }
});
