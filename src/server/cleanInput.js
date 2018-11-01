import sanitizeHtml from 'sanitize-html'

const cleanInput = (input, defaultVal = '') => {
    const value = sanitizeHtml(input, {
        allowedTags: []
    })
    return value || defaultVal
}

export default cleanInput
