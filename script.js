// --- Mobile Menu Toggle ---
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x'); // Icon badal kar 'X' ho jayega
    navbar.classList.toggle('active'); // Menu khul jayega
};

// --- PART 1: Active Link & Scroll Handling ---
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.navbar a');
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

// Optimization: Pre-calculate nav links map to avoid querySelector in loop
const navLinksMap = new Map();
navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
        const id = href.substring(1); // Remove '#'
        navLinksMap.set(id, link);
    }
});

let currentActiveSectionId = null;

window.onscroll = () => {
    // Current Scroll Position
    let top = window.scrollY;

    // --- Merged Mobile Menu Toggle Logic ---
    // Ensure menu closes on scroll
    if (menuIcon.classList.contains('bx-x')) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    }

    // --- Active Link Logic (Optimized) ---
    let newActiveSectionId = null;

    // Find the currently active section
    // We use a for loop to break early once the active section is found
    for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            newActiveSectionId = id;
            break;
        }
    }

    // Only update DOM if the active section changes and a new section is actually found
    // (This matches original behavior where no update happened if no section matched)
    if (newActiveSectionId && newActiveSectionId !== currentActiveSectionId) {
        // Remove active class from all links (safest approach to clean state)
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to the new active link
        if (navLinksMap.has(newActiveSectionId)) {
            navLinksMap.get(newActiveSectionId).classList.add('active');
        }

        currentActiveSectionId = newActiveSectionId;
    }

    // Header Hide/Show Logic
    if (top < 50) {
        header.classList.remove('hidden');
    } else if (top > lastScrollY) {
        header.classList.add('hidden'); // Scroll Down -> Hide
    } else {
        header.classList.remove('hidden'); // Scroll Up -> Show
    }
    lastScrollY = top;
};

// --- PART 2: Contact Form Handling (No Redirect) ---
const contactForm = document.getElementById('contactForm');

if (contactForm) { // Check karte hain ki form exist karta hai ya nahi
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // PAGE RELOAD HONE SE ROKEGA

        // Button text change "Sending..."
        const submitBtn = contactForm.querySelector('.btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                alert("Success! Message sent to Harsh Panwar.");
                contactForm.reset(); // Form clear karo
            } else {
                console.log(response);
                alert("Something went wrong! Please try again.");
            }
        })
        .catch(error => {
            console.log(error);
            alert("Something went wrong!");
        })
        .then(function() {
            submitBtn.innerText = originalText; // Button text wapas normal
        });
    });
}
