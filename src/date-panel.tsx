import React from "react"

import {Dialog} from "@blueprintjs/core"

import {createOverlayRender} from "roamjs-components"
import {createModifier, modifyDateInBlock} from "./core/date"

export type DatePanelProps = {
    blockUid: string
}

// todo display date under edit
export const DatePanel = ({blockUid, onClose, ...restProps}: { onClose: () => void; } & DatePanelProps) => <Dialog
    isOpen={true}
    onClose={onClose}
    canEscapeKeyClose>

    <div>
        <h1>Date to edit todo </h1>

        <div className="buttons">
            <div className="dayButtons">
                <button onClick={() => modifyDateInBlock(blockUid, createModifier(1))}>+1d</button>
                <button onClick={() => modifyDateInBlock(blockUid, createModifier(-1))}>-1d</button>
            </div>

            <div className="weekButtons">
                <button onClick={() => modifyDateInBlock(blockUid, createModifier(7))}>+1w</button>
                <button onClick={() => modifyDateInBlock(blockUid, createModifier(-7))}>-1w</button>
            </div>
        </div>
    </div>

</Dialog>

export const DatePanelOverlay = createOverlayRender<DatePanelProps>("date-overlay", DatePanel)

