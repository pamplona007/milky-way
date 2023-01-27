export const toAstronomicUnit = (value, unit = 'km') => {
    switch (unit) {
        case 'km':
            return value / 149597870.7;
        case 'm':
            return value / 149597870700;
        case 'au':
            return value;
        default:
            return value;
    }
};

export const toKilometers = (value, unit = 'km') => {
    switch (unit) {
        case 'km':
            return value;
        case 'm':
            return value / 1000;
        case 'au':
            return value * 149597870.7;
        default:
            return value;
    }
};
