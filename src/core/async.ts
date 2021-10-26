export const delay = (millis: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, millis))
