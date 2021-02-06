module.exports = {
    noContent: (res) => {
        return res.status(204).json({
            statusCode: 204,
            statusMsg: "No Content",
            message: "Returning 0 Result"
        })
    },
    success: (res, data, page, totalRows, limit, filtered) => {
        return res.status(200).json({
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
        return res.status(500).json({
            statusCode: 500,
            statusMsg: "Error Occoured",
            message: errMsg
        })
    },
    inputError: (res, errMsg) => {
        return res.status(422).json({
            statusCode: 422,
            statusMsg: "Unprocessable Entity",
            message: errMsg
        })
    },
    unauthenticated: (res) => {
        return res.status(401).json({
            statusCode: 401,
            statusMsg: "Unauthorized"
        })
    },
    notAccept: (res, message) => {
        return res.status(406).json({
            statusCode: 406,
            statusMsg: "Not Acceptable",
            message: message
        })
    },
    created: (res, message) => {
        return res.status(201).json({
            statusCode: 201,
            statusMsg: "Created",
            message: message
        })
    },
    conflict: (res, message) => {
        return res.status(409).json({
            statusCode: 409,
            statusMsg: "Conflict",
            message: message
        })
    },
    accepted: (res, message, token, name, role) => {
        return res.status(202).json({
            statusCode: 202,
            statusMsg: "Accepted",
            message: message,
            token: token,
            name: name,
            role: role
        })
    },
    tooLarge: (res, message) => {
        return res.status(413).json({
            statusCode: 413,
            statusMsg: "Payload Too Large",
            message: message,
        })
    },
    notAllowed: (res, message) => {
        return res.status(405).json({
            statusCode: 405,
            statusMsg: "Method Not Allowed",
            message: message,
        })
    }
}