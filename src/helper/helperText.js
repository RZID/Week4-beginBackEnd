module.exports = {
    upperCasing: (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1)
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