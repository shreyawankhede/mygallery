/**
 * Premium Image Gallery Script
 * Handles dynamic content, filtering, lightbox, and theme switching.
 */

// 1. Gallery Data Structure
const galleryData = [
    { id: 1, src: 'images/image2.jpg', title: 'Mountain Peak', category: 'landscape' },
    { id: 2, src: 'images/image3.jpg', title: 'Deep Forest', category: 'nature' },
    { id: 3, src: 'images/image4.jpg', title: 'Elephant Walk', category: 'wildlife' },
    { id: 4, src: 'images/image5.jpg', title: 'Golden Sunset', category: 'landscape' },
    { id: 5, src: 'images/image6.jpg', title: 'Majestic Eagle', category: 'wildlife' },
    { id: 6, src: 'images/image7.jpg', title: 'Dew Drop', category: 'nature' },
    { id: 7, src: 'images/image8.jpg', title: 'Lion King', category: 'wildlife' },
    { id: 8, src: 'images/image9.jpg', title: 'Quiet River', category: 'landscape' },
    { id: 9, src: 'images/image10.jpg', title: 'Autumn Leaves', category: 'nature' },
    { id: 10, src: 'images/image11.jpg', title: 'Snowy owl', category: 'wildlife' },
    { id: 11, src: 'images/image12.jpg', title: 'Desert Dunes', category: 'landscape' },
    { id: 12, src: 'images/image13.jpg', title: 'Hummingbird', category: 'wildlife' },
    { id: 13, src: 'images/image14.jpg', title: 'Green Valley', category: 'landscape' },
    { id: 14, src: 'images/image15.jpg', title: 'Golden Retriever', category: 'wildlife' }
];

// State Management
let currentFilter = 'all';
let currentIndex = 0;
let filteredItems = [...galleryData];

// DOM Elements
const galleryGrid = document.getElementById('gallery-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('theme-toggle');
const typingText = document.getElementById('typing-text');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// 2. Initialize Gallery
function initGallery() {
    renderGallery();
    setupFilters();
    setupTheme();
    setupLightbox();
    setupTypingEffect();
    setupContactForm();
}

// 3. Render Gallery Items
function renderGallery() {
    // Clear current grid
    galleryGrid.innerHTML = '';

    // Filter data
    filteredItems = currentFilter === 'all'
        ? galleryData
        : galleryData.filter(item => item.category === currentFilter);

    if (filteredItems.length === 0) {
        galleryGrid.innerHTML = '<p class="no-items">No images found for this category.</p>';
        return;
    }

    // Create fragments for performance
    const fragment = document.createDocumentFragment();

    filteredItems.forEach((item, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-id', item.id);

        galleryItem.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <h3 class="gallery-item-title">${item.title}</h3>
                <p class="gallery-item-category">${item.category}</p>
            </div>
        `;

        galleryItem.addEventListener('click', () => openLightbox(index));
        fragment.appendChild(galleryItem);
    });

    galleryGrid.appendChild(fragment);
}

// 4. Filter Functionality
function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update UI
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update State
            currentFilter = btn.getAttribute('data-filter');
            renderGallery();
        });
    });
}

// 5. Theme Switching
function setupTheme() {
    // Check for saved preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// 6. Lightbox (Modal) Logic
function setupLightbox() {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    // Close on overlay click
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function updateLightboxContent() {
    const item = filteredItems[currentIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxTitle.textContent = item.title;
    lightboxCategory.textContent = item.category;
    lightboxCounter.textContent = `${currentIndex + 1} / ${filteredItems.length}`;

    // Smooth transition effect for the image
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.style.opacity = '1';
    }, 50);
}

function showPrev() {
    currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    updateLightboxContent();
}

function showNext() {
    currentIndex = (currentIndex + 1) % filteredItems.length;
    updateLightboxContent();
}

// 7. Typing Effect
function setupTypingEffect() {
    const text = "Capturing the Essence of Nature";
    let i = 0;
    typingText.textContent = "";

    function type() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(type, 70);
        }
    }

    // Start effect after a small delay
    setTimeout(type, 500);
}

// 8. Contact Form Handling
function setupContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        
        // Show loading state
        btn.disabled = true;
        btn.textContent = 'Sending...';
        formStatus.textContent = 'Processing your request...';
        formStatus.style.color = 'var(--text-muted)';

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Send to FormSubmit
        fetch('https://formsubmit.co/ajax/wankhedeshreya75@gmail.com', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(data => {
            btn.textContent = originalText;
            btn.disabled = false;
            
            // Check if success (FormSubmit returns "true" as a string or boolean)
            if (data.success === "true" || data.success === true) {
                formStatus.textContent = 'Success! Please check tejaslandge21@gmail.com to activate if this was your first test.';
                formStatus.style.color = '#10b981';
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Submission failed');
            }
        })
        .catch(error => {
            console.error('Submission Error:', error);
            btn.textContent = originalText;
            btn.disabled = false;
            
            // Helpful error messages for common FormSubmit issues
            if (error.message && error.message.includes('activate')) {
                formStatus.textContent = 'Please check your email and click the confirmation link from FormSubmit first.';
            } else {
                formStatus.textContent = 'Could not send message. Please try again or check your activation email.';
            }
            formStatus.style.color = '#ef4444';
        })
        .finally(() => {
            // Keep message visible for 10 seconds for user to read activation info
            setTimeout(() => {
                if (formStatus.textContent.includes('email') || formStatus.textContent.includes('confirmation')) return; // Keep long if activation info
                formStatus.textContent = '';
            }, 10000);
        });
    });
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', initGallery);