export function ConvertXp(number: number): string[] {
    let displayValue = `${ number }`;
    let unit = 'B'

    if (number >= 1000) {
        const totalXpInKb = number / 1000;
        displayValue = `${ Math.round(totalXpInKb) }`;
        unit = 'kB'

    }

    if (number >= 1000000) {
        const totalXpInMb = number / 1000000;
        displayValue = `${ totalXpInMb.toFixed(2) }`;
        unit = 'MB'
    }

    return [displayValue, unit];
}
