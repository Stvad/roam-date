import * as chrono from 'chrono-node'
import {RoamDate} from 'roam-api-wrappers/dist/date'
import {getSelectionInFocusedBlock} from 'roam-api-wrappers/dist/ui'
import {getActiveEditElement} from 'roam-api-wrappers/dist/dom'
import {afterClosingBrackets} from './core/roam'
import {NodeSelection, RoamNode, saveToCurrentBlock, SM2Node} from './srs/SM2Node'

export const config = {
    id: 'fuzzy-date',
    name: 'Fuzzy Date',
    enabledByDefault: true,
    settings: [{type: 'string', id: 'guard', initValue: ';', label: 'Guard symbol'}],
}

const defaultGuard = ';'


const getCursor = (node: RoamNode, newText: string, searchStart: number = 0) =>
    node.text === newText ? node.selection.start : afterClosingBrackets(newText, searchStart)

export async function replaceFuzzyDate(guard: string) {
    const dateContainerExpr = new RegExp(`${guard}\(\.\{3,\}\?\)${guard}`, 'gm')

    // Must use the html element value, because the block text is not updated yet
    const editElement = getActiveEditElement()
    if (!editElement) return

    const node = new SM2Node(editElement.value, getSelectionInFocusedBlock())

    const match = node.text.match(dateContainerExpr)
    if (!match) return node

    const dateStr = match[0]
    const date = chrono.parseDate(dateStr, new Date(), {
        forwardDate: true,
    })
    if (!date) return node

    const replaceMode = dateStr.startsWith(';:')

    const replaceWith = replaceMode ? '' : RoamDate.toDatePage(date)
    const newText = node.text.replace(dateContainerExpr, replaceWith)

    const cursor = getCursor(node, newText, replaceMode ? 0 : node.selection.start)
    const newNode = new SM2Node(newText, new NodeSelection(cursor, cursor))

    return saveToCurrentBlock(replaceMode ? newNode.withDate(date) : newNode)
}

/**
 * We use `keypress`, since `keyup` is sometimes firing for individual keys instead of the pressed key
 * when the guard character is requiring a multi-key stroke.
 *
 * `setTimeout` is used to put the callback to the end of the event queue,
 * since the input is not yet changed when keypress is firing.
 */
export const setup = () => {
    document.addEventListener('keypress', keypressListener)
}

const disable = () => {
    document.removeEventListener('keypress', keypressListener)
}

const keypressListener = (ev: KeyboardEvent) => {
    if (ev.key === defaultGuard) {
        setTimeout(() => replaceFuzzyDate(defaultGuard), 10)
    }
}
