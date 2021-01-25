module.exports = {
    noContent: () => {
        return {
            statusCode: 204,
            statusMsg: "No Content",
            message: "Returning 0 Result"
        }
    },
    success: (data, page, totalRows, limit, filtered) => {
        return {
            statusCode: 200,
            statusMsg: "OK",
            data: {
                page: page,
                totalRows: totalRows,
                filteredData: filtered,
                limit: limit,
                data: data
            }
        }
    },
    internalError: (errMsg) => {
        return {
            statusCode: 500,
            statusMsg: "Error Occoured",
            errorMsg: errMsg
        }
    },
    inputError: (errMsg) => {
        return {
            statusCode: 422,
            statusMsg: "Unprocessable Entity",
            errorMsg: errMsg
        }
    }

}