export const debounce = (callback: Function, time = 250, interval: number) => 
    (...args: any[]) => {
        clearTimeout(interval);
        interval = setTimeout(() => callback(...args), time);
    }