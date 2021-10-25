
import {toConfig, runExtension, createBlockObserver, createIconButton, getUids} from "roam-client"
import {createConfigObserver, createOverlayRender, } from "roamjs-components"
import {DatePanel, DatePanelOverlay, DatePanelProps} from "./date-panel"

const ID = "roam-date";
const CONFIG = toConfig(ID);
runExtension(ID, () => {
  console.log("run extension is run")
  createConfigObserver({ title: CONFIG, config: { tabs: [] } });

  window.roamAlphaAPI.ui.commandPalette.addCommand({
    label: "Date panel test",
    callback: () => DatePanelOverlay({blockUid: "wEsbKDJ-0"}),
  });


  //todo do the thing for a specific date object in a block
  // todo fix it disappearing on use
  // todo can't click the button
  createBlockObserver((b: HTMLDivElement) => {
    const refElement = b.querySelector(".rm-page-ref")?.parentElement;
    // const refElement = b.closest(".rm-block-main");
    console.log(b)
    console.log(refElement)
    // no refs don't care. or probably want to have a loop here actually
    if (!refElement) return
    // console.log(refElement.parentElement)
    // console.log(refElement.parentNode)

    const blockUid = getUids(b).blockUid

    const icon = createIconButton("edit");
    // icon.style.position = "absolute";
    // icon.style.top = "0";
    // icon.style.right = "0";
    icon.addEventListener("mousedown", (e) => {
      e.stopPropagation()
      DatePanelOverlay({blockUid})
    })

    // refElement.append(icon);
    refElement.parentElement.appendChild(icon);
    // refElement.parentElement.;
    // insertAfter(icon, refElement)
  })

});

console.log("index is run")

function insertAfter(newNode:any, referenceNode:any) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
