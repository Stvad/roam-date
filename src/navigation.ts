import hotkeys from 'hotkeys-js'
import 'roamjs-components/types'
import {Date as RoamDate} from 'roam-client'
import {openPageInSidebar} from './core/roam'


export const setupNavigation = () => {
    hotkeys('ctrl+shift+`', () =>
        window.roamAlphaAPI.ui.mainWindow.openPage({page: {title: RoamDate.toRoam(new Date())}}))

    hotkeys('ctrl+shift+1', () => openPageInSidebar(RoamDate.toRoam(new Date())))
}
