'use strict'

// Fixed header
const headerEl = document.querySelector('#header')
const introEl = document.querySelector('#intro')
const navEl = document.querySelector('#nav')
const burgerEl = document.querySelector('#burger')
let introH = introEl.clientHeight
let scrollPos = window.scrollY

checkScroll(scrollPos, introH)
window.addEventListener('scroll', changeScrollPos)
window.addEventListener('resize', changeScrollPos)

function changeScrollPos() {
    introH = introEl.clientHeight
    scrollPos = window.scrollY

    checkScroll(scrollPos, introH)
}

function checkScroll(scrollPos, introH) {
    if (scrollPos > introH) {
        headerEl.classList.add('fixed')
        return
    }
    headerEl.classList.remove('fixed')
}

// Smooth scroll
const navLinks = document.querySelectorAll('[data-scroll]')
navLinks.forEach((el) => {
    el.addEventListener('click', (evt) => {
        evt.preventDefault()

        const elementId = el.dataset.scroll
        const elementOffset = document.getElementById(elementId).offsetTop

        navEl.classList.remove('show')
        burgerEl.classList.remove('clicked')

        if (window.innerWidth <= 414) {
            window.scrollTo({
                top: elementOffset - 56,
                behavior: 'smooth'
            })
            return
        }

        window.scrollTo({
            top: elementOffset,
            behavior: 'smooth'
        })
    })
})

// Nav toggle
burgerEl.addEventListener('click', (evt) => {
    evt.preventDefault()
    burgerEl.classList.toggle('clicked')
    navEl.classList.toggle('show')
})

// Change language
const allLangs = ['en', 'ru']
const selectEl = document.querySelector('select')
selectEl.addEventListener('change', changeURLLanguage)

function changeURLLanguage() {
    let lang = selectEl.value
    location.href = window.location.pathname + '#' + lang
    location.reload()
}

function changeLanguage() {
    let hash = window.location.hash
    hash = hash.slice(1)

    if (!allLangs.includes(hash)) {
        location.href = window.location.pathname + '#ru'
        location.reload()
        return
    }

    const url = 'lang.json'
    fetch(url)
        .then(response => response.json())
        .then((lang) => {

            const langArr = lang
            selectEl.value = hash
            document.querySelector('title').innerText = langArr['unit'][hash]
            document.querySelector('html').lang = hash

            for (let key in langArr) {
                const elem = document.querySelectorAll('.lng-' + key)
                if (elem) {
                    elem.forEach((el) => {
                        if (el.classList.contains('form__control')) {
                            el.placeholder = langArr[key][hash]
                        }
                        el.innerHTML = langArr[key][hash]
                    })
                }
            }
        })
}

changeLanguage()

// Load .loadLater content after page load
const loadLater = document.querySelector('.loadLater')
const head = document.querySelector('head')
if (loadLater && head) {
    head.insertAdjacentHTML('beforeend', loadLater.innerHTML)
}