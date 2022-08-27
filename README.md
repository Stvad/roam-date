# Roam Date control

---

The development is supported by <a href="https://roam.garden/"> <img src="https://roam.garden/static/logo-2740b191a74245dc48ee30c68d5192aa.svg" height="50" /></a> - a service that allows you to publish your Roam notes as a beautiful static website (digital garden)

---

Date control widget (including SRS support)

SRS behaviour is compatible with [Roam Toolkit](https://github.com/roam-unofficial/roam-toolkit)

The extension will add the calendar icon close to each date link. Clicking on the icon will invoke the widget & allow you to edit the selected date

![](./media/screen1.jpg)

### Shortcuts

- <code> Ctrl + Shift + `</code> - go to today's page
- <code> Ctrl + Shift + 1</code> - open today's page in the right sidebar

## Installation

1. [Install Roam plugin](https://roamstack.com/how-install-roam-plugin/) via the following code-block

```javascript
/** roam-date-widget - date manipulation widget
 *  Author: Vlad Sitalo
 *  Docs: https://github.com/Stvad/roam-date
 */


const roamDateId = "roam-date-script"
const oldRoamDate = document.getElementById(roamDateId)
if (oldRoamDate) oldRoamDate.remove()
var roamDate = document.createElement('script')
roamDate.type = "text/javascript"
roamDate.id = roamDateId
roamDate.src = "https://roam-date.roam.garden/main.js"
roamDate.async = true
document.getElementsByTagName('head')[0].appendChild(roamDate)
```

## Known issues

- Currently, works only for blocks with 1 date
