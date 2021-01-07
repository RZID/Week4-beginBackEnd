const { md_getHistory, md_addHistory } = require("../model/mdHistory")
const { md_getProdHistory, md_getPrice } = require("../model/mdProduct")
const { month } = require("../helper/helperText")
const { toRupiah } = require("../helper/helperCurrency")

module.exports = {
    getHistory: (req, res) => {
        const search = req.body.where && req.body.whereVal ? `WHERE ${req.body.where} like %'${req.body.whereVal}%'` : ''
        const order = req.body.orderby && req.body.orderMethod ? `ORDER BY ${req.body.orderby} ${req.body.orderMethod}` : ''
        const page = req.query.page ? req.query.page : 1
        // Limit, if in body key limit exist, the valu will set to body.limit, else set to 3
        const limit = req.body.limit ? req.body.limit : 3
        // Offset, if page equal to 1, the offset will be start at 0 in limit key of array
        const offset = page === 1 ? 0 : (page - 1) * limit
        const limiter = `LIMIT ${offset},${limit}`

        md_getHistory(search, order, limiter).then(async (resolve) => {
            let arrData = []
            for (element of resolve) {
                const unique = (element.product_history).split(",").filter((el, i, self) => self.indexOf(el) === i)
                console.log(unique)
                const uniqueLength = (val) => (element.product_history).split(",").filter(el => el.indexOf(val) > -1).length
                const date = new Date(element.date_history * 1000)
                await md_getProdHistory(`WHERE id_product IN (${unique.join()})`).then(resolve => {
                    const namesOfProduct = resolve.map(el => { return `${el.name} x${uniqueLength(el.id)}` })
                    arrData.push({
                        id: element.id_history,
                        cashier: element.cashier_history,
                        date: `${date.getDate()} ${month(date.getMonth())} ${date.getFullYear()}`,
                        orders: namesOfProduct.join(", "),
                        amount: toRupiah(element.amount_history),
                    })
                }).catch(err => res.json(err.message))
            }
            res.json(arrData)
        }).catch(err => res.json({ error: err.message }))
    },
    addHistory: async (req, res) => {
        if (!req.body.cashier || !req.body.product) {
            res.json({ Error: `You must fill all of input!` })
        } else {
            const body = req.body
            let arrAmount = []
            const arrOfIdProduct = body.product.split(",")
            for (element of arrOfIdProduct) {
                await md_getPrice(element).then(resolve => arrAmount.push(resolve[0].price)).catch(err => res.json({ error: err.message }))
            }
            const price = arrAmount.reduce((a, b) => a + b)
            md_addHistory(body.cashier, body.product, price)
                .then(resolve => {
                    res.json({ success: `Inserted in id : ${resolve} ` })
                }).catch(err => res.json({ error: err.message }))
        }
    }
}