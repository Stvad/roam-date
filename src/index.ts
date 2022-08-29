import {RoamDate} from "roam-api-wrappers/dist/date"

import toConfigPageName from 'roamjs-components/util/toConfigPageName'
import runExtension from 'roamjs-components/util/runExtension'
import 'roamjs-components/types'
import {createConfigObserver} from 'roamjs-components/components/ConfigPage'
import {createBlockObserver, createIconButton, getUids} from 'roamjs-components/dom'

import {DatePanelOverlay} from './date-panel'

import './index.css'
import {setupNavigation} from './navigation'
import {setup as setupFuzzies} from './fuzzy-date'

const ID = 'roam-date'
const CONFIG = toConfigPageName(ID)

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

export default runExtension({
    extensionId: ID,
    run: () => {
        console.log('run extension is run')
        setupNavigation()
        setupFuzzies()

        createConfigObserver({title: CONFIG, config: {tabs: []}})

        //todo do the thing for a specific date object in a block
        createBlockObserver((b: HTMLDivElement) => {
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
    },
})
