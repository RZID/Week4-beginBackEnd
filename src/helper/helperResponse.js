const Moment = require('moment')
module.exports = {
    noContent: (res) => {
        return res.json({
            statusCode: 204,
            statusMsg: "No Content",
            message: "Returning 0 Result"
        })
    },
    success: (res, data, page, totalRows, limit, filtered) => {
        return res.json({
            statusCode: 200,
            statusMsg: "OK",
            data: {
                page: page,
                totalRows: totalRows,
                filteredData: filtered,
                limit: limit,
                data: data
            }
        })
    },
    internalError: (res, errMsg) => {
        return res.json({
            statusCode: 500,
            statusMsg: "Error Occoured",
            errorMsg: errMsg
        })
    },
    inputError: (res, errMsg) => {
        return res.json({
            statusCode: 422,
            statusMsg: "Unprocessable Entity",
            errorMsg: errMsg
        })
    },
    unauthenticated: (res) => {
        return res.json({
            statusCode: 401,
            statusMsg: "Unauthorized"
        })
    },
    notAccept: (res, message) => {
        return res.json({
            statusCode: 406,
            statusMsg: "Not Acceptable",
            message: message
        })
    },
    created: (res, message) => {
        return res.json({
            statusCode: 201,
            statusMsg: "Created",
            message: message
        })
    },
    conflict: (res, message) => {
        return res.json({
            statusCode: 409,
            statusMsg: "Conflict",
            message: message
        })
    },
    accepted: (res, message, token) => {
        return res.json({
            statusCode: 202,
            statusMsg: "Accepted",
            message: message,
            token: token
        })
    },
    tooLarge: (res, message) => {
        return res.json({
            statusCode: 413,
            statusMsg: "Payload Too Large",
            message: message,
        })
    },
    notAllowed: (res, message) => {
        return res.json({
            statusCode: 405,
            statusMsg: "Method Not Allowed",
            message: message,
        })
    }
}