

document.addEventListener('DOMContentLoaded', function() {

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                

                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    

    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            

            alert('پیام شما با موفقیت ارسال شد! به زودی با شما تماس خواهم گرفت.');
            this.reset();
        });
    }
    

    const contactBtn = document.getElementById('contactBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    

    const elementsToAnimate = document.querySelectorAll('.project-card, .service-card, .skill-category');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
    

    const video = document.getElementById('bgVideo');
    if (video) {
        video.addEventListener('error', function() {
            console.log('Video failed to load, using fallback background');
            document.querySelector('.video-bg-container').style.background = 'linear-gradient(135deg, var(--primary-light), #E8F5E9)';
        });
    }
    

    const floatElements = document.querySelectorAll('.float-element');
    floatElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
        });
    });
    

    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0';
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 300);
            }
        });
    }, { threshold: 0.5 });
    
    skillProgressBars.forEach(bar => {
        skillsObserver.observe(bar);
    });
});