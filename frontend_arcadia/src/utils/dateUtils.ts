export function isValidDate(value: string): boolean {
    const formDate = new Date(value)
    return !isNaN(formDate.getTime()) && /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)
}