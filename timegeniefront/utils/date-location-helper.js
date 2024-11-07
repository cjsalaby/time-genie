import {parseISO} from "date-fns";
import {format, utcToZonedTime} from "date-fns-tz";

const formatDate = (dateString) => {
    const parseDate = parseISO(dateString);
    const zoneDate = utcToZonedTime(parseDate, 'UTC');
    return format(zoneDate, 'hh:mm:ss a, yyyy-MM-dd', 'UTC');
};

const formatLocation = (location) => {
    if (location === null || location === undefined) {
        return 'N/A';
    }
    return parseFloat(location.toFixed(7));
}

module.exports = {
    formatDate,
    formatLocation
}
