import {RoamDate} from 'roam-api-wrappers/dist/date'

import runExtension from 'roamjs-components/util/runExtension'
import 'roamjs-components/types'
import createBlockObserver from 'roamjs-components/dom/createBlockObserver'
import createIconButton from 'roamjs-components/dom/createIconButton'
import getUids from 'roamjs-components/dom/getUids'

import {DatePanelOverlay} from './date-panel'

import './index.css'
import {disableNavigation, setupNavigation} from './navigation'
import {setup as setupFuzzies, disable as disableFuzzies} from './fuzzy-date'

const ID = 'roam-date'

//todo this matches things that have a sub-node with date
const hasDateReferenced = (element: HTMLDivElement) =>
    RoamDate.regex.test(element.innerText)

const iconClass = 'roam-date-icon'

const iconAlreadyExists = (refElement: HTMLElement) =>
    refElement.parentElement.querySelector(`.${iconClass}`)

function findDateRef(b: HTMLDivElement) {
    const refs = b.querySelectorAll('.rm-page-ref')
    const dateElement = [...refs].find(hasDateReferenced)
    return dateElement?.parentElement
}

const removeIconButtons = () =>
    document.querySelectorAll(`.${iconClass}`).forEach((i) => i.remove())


let observersToCleanup: MutationObserver[]
const cleanupBlockObservers = () => {
    observersToCleanup?.forEach((o) => o.disconnect())
}

export default runExtension({
    extensionId: ID,
    run: () => {
        console.log('run extension is run')
        setupNavigation()
        setupFuzzies()

        //todo do the thing for a specific date object in a block
        observersToCleanup = createBlockObserver((b: HTMLDivElement) => {
            if (!hasDateReferenced(b)) return

            const refElement = findDateRef(b)
            // no refs don't care. or probably want to have a loop here actually
            if (!refElement || iconAlreadyExists(refElement)) return

            const blockUid = getUids(b).blockUid

            const icon = createIconButton('calendar')
            icon.className = iconClass
            icon.addEventListener('mousedown', (e) => {
                e.stopPropagation()
                DatePanelOverlay({blockUid})
            })
            refElement.parentNode.insertBefore(icon, refElement)
        })
    },
    unload: () => {
        disableFuzzies()
        disableNavigation()
        removeIconButtons()
        cleanupBlockObservers()
    },
})
