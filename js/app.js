'use strict'

// Fixed header
const headerEl = document.querySelector('#header')
const introEl = document.querySelector('#intro')
const navEl = document.querySelector('#nav')
const burgerEl = document.querySelector('#burger')
const formEl = document.querySelector('#form')
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
    {
        key: 'Это поле может содержать только буквы',
        dict: {
            en: 'This field can only contain letters'
        },
    },
    {
        key: 'Поле номер телефона обязательное',
        dict: {
            en: 'Phone number is required'
        },
    },
    {
        key: 'Введите пожалуйста корректный номер',
        dict: {
            en: 'Please enter a valid phone number'
        },
    },
])

validator.addField('#name', [
    {
        rule: 'required',
        errorMessage: 'Поле имя обязательное',
    },
    {
        rule: 'customRegexp',
        value: '[a-zA-Zа-яА-ЯёЁ]+',
        errorMessage: 'Это поле может содержать только буквы',
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
            rule: 'customRegexp',
            value: '[a-zA-Zа-яА-ЯёЁ]+',
            errorMessage: 'Это поле может содержать только буквы',
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
            errorMessage: 'Поле номер телефона обязательное',
        },
        {
            rule: 'minLength',
            value: 16,
            errorMessage: 'Введите пожалуйста корректный номер',
        },
    ])
    .onSuccess( async (evt) => {
        evt.preventDefault()

        const submitBtnEl = document.querySelector('#form-btn')
        submitBtnEl.disabled = true
        await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: new FormData(form),
        })
            .then((data) => {
                console.log('Данные успешно отправлены!')
                form.reset()
                submitBtnEl.disabled = false
            })
            .catch((err) => {
                throw err
            })
    })

validator.setCurrentLocale()

// Show more
function showMore(parentEl, itemsWrapperClass, itemClass, visibleItems) {
    const showMoreBtnEl = parentEl.querySelector('.show-more')
    const itemsLength = parentEl.querySelectorAll(itemClass).length
    let items = visibleItems
    
    showMoreBtnEl.addEventListener('click', () => {
        items += 2
        const array = Array.from(parentEl.querySelector(itemsWrapperClass).children)
        const visItems = array.slice(0, items)
    
        visItems.forEach(el => el.classList.add('is-visible'))
    
        if (visItems.length === itemsLength) {
            showMoreBtnEl.style.display = 'none'
        }
    })
}

document.querySelectorAll('.dogs__item').forEach(el => showMore(el, '.dogs__images', '.fslightbox-link', 1))
showMore(document.querySelector('#graduates'), '.graduates__wrapper', '.graduates__item', 3)

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