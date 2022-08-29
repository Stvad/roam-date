import hotkeys from 'hotkeys-js'
import 'roamjs-components/types'
import {RoamDate} from "roam-api-wrappers/dist/date"
import {openPageInSidebar} from 'roam-api-wrappers/dist/ui'


export const setupNavigation = () => {
    hotkeys('ctrl+shift+`', () =>
        void window.roamAlphaAPI.ui.mainWindow.openPage({page: {title: RoamDate.toRoam(new Date())}}))

    hotkeys('ctrl+shift+1', () =>
        void openPageInSidebar(RoamDate.toRoam(new Date())))
}
