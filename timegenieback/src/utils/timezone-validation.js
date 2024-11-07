const isValidTimezone = (tz) => {
    try {
        Intl.DateTimeFormat(undefined, {
            timeZone: tz,
        })
        return true;

    } catch (e) {
        return false
    }
}

module.exports = {
    isValidTimezone,
}