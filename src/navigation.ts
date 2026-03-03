import hotkeys from 'hotkeys-js'
import 'roamjs-components/types'
import {RoamDate} from 'roam-api-wrappers/dist/date'
import {openPageInSidebar} from 'roam-api-wrappers/dist/ui'
import {Block} from 'roam-api-wrappers/dist/data'
import {createModifier, modifyDateInBlock} from './core/date'
import {rescheduleBlock} from './date-panel'
import {SRSSignal} from './srs/scheduler'

const getFocusedBlockUid = () => {
    const focusedBlock = window.roamAlphaAPI.ui.getFocusedBlock?.()
    if (focusedBlock && 'block-uid' in focusedBlock) {
        return focusedBlock['block-uid']
    }

    const activeElement = document.activeElement
    if (!(activeElement instanceof HTMLTextAreaElement)) return undefined
    if (!activeElement.id.startsWith('block-input-')) return undefined

    return activeElement.id.slice('block-input-'.length)
}

const focusedBlockHasDate = (blockUid: string) => {
    const block = Block.fromUid(blockUid)
    return Boolean(block.text.match(RoamDate.referenceRegex))
}

const setupFocusedBlockShortcut = (shortcut: string, action: (blockUid: string) => void) => {
    hotkeys(shortcut, (ev) => {
        const blockUid = getFocusedBlockUid()
        if (!blockUid) return

        ev.preventDefault()
        action(blockUid)
    })
}

const setupSRSShortcut = (shortcut: string, signal: SRSSignal) => {
    setupFocusedBlockShortcut(shortcut, (blockUid) => {
        rescheduleBlock(blockUid, signal)
    })
}

const setupDateShiftShortcut = (shortcut: string, days: number) => {
    setupFocusedBlockShortcut(shortcut, (blockUid) => {
        if (!focusedBlockHasDate(blockUid)) return

        modifyDateInBlock(blockUid, createModifier(days))
    })
}

const SHORTCUTS = [
    'ctrl+shift+`',
    'ctrl+shift+1',
    'ctrl+shift+2',
    'ctrl+shift+3',
    'ctrl+shift+4',
    'ctrl+shift+left',
    'ctrl+shift+right',
    'ctrl+alt+up',
    'ctrl+alt+down',
]

export const setupNavigation = () => {
    hotkeys('ctrl+shift+`', () =>
        void window.roamAlphaAPI.ui.mainWindow.openPage({page: {title: RoamDate.toRoam(new Date())}}))

    hotkeys('ctrl+shift+1', (ev) => {
        const blockUid = getFocusedBlockUid()
        if (!blockUid) {
            void openPageInSidebar(RoamDate.toRoam(new Date()))
            return
        }

        ev.preventDefault()
        rescheduleBlock(blockUid, SRSSignal.AGAIN)
    })

    setupSRSShortcut('ctrl+shift+2', SRSSignal.HARD)
    setupSRSShortcut('ctrl+shift+3', SRSSignal.GOOD)
    setupSRSShortcut('ctrl+shift+4', SRSSignal.EASY)

    setupDateShiftShortcut('ctrl+shift+left', -1)
    setupDateShiftShortcut('ctrl+shift+right', 1)
    setupDateShiftShortcut('ctrl+alt+up', 1)
    setupDateShiftShortcut('ctrl+alt+down', -1)
}

export const disableNavigation = () => {
    SHORTCUTS.forEach((shortcut) => hotkeys.unbind(shortcut))
}
