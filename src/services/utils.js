export const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};