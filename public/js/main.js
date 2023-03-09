(function () {
    const form = document.forms[0]
    const input = document.getElementById('url')
    const message = document.querySelector('.message')
    const button = document.querySelector('.button')
    const HIDDEN_CLASS = 'hidden'
    const MESSAGE_CLASS = 'message'
    const BUTTON_TEXT = 'Отправить'
    const BUTTON_TEXT_LOADING = 'Сохраняем...'

    let messageTimerId = null

    const messageTypes = {
        error: 'error',
        info: 'info'
    }

    const messageCssClass = {
        [messageTypes.error]: `${MESSAGE_CLASS}--error`,
        [messageTypes.info]: `${MESSAGE_CLASS}--info`
    }

    let currentPage = 1
    let rows = 3

    function displayList(rowsPerPage, page){
        const urlsElements = document.querySelector('.output-group')
        urlsElements.innerHTML = ''

        const xhr = new XMLHttpRequest()

        xhr.open('GET', `/api/?page=${page}&limit=${rowsPerPage}`, true)
        xhr.setRequestHeader('Content-type', 'application/json charset=utf-8')
        xhr.onload = function() {
            const data = JSON.parse(this.response)
            if (!data.urls){
                showMessage({ text: 'Ошибка' })
            } else {
                data.urls.forEach((el) => {
                    const urlElement = document.createElement('div')
                    urlElement.classList.add('urls-row')

                    const originalUrl = document.createElement('div')
                    originalUrl.classList.add('.original-url')
                    originalUrl.innerHTML = `${el.originalUrl}`

                    const shortUrl = document.createElement('div')
                    shortUrl.classList.add('.short-url')
                    shortUrl.innerHTML = `${el.shortLink}`

                    urlElement.appendChild(originalUrl)
                    urlElement.appendChild(shortUrl)
                    urlsElements.appendChild(urlElement)
                })
                displayPagination(data.urls, data.totalPages )
            }
        }
        xhr.onerror = function() {
            showMessage({ text: 'Ошибка' })
        }
        xhr.send()
    }

    function displayPagination(data, pagesCount){
        const urlsElements = document.querySelector('.output-group')
        const ulEl = document.createElement('ul')
        ulEl.classList.add('pagination__list')

        for (let i = 0; i < pagesCount; i++) {
            const liEl = displayPaginationBtn(i + 1)
            ulEl.appendChild(liEl)
        }
        urlsElements.appendChild(ulEl)
    }

    function displayPaginationBtn(page){
        const liEl = document.createElement('li')
        liEl.classList.add('pagination__item')
        liEl.innerText = page

        if (currentPage === page) liEl.classList.add('pagination__item--active')

        liEl.addEventListener('click', () => {
            currentPage = page
            const currentActive = document.querySelector('li.pagination__item--active')
            currentActive.classList.remove('pagination__item--active')
            liEl.classList.add('pagination__item--active')
            displayList(rows, page)
        })

        return liEl
    }

    function isValidUrl(url) {
        const urlRegExp = /^(http[s]?:\/\/)(www\.){0,1}[a-zA-Z0-9\.\-]+(\.[a-zA-Z]{2,5}){0,1}[\.]{0,1}([:][0-9]{2,5}){0,1}/
        return urlRegExp.test(url)
    }

    function showMessage(params) {
        const cssClass = messageCssClass[params.type] || messageCssClass.error
        message.innerHTML = params.text || 'Ошибка!'
        message.classList.add(cssClass)
        message.classList.remove(HIDDEN_CLASS)

        if (cssClass === messageCssClass.error) {
            hideMessage()
        }
    }

    function hideMessage() {
        messageTimerId = setTimeout(function() {
            message.classList.add(HIDDEN_CLASS)
        }, 3000)
    }

    function toggleButtonState(isLoading) {
        const isDisabled = isLoading || false
        button.innerHTML = isLoading ? BUTTON_TEXT_LOADING : BUTTON_TEXT
        button.disabled = isDisabled
    }

    function handleResponse(response) {
        input.value = ''
        toggleButtonState()
        const { shortLink } = JSON.parse(response)
        showMessage({ type: messageTypes.info, text: shortLink })
    }

    function sendRequest(url) {
        const xhr = new XMLHttpRequest()
        const body = JSON.stringify({ "longUrl": url })
        toggleButtonState(true)

        xhr.open('POST', '/api/', true)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
        xhr.onload = function() {
            handleResponse(this.response)
            displayList(rows, currentPage)
        }
        xhr.onerror = function() {
            toggleButtonState()
            showMessage({ text: 'Невозможно выполнить запрос' })
        }
        xhr.send(body)
    }

    function handleSubmitForm(e) {
        e.preventDefault()
        message.classList.add(HIDDEN_CLASS)
        message.classList.remove(messageCssClass[messageTypes.error])
        message.classList.remove(messageCssClass[messageTypes.info])

        const longUrl = input.value

        if (messageTimerId) {
            clearTimeout(messageTimerId)
            messageTimerId = null
        }

        if (!longUrl) {
            showMessage({ text: 'Введите адрес ссылки' })
            return
        }

        if (!isValidUrl(longUrl)) {
            showMessage({ text: 'Введите корректный адрес ссылки' })
            return
        }

        sendRequest(longUrl)
    }

    function initEvents() {
        form && form.addEventListener('submit', handleSubmitForm)
        displayList(rows, currentPage)
    }

    function init() {
        initEvents()
    }

    init()
})()