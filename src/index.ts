import {createBlockObserver, createIconButton, Date as RoamDate, getUids, runExtension, toConfig} from "roam-client"
import {createConfigObserver} from "roamjs-components"
import {DatePanelOverlay} from "./date-panel"

const ID = "roam-date";
const CONFIG = toConfig(ID);

const noDatesReferenced = (element: HTMLDivElement) =>
    !RoamDate.regex.test(element.innerText)

const iconClass = "roam-date-icon"

const iconAlreadyExists = (refElement: HTMLElement) =>
    refElement.parentElement.querySelector(`.${iconClass}`)

runExtension(ID, () => {
  console.log("run extension is run")
  createConfigObserver({ title: CONFIG, config: { tabs: [] } });

  //todo do the thing for a specific date object in a block
  //todo nail down position of the icon and disappearance thing
  createBlockObserver((b: HTMLDivElement) => {
    if(noDatesReferenced(b)) return

    const refElement = b.querySelector(".rm-page-ref")?.parentElement;
    // no refs don't care. or probably want to have a loop here actually
    if (!refElement || iconAlreadyExists(refElement)) return

    const blockUid = getUids(b).blockUid

    const icon = createIconButton("calendar");
    icon.className = iconClass
    icon.addEventListener("mousedown", (e) => {
      e.stopPropagation()
      DatePanelOverlay({blockUid})
    })
    refElement.parentNode.insertBefore(icon, refElement)
  })
});
