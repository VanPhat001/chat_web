export default {
    fullName(account) {
        if (account) {
            return `${account.lastName} ${account.firstName}`
        }
        return ''
    },

    isImgUrl(url) {
        const img = new Image()
        img.src = url
        return new Promise((resolve) => {
            img.onload = () => resolve(true)
            img.onerror = () => resolve(false)
        })
    }
}