import React, {useState} from "react"

import {Classes, Dialog} from "@blueprintjs/core"

import {createOverlayRender} from "roamjs-components"
import {createModifier, modifyDateInBlock} from "./core/date"
import {SRSSignal, SRSSignals} from "./srs/scheduler"
import {AnkiScheduler} from "./srs/AnkiScheduler"
import {Block} from "../../roam-client"
import {SM2Node} from "./srs/SM2Node"

import "./date-panel.css"
import {delay} from "./core/async"

export type DatePanelProps = {
    blockUid: string
}

interface MoveDateButtonParams {
    shift: number
    label: string
}

function getFirstDate(blockUid: string) {
    const date = new SM2Node(Block.fromUid(blockUid).text).listDates()[0]

    return date.toLocaleDateString('en-US',
        {weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'})

}

export const DatePanel = ({blockUid, onClose}: { onClose: () => void; } & DatePanelProps) => {
    const [date, setDate] = useState<string>(getFirstDate(blockUid))

    async function updateDate() {
        await delay(0)
        setDate(getFirstDate(blockUid))
    }

    const MoveDateButton = ({shift, label}: MoveDateButtonParams) =>
        <button className={"date-button"}
                onClick={async () => {
                    modifyDateInBlock(blockUid, createModifier(shift))
                    await updateDate()
                }}
        >
            {label}
        </button>


    return <Dialog
        isOpen={true}
        onClose={onClose}
        canEscapeKeyClose
        backdropClassName={"date-dialog-backdrop"}
        className={"date-dialog"}
    >
        <div className={Classes.DIALOG_BODY + " date-dialog-body"}>
            <h1 className={"date-under-edit"}>{date}</h1>

            <div className="buttons">
                <div className="day-buttons date-buttons">
                    <MoveDateButton shift={1} label={"+1d"}/>
                    <MoveDateButton shift={-1} label={"-1d"}/>
                </div>

                <div className="week-buttons date-buttons">
                    <MoveDateButton shift={7} label={"+1w"}/>
                    <MoveDateButton shift={-7} label={"-1w"}/>
                </div>

                <h3 className={"date-dialog-header"}>SRS</h3>
                <div className="srs-buttons date-buttons">
                    {SRSSignals.map(it => <button
                        className={"srs-button date-button"}
                        onClick={async () => {
                            rescheduleBlock(blockUid, it)
                            await updateDate()
                        }}
                    >
                        {SRSSignal[it]}
                    </button>)}
                </div>
            </div>
        </div>
    </Dialog>
}

export const DatePanelOverlay = createOverlayRender<DatePanelProps>("date-overlay", DatePanel)


export function rescheduleBlock(blockUid: string, signal: SRSSignal) {
    const scheduler = new AnkiScheduler()
    const block = Block.fromUid(blockUid)
    block.text = scheduler.schedule(new SM2Node(block.text), signal).text
}
