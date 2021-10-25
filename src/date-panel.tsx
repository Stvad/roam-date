import React from "react"

import {Classes, Dialog} from "@blueprintjs/core"

import {createOverlayRender} from "roamjs-components"
import {createModifier, modifyDateInBlock} from "./core/date"
import {SRSSignal, SRSSignals} from "./srs/scheduler"
import {AnkiScheduler} from "./srs/AnkiScheduler"
import {Block} from "../../roam-client"
import {SM2Node} from "./srs/SM2Node"

import "./date-panel.css"

export type DatePanelProps = {
    blockUid: string
}

interface MoveDateButtonParams {
    blockUid: string
    shift: number
    label: string
}

const MoveDateButton = ({blockUid, shift, label}: MoveDateButtonParams) =>
    <button className={"date-button"}
            onClick={() => modifyDateInBlock(blockUid, createModifier(shift))}
    >
        {label}
    </button>


// todo display date under edit
export const DatePanel = ({blockUid, onClose, ...restProps}: { onClose: () => void; } & DatePanelProps) =>
    <Dialog
        isOpen={true}
        onClose={onClose}
        canEscapeKeyClose
        portalClassName={"date-dialog-portal"}
    >

        <div className={Classes.DIALOG_BODY}>
            <h1>Date to edit todo </h1>

            <div className="buttons">
                <div className="day-buttons date-buttons">
                    <MoveDateButton blockUid={blockUid} shift={1} label={"+"}/>
                    <MoveDateButton blockUid={blockUid} shift={-1} label={"-"}/>
                </div>

                <div className="week-buttons date-buttons">
                    <MoveDateButton blockUid={blockUid} shift={7} label={"+1w"}/>
                    <MoveDateButton blockUid={blockUid} shift={-7} label={"-1w"}/>
                </div>

                <h3>SRS</h3>
                <div className="srs-buttons date-buttons">
                    {SRSSignals.map(it => <button
                        className={"srs-button date-button"}
                        onClick={() => rescheduleBlock(blockUid, it)}
                    >
                        {SRSSignal[it]}
                    </button>)}
                </div>

            </div>
        </div>

    </Dialog>

export const DatePanelOverlay = createOverlayRender<DatePanelProps>("date-overlay", DatePanel)


export function rescheduleBlock(blockUid: string, signal: SRSSignal) {
    const scheduler = new AnkiScheduler()
    const block = Block.fromUid(blockUid)
    block.text = scheduler.schedule(new SM2Node(block.text), signal).text
}
