import getPageUidByPageTitle from 'roamjs-components/queries/getPageUidByPageTitle'

export const openPageInSidebar = (name: string) =>
    window.roamAlphaAPI.ui.rightSidebar.addWindow({
        window: {
            'block-uid': getPageUidByPageTitle(name),
            type: 'block',
        },
    })
