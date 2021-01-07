module.exports = {
    toRupiah: (val) => {
        return val.toLocaleString('id', { style: 'currency', currency: 'IDR' }).replace(",00", ",-").replace("Rp", "Rp.")
    },
}