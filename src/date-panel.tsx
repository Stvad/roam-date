import React from "react"

import {Dialog} from "@blueprintjs/core"

import {createOverlayRender} from "roamjs-components"
import {createModifier, modifyDateInBlock} from "./core/date"
import {SRSSignal, SRSSignals} from "./srs/scheduler"
import {AnkiScheduler} from "./srs/AnkiScheduler"
import {Block, Roam, RoamBlock} from "../../roam-client"
import {SM2Node} from "./srs/SM2Node"

export type DatePanelProps = {
    blockUid: string
}

interface MoveDateButtonParams {
    shift: number
}


// todo display date under edit
export const DatePanel = ({blockUid, onClose, ...restProps}: { onClose: () => void; } & DatePanelProps) => {
    const MoveDateButton = ({shift, ...restProps}: MoveDateButtonParams) =>
        <button onClick={() => modifyDateInBlock(blockUid, createModifier(shift))} {...restProps}/>


    return <Dialog
        isOpen={true}
        onClose={onClose}
        canEscapeKeyClose>

        <div>
            <h1>Date to edit todo </h1>

            <div className="buttons">
                <div className="dayButtons">
                    {/*<MoveDateButton shift={1}>+1d</MoveDateButton>*/}
                    {/*<MoveDateButton shift={-1}>-1d</MoveDateButton>*/}
                    <button onClick={() => modifyDateInBlock(blockUid, createModifier(1))}>+1d</button>
                    <button onClick={() => modifyDateInBlock(blockUid, createModifier(-1))}>-1d</button>
                </div>

                <div className="weekButtons">
                    <button onClick={() => modifyDateInBlock(blockUid, createModifier(7))}>+1w</button>
                    <button onClick={() => modifyDateInBlock(blockUid, createModifier(-7))}>-1w</button>
                </div>

                <h3>SRS</h3>
                <div className="srsButtons">
                    {SRSSignals.map(it => <button
                        onClick={()=>rescheduleBlock(blockUid, it)}
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
