import {Block, Date as RoamDate} from "roam-client"

const applyToDate = (date: Date, modifier: (input: number) => number): Date => {
    const newDate = new Date(date)
    newDate.setDate(modifier(date.getDate()))
    return newDate
}
export const createModifier = (change: number) => (num: number) => num + change

export function modifyDateInBlock(blockUid: string, modifier: (input: number) => number) {
    const block = Block.fromUid(blockUid)

    const datesInContent = block.text.match(RoamDate.referenceRegex)

    block.text = block.text.replace(
        datesInContent[0],
        RoamDate.toDatePage(applyToDate(RoamDate.parseFromReference(datesInContent[0]), modifier)),
    )
}

export const addDays = (date: Date, days: number) => applyToDate(date, createModifier(days))

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const getDayName = (date: Date) => days[date.getDay()]
