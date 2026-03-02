import React, {useCallback, useEffect, useMemo, useState} from "react"

import {Classes, Dialog} from "@blueprintjs/core"

import {createModifier, modifyDateInBlock} from "./core/date"
import {SRSSignal, SRSSignals} from "./srs/scheduler"
import {AnkiScheduler} from "./srs/AnkiScheduler"
import {Block} from "roam-api-wrappers/dist/data"
import {SM2Node} from "./srs/SM2Node"

import "./date-panel.css"
import {delay} from "./core/async"
import {createOverlayRender} from 'roamjs-components/util'

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

    const moveDate = useCallback(async (shift: number) => {
        modifyDateInBlock(blockUid, createModifier(shift))
        await updateDate()
    }, [blockUid])

    const scheduleDate = useCallback(async (signal: SRSSignal) => {
        rescheduleBlock(blockUid, signal)
        await updateDate()
    }, [blockUid])

    const shortcuts = useMemo(() => ({
        ArrowRight: () => moveDate(1),
        ArrowLeft: () => moveDate(-1),
        ArrowUp: () => moveDate(7),
        ArrowDown: () => moveDate(-7),
        '1': () => scheduleDate(SRSSignal.AGAIN),
        '2': () => scheduleDate(SRSSignal.HARD),
        '3': () => scheduleDate(SRSSignal.GOOD),
        '4': () => scheduleDate(SRSSignal.EASY),
        Escape: onClose,
    }), [moveDate, onClose, scheduleDate])

    useEffect(() => {
        const listener = (ev: KeyboardEvent) => {
            if (ev.target instanceof HTMLInputElement || ev.target instanceof HTMLTextAreaElement) return

            const shortcut = shortcuts[ev.key as keyof typeof shortcuts]
            if (!shortcut) return

            ev.preventDefault()
            void shortcut()
        }

        document.addEventListener('keydown', listener)

        return () => {
            document.removeEventListener('keydown', listener)
        }
    }, [shortcuts])

    const MoveDateButton = ({shift, label}: MoveDateButtonParams) =>
        <button className={"date-button"}
                onClick={async () => {
                    await moveDate(shift)
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
                            await scheduleDate(it)
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
