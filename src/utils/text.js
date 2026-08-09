export function cleanText(value) {
    return value
        .trim()
        .replace(/\s+/g, ' ')
}

export function normalizeText(value) {
    return cleanText(value)
        .toLocaleLowerCase('ru-RU')
}

export function capitalizeText(value) {
    const cleaned = cleanText(value)

    if (cleaned === '') {
        return ''
    }

    return (
        cleaned[0].toLocaleUpperCase('ru-RU') +
        cleaned.slice(1)
    )
}