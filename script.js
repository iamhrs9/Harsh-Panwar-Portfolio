// --- Mobile Menu Toggle ---
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x'); // Icon badal kar 'X' ho jayega
    navbar.classList.toggle('active'); // Menu khul jayega
};

// Scroll karne par menu band ho jaye
window.onscroll = () => {
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
    
    // ... Neeche purana scroll code chalega ...
};



// --- PART 1: Active Link & Scroll Handling ---
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.navbar a');
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.onscroll = () => {
    // Current Scroll Position
    let top = window.scrollY;

    // Active Link Logic
    sections.forEach(sec => {
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                let targetLink = document.querySelector('.navbar a[href*=' + id + ']');
                if (targetLink) { // Error prevention check
                    targetLink.classList.add('active');
                }
            });
        }
    });

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
/* =========================================
   SCROLL REVEAL ANIMATIONS
   ========================================= */
   
// Animation ki setting
ScrollReveal({ 
    // reset: true,  // Agar bar-bar animation chahiye toh ise uncomment karo
    distance: '80px', // Kitni door se udkar aayega
    duration: 2000,   // Kitna time lagega (2 seconds)
    delay: 200        // Thoda ruk kar start hoga
});

// === Koun kidhar se aayega ===

// Upar se neeche (Top to Bottom)
ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });

// Neeche se upar (Bottom to Top)
ScrollReveal().reveal('.home-img, .projects-container, .contact form', { origin: 'bottom' });

// Left se Right
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });

// Right se Left
ScrollReveal().reveal('.home-content p, .about-content', { origin: 'right' });