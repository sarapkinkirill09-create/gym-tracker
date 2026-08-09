import { useState } from 'react'
import MeasurementChart from './MeasurementChart'
import './Measurements.css'

import {
    cleanText,
    normalizeText,
    capitalizeText
} from '../utils/text'

function Measurements({
    onBack,
    measurements,
    setMeasurements
}) {
    const [selectedMeasurement, setSelectedMeasurement] =
        useState(null)

    const [measurementDate, setMeasurementDate] =
        useState(
            new Date().toLocaleDateString('sv-SE')
        )

    const [measurementValue, setMeasurementValue] =
        useState('')

    const [editingDate, setEditingDate] =
        useState(null)

    const [isAddingMeasurement, setIsAddingMeasurement] =
        useState(false)

    const [newMeasurementName, setNewMeasurementName] =
        useState('')

    const [newMeasurementUnit, setNewMeasurementUnit] =
        useState('')
    
    const [newMeasurementError, setNewMeasurementError] =
        useState('')

    function saveMeasurement() {
        if (selectedMeasurement === null) {
            return
        }

        const normalizedValue =
            measurementValue
                .replace(',', '.')
                .trim()

        if (
            normalizedValue === '' ||
            Number.isNaN(Number(normalizedValue))
        ) {
            return
        }

        setMeasurements((previousMeasurements) => {
            const measurement =
                previousMeasurements[selectedMeasurement]

            let updatedHistory =
                [...measurement.history]

            // Если мы редактировали запись и поменяли дату,
            // удаляем старую запись.
            if (
                editingDate !== null &&
                editingDate !== measurementDate
            ) {
                updatedHistory =
                    updatedHistory.filter(
                        (entry) =>
                            entry.date !== editingDate
                    )
            }

            const alreadyExists =
                updatedHistory.some(
                    (entry) =>
                        entry.date === measurementDate
                )

            if (alreadyExists) {
                updatedHistory =
                    updatedHistory.map((entry) => {
                        if (
                            entry.date === measurementDate
                        ) {
                            return {
                                date: measurementDate,
                                value: normalizedValue
                            }
                        }

                        return entry
                    })
            } else {
                updatedHistory.push({
                    date: measurementDate,
                    value: normalizedValue
                })
            }

            updatedHistory.sort(
                (a, b) =>
                    b.date.localeCompare(a.date)
            )

            return {
                ...previousMeasurements,

                [selectedMeasurement]: {
                    ...measurement,
                    history: updatedHistory
                }
            }
        })

        setMeasurementValue('')
        setEditingDate(null)
    }

    function editHistoryEntry(entry) {
        setMeasurementDate(entry.date)
        setMeasurementValue(entry.value)
        setEditingDate(entry.date)
    }

    function deleteHistoryEntry(date) {
        setMeasurements((previousMeasurements) => {
            const measurement =
                previousMeasurements[selectedMeasurement]

            const updatedHistory =
                measurement.history.filter(
                    (entry) =>
                        entry.date !== date
                )

            return {
                ...previousMeasurements,

                [selectedMeasurement]: {
                    ...measurement,
                    history: updatedHistory
                }
            }
        })

        if (editingDate === date) {
            setEditingDate(null)
            setMeasurementValue('')
        }
    }

    function openMeasurement(measurementId) {
        setSelectedMeasurement(measurementId)
        setMeasurementValue('')
        setEditingDate(null)

        setMeasurementDate(
            new Date().toLocaleDateString('sv-SE')
        )
    }

    function addCustomMeasurement() {
        const name =
            cleanText(newMeasurementName)

        const unit =
            cleanText(newMeasurementUnit)

        if (
            name === '' ||
            unit === ''
        ) {
            setNewMeasurementError(
                'Введите название и единицу измерения'
            )

            return
        }

        const alreadyExists =
            Object.values(measurements).some(
                (measurement) =>
                    normalizeText(
                        measurement.name
                    ) ===
                    normalizeText(name)
            )

        if (alreadyExists) {
            setNewMeasurementError(
                'Измерение с таким названием уже существует'
            )

            return
        }

        const measurementId =
            `custom-${Date.now()}`

        setMeasurements(
            (previousMeasurements) => ({
                ...previousMeasurements,

                [measurementId]: {
                    name: capitalizeText(name),
                    unit: unit,
                    history: []
                }
            })
        )

        setNewMeasurementName('')
        setNewMeasurementUnit('')
        setNewMeasurementError('')
        setIsAddingMeasurement(false)
    }

    function deleteMeasurement() {
        if (
            selectedMeasurement === null ||
            !selectedMeasurement.startsWith('custom-')
        ) {
            return
        }

        const shouldDelete = window.confirm(
            'Удалить это измерение и всю его историю?'
        )

        if (!shouldDelete) {
            return
        }

        setMeasurements((previousMeasurements) => {
            const updatedMeasurements = {
                ...previousMeasurements
            }

            delete updatedMeasurements[selectedMeasurement]

            return updatedMeasurements
        })

        setSelectedMeasurement(null)
        setMeasurementValue('')
        setEditingDate(null)
    }

    if (selectedMeasurement !== null) {
        const measurement =
            measurements[selectedMeasurement]

        const isCustomMeasurement =
            selectedMeasurement.startsWith('custom-')

        return (
            <div className="measurements">

                <button
                    type="button"
                    onClick={() => {
                        setSelectedMeasurement(null)
                        setMeasurementValue('')
                        setEditingDate(null)
                    }}
                >
                    ← Назад
                </button>

                <h2>{measurement.name}</h2>

                <div className="measurement-input">

                    <input
                        type="date"
                        value={measurementDate}
                        onChange={(event) =>
                            setMeasurementDate(
                                event.target.value
                            )
                        }
                    />

                    <div className="measurement-value-input">

                        <input
                            type="text"
                            inputMode="decimal"
                            placeholder="Значение"
                            value={measurementValue}
                            onFocus={(event) =>
                                event.target.select()
                            }
                            onChange={(event) =>
                                setMeasurementValue(
                                    event.target.value
                                )
                            }
                        />

                        <span>
                            {measurement.unit}
                        </span>

                    </div>

                    <button
                        type="button"
                        onClick={saveMeasurement}
                    >
                        {editingDate !== null
                            ? 'Сохранить изменения'
                            : 'Добавить запись'
                        }
                    </button>

                    {editingDate !== null && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingDate(null)
                                setMeasurementValue('')

                                setMeasurementDate(
                                    new Date()
                                        .toLocaleDateString(
                                            'sv-SE'
                                        )
                                )
                            }}
                        >
                            Отмена
                        </button>
                    )}

                </div>

                <h3>Прогресс</h3>

                <MeasurementChart
                    history={measurement.history}
                    unit={measurement.unit}
                />

                <h3>История</h3>

                {measurement.history.length === 0 ? (
                    <p>Пока нет измерений</p>
                ) : (
                    <div className="measurement-history">

                        {measurement.history.map((entry) => (
                            <div
                                className="measurement-history-row"
                                key={entry.date}
                            >

                                <div className="measurement-history-data">

                                    <span>
                                        {entry.date}
                                    </span>

                                    <span>
                                        {entry.value}{' '}
                                        {measurement.unit}
                                    </span>

                                </div>

                                <div className="measurement-history-actions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            editHistoryEntry(
                                                entry
                                            )
                                        }
                                    >
                                        Изменить
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            deleteHistoryEntry(
                                                entry.date
                                            )
                                        }
                                    >
                                        ×
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

                {isCustomMeasurement && (
                    <button
                        type="button"
                        className="delete-measurement-button"
                        onClick={deleteMeasurement}
                    >
                        Удалить измерение
                    </button>
                )}

            </div>
        )
    }

    return (
        <div className="measurements">

            <button
                type="button"
                onClick={onBack}
            >
                ← Назад
            </button>

            <h2>Измерения</h2>

            <div className="measurement-list">

                {Object.entries(measurements).map(
                    ([measurementId, measurement]) => {

                        const latest =
                            measurement.history[0]

                        return (
                            <button
                                type="button"
                                className="measurement-card"
                                key={measurementId}
                                onClick={() =>
                                    openMeasurement(
                                        measurementId
                                    )
                                }
                            >
                                <span>
                                    {measurement.name}
                                </span>

                                <span>
                                    {latest
                                        ? `${latest.value} ${measurement.unit}`
                                        : `— ${measurement.unit}`
                                    }
                                </span>
                            </button>
                        )
                    }
                )}

            </div>

            {!isAddingMeasurement ? (
                <button
                    type="button"
                    className="add-measurement-button"
                    onClick={() =>
                        setIsAddingMeasurement(true)
                    }
                >
                    + Добавить измерение
                </button>
            ) : (
                <div className="new-measurement-form">

                    <input
                        type="text"
                        placeholder="Название"
                        value={newMeasurementName}
                        onFocus={(event) =>
                            event.target.select()
                        }
                        onChange={(event) =>
                            setNewMeasurementName(
                                event.target.value
                            )
                        }
                    />

                    <input
                        type="text"
                        placeholder="Единица измерения"
                        value={newMeasurementUnit}
                        onFocus={(event) =>
                            event.target.select()
                        }
                        onChange={(event) =>
                            setNewMeasurementUnit(
                                event.target.value
                            )
                        }
                    />

                    <button
                        type="button"
                        onClick={addCustomMeasurement}
                    >
                        Добавить
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingMeasurement(false)
                            setNewMeasurementName('')
                            setNewMeasurementUnit('')
                        }}
                    >
                        Отмена
                    </button>

                </div>
            )}

        </div>
    )
}

export default Measurements