// e.g. '4:14:52 pm AEDT Thu Nov 14 2024'
export const toLocalDateTime = (date: Date) => {
    return date.toLocaleString('en-AU', {
        timeZone: 'Australia/Sydney',
        timeStyle: 'long'
    }) + ' ' + date.toDateString();
}