import React from "react"

import {Dialog} from "@blueprintjs/core"

import {Popover2} from "@blueprintjs/popover2"

import {createOverlayRender} from "roamjs-components"
import {createModifier, modifyDateInBlock} from "./core/date"

export type DatePanelProps = {
    blockUid: string
}

export const DatePanel = (props: { onClose: () => void; } & DatePanelProps) => <Dialog
    isOpen={true}
    onClose={props.onClose}
    canEscapeKeyClose>

    <div>
        <h1>Whee</h1>

        <div className="buttons">
            <button onClick={()=> modifyDateInBlock(props.blockUid, createModifier(1))}>+</button>
            <button onClick={()=> modifyDateInBlock(props.blockUid, createModifier(-1))}>-</button>
        </div>
    </div>

</Dialog>

export const DatePanel2 = (props: { onClose: () => void; } & DatePanelProps) => <Popover2
    isOpen={true}
    onClose={props.onClose}
    canEscapeKeyClose
    content={
        <div>
            <h1>Whee</h1>
        </div>
    }
    targetTagName={"div"}
    // renderTarget={({ isOpen, ref, ...targetProps }) => (
    //         <Button {...targetProps} elementRef={ref} intent="primary" text="Popover target" />
    //     )
    // }
>
</Popover2>

export const DatePanelOverlay = createOverlayRender<DatePanelProps>("date-overlay", DatePanel)

