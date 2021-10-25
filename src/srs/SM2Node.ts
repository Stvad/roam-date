// import {withDate} from './date/withDate'
// import {RoamNode, Selection} from '../roam/roam-node'

import {Date as RoamDate} from "roam-client"

export class RoamNode {
    constructor(readonly text: string) {}

    getInlineProperty(name: string) {
        return RoamNode.getInlinePropertyMatcher(name).exec(this.text)?.[1]
    }

    withInlineProperty(name: string, value: string) {
        const currentValue = this.getInlineProperty(name)
        const property = RoamNode.createInlineProperty(name, value)
        const newText = currentValue
            ? this.text.replace(RoamNode.getInlinePropertyMatcher(name), property)
            : this.text + ' ' + property
        // @ts-ignore
        return new this.constructor(newText)
    }

    static createInlineProperty(name: string, value: string) {
        return `[[[[${name}]]:${value}]]`
    }

    static getInlinePropertyMatcher(name: string) {
        /**
         * This has a bunch of things for backward compatibility:
         * - Potentially allowing double colon `::` between name and value
         * - Accepting both `{}` and `[[]]` wrapped properties
         */
        return new RegExp(`(?:\\[\\[|{)\\[\\[${name}]]::?(.*?)(?:]]|})`, 'g')
    }
}

export class SM2Node extends RoamNode {
    constructor(text: string) {
        super(text)
    }

    private readonly intervalProperty = 'interval'
    private readonly factorProperty = 'factor'

    get interval(): number | undefined {
        return parseFloat(this.getInlineProperty(this.intervalProperty)!)
    }

    withInterval(interval: number): SM2Node {
        // Discarding the fractional part for display purposes/and so we don't get infinite number of intervals
        // Should potentially reconsider this later
        return this.withInlineProperty(this.intervalProperty, Number(interval).toFixed(1))
    }

    get factor(): number | undefined {
        return parseFloat(this.getInlineProperty(this.factorProperty)!)
    }

    withFactor(factor: number): SM2Node {
        return this.withInlineProperty(this.factorProperty, Number(factor).toFixed(2))
    }

    listDatePages() {
        return this.text.match(RoamDate.referenceRegex) || []
    }

    listDates() {
        return this.listDatePages().map(ref => RoamDate.parseFromReference(ref))
    }

    /** If has 1 date - replace it, if more then 1 date - append it */
    withDate(date: Date) {
        const currentDates = this.listDatePages()
        console.log(currentDates)
        const newDate = RoamDate.toDatePage(date)
        console.log(newDate)
        const newText =
            currentDates.length === 1 ? this.text.replace(currentDates[0], newDate) : this.text + ' ' + newDate

        // @ts-ignore
        return new this.constructor(newText)
    }

}
