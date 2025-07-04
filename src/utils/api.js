const jsonify = (success, data, message) => {
    const response = {};

    // If specified as a success, return the correct data format
    if (data !== undefined && success === true) {
        response.data = data;
    }

    // If specified as an error, return the correct data format
    if (message !== undefined && success === false) {
        response.error = { message };
    }

    // Returns the completed response
    return response;
}

// Automatically fills in the necessary fields for an error
const error = (message) => {
    return jsonify(false, undefined, message);
}

// Automatically fills in the necessary fields for a success
const success = (data) => {
    return jsonify(true, data);
}

module.exports = { error, success }