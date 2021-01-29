module.exports = {
    upperCasing: (text) => {
        text = text.toLowerCase().split(' ')
        return text.map(el => el.charAt(0).toUpperCase() + el.substring(1)).join(' ')
    },
    month: (id) => {
        const month = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]
        return month[id]
    }
}