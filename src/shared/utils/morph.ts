export const  convertToPlural = (word: string) => {
    if (word.endsWith('ый')) {
        return word.slice(0, -2) + 'ые';
    }
    if (word.endsWith('ой')) {
        return word.slice(0, -2) + 'ие';
    }
    return word + 'ы'
}