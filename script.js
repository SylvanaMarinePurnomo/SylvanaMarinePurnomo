document.addEventListener('DOMContentLoaded', () => {

            const canvas = document.getElementById('star-canvas');
            const ctx = canvas.getContext('2d');
            let stars = [];
            let animationFrameId;

            function setCanvasSize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            function createStars() {
                stars = [];
                const starCount = Math.floor(canvas.width * canvas.height / 3000);
                for (let i = 0; i < starCount; i++) {
                    stars.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 1.2,
                        vx: (Math.random() - 0.5) / 4,
                        vy: (Math.random() - 0.5) / 4,
                        opacity: Math.random() * 0.5 + 0.3
                    });
                }
            }

            function drawStars() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#e0e0e0';
                
                stars.forEach(star => {
                    ctx.beginPath();
                    ctx.globalAlpha = star.opacity;
                    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                    ctx.fill();
                    
                    star.x += star.vx;
                    star.y += star.vy;
                    
                    if (star.x < 0 || star.x > canvas.width) star.vx = -star.vx;
                    if (star.y < 0 || star.y > canvas.height) star.vy = -star.vy;
                });
            }

            function animate() {
                drawStars();
                animationFrameId = requestAnimationFrame(animate);
            }

            function init() {
                setCanvasSize();
                createStars();
                if(animationFrameId) cancelAnimationFrame(animationFrameId);
                animate();
            }

            init();
            window.addEventListener('resize', init);

            // Granular Fade-In/Out Observer Setup
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1 // Element is considered 'visible' when 20% of it is in the viewport
            };
            
            const itemObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    } else {
                        // Fade out when scrolling away
                        entry.target.classList.remove('is-visible');
                    }
                });
            }, observerOptions);

            const allScrollItems = document.querySelectorAll('.fade-in-section, .scroll-item-fade');
            
            allScrollItems.forEach(item => {
                itemObserver.observe(item);
            });
            
            // Initial load fade for home section (guarantee it shows up first)
            const homeSection = document.querySelector('#home .fade-in-section');
            if (homeSection) {
                // Ensure home content is visible immediately without scrolling
                homeSection.classList.add('is-visible');
            }
            
            // Navigation link highlighting
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('main section');
            const navObserverOptions = {
                rootMargin: '-50% 0px -50% 0px'
            };
            const navObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting){
                        const id = entry.target.getAttribute('id');
                        navLinks.forEach(link => {
                            link.classList.remove('nav-link-active');
                            if(link.getAttribute('href') === `#${id}`){
                                link.classList.add('nav-link-active');
                            }
                        });
                    }
                });
            }, navObserverOptions);

            sections.forEach(section => {
                navObserver.observe(section);
            });

            // Header visibility control (hide on scroll down, show on scroll up)
            const header = document.getElementById('header');
            let lastScrollTop = 0;
            window.addEventListener('scroll', () => {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                    if (scrollTop > 50) {
                        header.classList.add('py-2');
                        header.classList.remove('py-4');
                    } else {
                         header.classList.remove('py-2');
                         header.classList.add('py-4');
                    }
                }
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            });

            // Mobile menu logic
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuLinks = document.querySelectorAll('.nav-link-mobile');
            
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
                // Toggle animation for the menu icon itself
                const lines = mobileMenuBtn.children;
                if (mobileMenu.classList.contains('open')) {
                    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                    lines[1].style.opacity = '0';
                    lines[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
                } else {
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                }
            });
            
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                    // Reset menu icon when a link is clicked
                    const lines = mobileMenuBtn.children;
                    lines[0].style.transform = 'none';
                    lines[1].style.opacity = '1';
                    lines[2].style.transform = 'none';
                });
            });
        });