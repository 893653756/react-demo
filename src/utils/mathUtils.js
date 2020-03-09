
export const randomInt = (min = 0, max = 50) => {
    return Math.ceil(Math.random() * (max - min) + min);
}