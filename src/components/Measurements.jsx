import { useState } from 'react'
import './Measurements.css'

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

            const alreadyExists =
                measurement.history.some(
                    (entry) =>
                        entry.date === measurementDate
                )

            let updatedHistory

            if (alreadyExists) {
                updatedHistory =
                    measurement.history.map((entry) => {
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
                updatedHistory = [
                    ...measurement.history,
                    {
                        date: measurementDate,
                        value: normalizedValue
                    }
                ]
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
    }

    function openMeasurement(measurementId) {
        setSelectedMeasurement(measurementId)
        setMeasurementValue('')
    }

    if (selectedMeasurement !== null) {
        const measurement =
            measurements[selectedMeasurement]

        return (
            <div className="measurements">

                <button
                    type="button"
                    onClick={() =>
                        setSelectedMeasurement(null)
                    }
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

                        <span>{measurement.unit}</span>
                    </div>

                    <button
                        type="button"
                        onClick={saveMeasurement}
                    >
                        Добавить запись
                    </button>

                </div>

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
                                <span>{entry.date}</span>

                                <span>
                                    {entry.value}{' '}
                                    {measurement.unit}
                                </span>
                            </div>
                        ))}

                    </div>
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

            <button
                type="button"
                className="add-measurement-button"
            >
                + Добавить измерение
            </button>

        </div>
    )
}

export default Measurements