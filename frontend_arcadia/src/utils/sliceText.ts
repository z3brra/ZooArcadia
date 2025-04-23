export function sliceText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }

    const sliceTo = text.slice(0, maxLength + 1);
    const lastSpace = sliceTo.lastIndexOf(' ');

    if (lastSpace > 0) {
        return text.slice(0, lastSpace) + '...';
    }

    return text.slice(0, maxLength) + '...';
}