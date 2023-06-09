exports.isJsonParsable = (string) => {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
}

exports.isFloatParseble = (value) => {
    try {
        parseFloat(value);
    } catch (e) {
        return false;
    }
    return true;
}