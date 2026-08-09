function getHaptics() {
    return window.Telegram
        ?.WebApp
        ?.HapticFeedback
}


export function hapticLight() {
    getHaptics()
        ?.impactOccurred('light')
}


export function hapticMedium() {
    getHaptics()
        ?.impactOccurred('medium')
}


export function hapticSelection() {
    getHaptics()
        ?.selectionChanged()
}


export function hapticSuccess() {
    getHaptics()
        ?.notificationOccurred('success')
}


export function hapticWarning() {
    getHaptics()
        ?.notificationOccurred('warning')
}


export function hapticError() {
    getHaptics()
        ?.notificationOccurred('error')
}