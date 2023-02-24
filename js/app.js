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

// Validate form
const element = document.getElementById('phone')
const maskOptions = { mask: '+{7}(000)000-00-00' }
const mask = IMask(element, maskOptions)

const validator = new JustValidate('#form', {
    validateBeforeSubmitting: true,
}, [
    {
        key: 'Поле имя обязательное',
        dict: {
            en: 'Name is required'
        },
    },
    {
        key: 'Слишком короткое имя',
        dict: {
            en: 'Name is too short'
        },
    },
    {
        key: 'Слишком длинное имя',
        dict: {
            en: 'Name is too long'
        },
    },
    {
        key: 'Поле email обязательное',
        dict: {
            en: 'Email is required'
        },
    },
    {
        key: 'Email недействителен',
        dict: {
            en: 'Email is invalid'
        },
    },
    {
        key: 'Это поле обязательное',
        dict: {
            en: 'This field is required'
        },
    },
    {
        key: 'Поле должно содержать минимум 4 символов',
        dict: {
            en: 'The field must contain at least 4 characters'
        },
    },
])

validator.addField('#name', [
    {
        rule: 'required',
        errorMessage: 'Поле имя обязательное',
    },
    {
        rule: 'minLength',
        value: 3,
        errorMessage: 'Слишком короткое имя',
    },
    {
        rule: 'maxLength',
        value: 15,
        errorMessage: 'Слишком длинное имя',
    },
])
    .addField('#email', [
        {
            rule: 'required',
            errorMessage: 'Поле email обязательное',
        },
        {
            rule: 'email',
            errorMessage: 'Email недействителен',
        },
    ])
    .addField('#subject', [
        {
            rule: 'required',
            errorMessage: 'Это поле обязательное',
        },
        {
            rule: 'minLength',
            value: 4,
            errorMessage: 'Поле должно содержать минимум 4 символов',
        },
    ])
    .addField('#phone', [
        {
            rule: 'required',
            errorMessage: 'Это поле обязательное',
        },
    ])

validator.setCurrentLocale()


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
            hash === 'en' ? validator.setCurrentLocale('en') : validator.setCurrentLocale()
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

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelector('.preloader').style.display = 'none'
    }, 1000)
})

changeLanguage()

// Load fonts after page load
const loadLater = document.querySelector('.loadLater')
const head = document.querySelector('head')
if (loadLater && head) {
    head.insertAdjacentHTML('beforeend', loadLater.innerHTML)
}


// Form submit

const formEl = document.querySelector('#form')
formEl.addEventListener('submit', async (evt) => {
    evt.preventDefault()

    await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: new FormData(form),
    })
        .then((data) => {
            console.log(data, 'Данные успешно отправлены!')
            form.reset()
        })
        .catch((err) => {
            throw err
        })
})