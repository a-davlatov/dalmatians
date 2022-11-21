'use strict';

window.addEventListener('load', () => {

    // Fixed header
    const headerEl = document.querySelector('#header');
    const introEl = document.querySelector('#intro');
    const navEl = document.querySelector('#nav');
    const burgerEl = document.querySelector('#burger');
    let introH = introEl.clientHeight;
    let scrollPos = window.scrollY;

    checkScroll(scrollPos, introH);
    window.addEventListener('scroll', changeScrollPos);
    window.addEventListener('resize', changeScrollPos);

    function changeScrollPos() {
        introH = introEl.clientHeight;
        scrollPos = window.scrollY;

        checkScroll(scrollPos, introH);
    }

    function checkScroll(scrollPos, introH) {
        if (scrollPos > introH) {
            headerEl.classList.add('fixed');
            return;
        }
        headerEl.classList.remove('fixed');
    }

    // Smooth scroll
    const navLinks = document.querySelectorAll('[data-scroll]');
    navLinks.forEach((el) => {
        el.addEventListener('click', (evt) => {
            evt.preventDefault();

            const elementId = el.dataset.scroll;
            const elementOffset = document.getElementById(elementId).offsetTop;

            navEl.classList.remove('show');
            burgerEl.classList.remove('clicked');

            if (window.innerWidth <= 414) {
                window.scrollTo({
                    top: elementOffset - 56,
                    behavior: 'smooth'
                });
                return;
            }

            window.scrollTo({
                top: elementOffset,
                behavior: 'smooth'
            });
        });
    });

    // Nav toggle
    burgerEl.addEventListener('click', (evt) => {
        evt.preventDefault();
        burgerEl.classList.toggle('clicked');
        navEl.classList.toggle('show');
    });
});