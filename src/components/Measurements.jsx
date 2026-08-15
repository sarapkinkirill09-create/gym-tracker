import { useEffect, useState } from 'react'
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
    setMeasurements,
    onRequestConfirm,
    onExportBackup
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

    const telegram =
        window.Telegram?.WebApp

    const isTelegramMiniApp =
        Boolean(telegram?.initData)

    function goBack() {

        /*
            Если открыт конкретный показатель,
            например "Вес", возвращаемся
            к общему списку измерений.
        */
        if (selectedMeasurement !== null) {
            setSelectedMeasurement(null)

            setMeasurementValue('')

            setEditingDate(null)

            return
        }


        /*
            Если открыта форма создания
            нового показателя — сначала
            просто закрываем её.
        */
        if (isAddingMeasurement) {
            setIsAddingMeasurement(false)

            setNewMeasurementName('')

            setNewMeasurementUnit('')

            setNewMeasurementError('')

            return
        }


        /*
            Если мы уже на главном экране
            измерений — возвращаемся
            к тренировке.
        */
        onBack()
    }

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

    useEffect(() => {

        const backButton =
            telegram?.BackButton


        /*
            Если приложение открыто
            не внутри Telegram —
            BackButton просто отсутствует.
        */
        if (!backButton) {
            return
        }


        function handleTelegramBack() {
            goBack()
        }


        /*
            Показываем системную кнопку
            Telegram.
        */
        backButton.show()

        backButton.onClick(
            handleTelegramBack
        )


        /*
            Когда Measurements закрывается
            или состояние экрана меняется,
            удаляем старый обработчик.
        */
        return () => {

            backButton.offClick(
                handleTelegramBack
            )

            backButton.hide()
        }

    }, [
        selectedMeasurement,
        isAddingMeasurement,
        onBack,
        telegram
    ])

    function deleteMeasurement() {

        if (
            selectedMeasurement === null ||
            !selectedMeasurement.startsWith(
                'custom-'
            )
        ) {
            return
        }


        const measurement =
            measurements[selectedMeasurement]


        onRequestConfirm({
            title: 'Удалить показатель?',

            message:
                `«${measurement.name}» и вся ` +
                'сохранённая история этого ' +
                'показателя будут удалены.',

            confirmText: 'Удалить',

            onConfirm: () =>
                confirmDeleteMeasurement(
                    selectedMeasurement
                )
        })
    }

    function confirmDeleteMeasurement(
        measurementId
    ) {

        setMeasurements(
            (previousMeasurements) => {

                const updatedMeasurements = {
                    ...previousMeasurements
                }

                delete updatedMeasurements[
                    measurementId
                ]

                return updatedMeasurements
            }
        )


        setSelectedMeasurement(null)

        setMeasurementValue('')

        setEditingDate(null)
    }
    if (selectedMeasurement !== null) {
        const measurement =
            measurements[selectedMeasurement]

        const isCustomMeasurement =
            selectedMeasurement.startsWith('custom-')

        const latestMeasurement =
            measurement.history[0]


        function formatMeasurementDate(date) {
            const [year, month, day] =
                date.split('-')

            return `${day}.${month}.${year}`
        }


        return (
            <div className="measurements">

                {!isTelegramMiniApp && (
                    <button
                        type="button"
                        className="measurement-back-button"
                        onClick={goBack}
                    >
                        ← Назад
                    </button>
                )}


                <div className="measurement-detail-header">

                    <span className="measurements-eyebrow">
                        Показатель
                    </span>

                    <h2>
                        {measurement.name}
                    </h2>

                </div>


                <div className="measurement-current-card">

                    <span className="measurement-current-label">
                        Текущее значение
                    </span>


                    <div className="measurement-current-value">

                        <strong>
                            {latestMeasurement
                                ? latestMeasurement.value
                                : '—'
                            }
                        </strong>

                        <span>
                            {measurement.unit}
                        </span>

                    </div>


                    <p>
                        {latestMeasurement
                            ? `Последняя запись · ${formatMeasurementDate(
                                latestMeasurement.date
                            )}`
                            : 'Добавь первую запись, чтобы начать отслеживать прогресс.'
                        }
                    </p>

                </div>


                <div className="measurement-entry-card">

                    <div className="measurement-entry-header">

                        <span>
                            {editingDate !== null
                                ? 'Редактирование записи'
                                : 'Новая запись'
                            }
                        </span>

                        <p>
                            {editingDate !== null
                                ? 'Измени дату или значение и сохрани результат.'
                                : 'Зафиксируй текущее значение показателя.'
                            }
                        </p>

                    </div>


                    <div className="measurement-entry-field">

                        <label>
                            Дата
                        </label>

                        <input
                            className="measurement-date-input"
                            type="date"
                            value={measurementDate}
                            onChange={(event) =>
                                setMeasurementDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <div className="measurement-entry-field">

                        <label>
                            Значение
                        </label>

                        <div className="measurement-value-input">

                            <input
                                type="text"
                                inputMode="decimal"
                                placeholder="0"
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


                        <span className="measurement-entry-hint">
                            Если запись на эту дату уже существует,
                            её значение будет обновлено.
                        </span>

                    </div>


                    <button
                        type="button"
                        className="measurement-save-button"
                        onClick={saveMeasurement}
                    >
                        {editingDate !== null
                            ? 'Сохранить изменения'
                            : '+ Добавить запись'
                        }
                    </button>


                    {editingDate !== null && (
                        <button
                            type="button"
                            className="measurement-edit-cancel"
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
                            Отменить редактирование
                        </button>
                    )}

                </div>


                <section className="measurement-detail-section">

                    <div className="measurement-detail-section-header">

                        <div>
                            <span>
                                Динамика
                            </span>

                            <h3>
                                Прогресс
                            </h3>
                        </div>

                        <div className="measurement-unit-badge">
                            {measurement.unit}
                        </div>

                    </div>


                    <MeasurementChart
                        history={measurement.history}
                        unit={measurement.unit}
                    />

                </section>


                <section className="measurement-detail-section">

                    <div className="measurement-detail-section-header">

                        <div>
                            <span>
                                Журнал
                            </span>

                            <h3>
                                История
                            </h3>
                        </div>


                        {measurement.history.length > 0 && (
                            <div className="measurement-history-count">
                                {measurement.history.length}
                            </div>
                        )}

                    </div>


                    {measurement.history.length === 0 ? (

                        <div className="measurement-history-empty">
                            Пока нет измерений
                        </div>

                    ) : (

                        <div className="measurement-history">

                            {measurement.history.map(
                                (entry) => (

                                    <div
                                        className="measurement-history-row"
                                        key={entry.date}
                                    >

                                        <div className="measurement-history-data">

                                            <div>
                                                <span>
                                                    Запись
                                                </span>

                                                <strong>
                                                    {formatMeasurementDate(
                                                        entry.date
                                                    )}
                                                </strong>
                                            </div>


                                            <div className="measurement-history-value">

                                                <strong>
                                                    {entry.value}
                                                </strong>

                                                <span>
                                                    {measurement.unit}
                                                </span>

                                            </div>

                                        </div>


                                        <div className="measurement-history-actions">

                                            <button
                                                type="button"
                                                className="measurement-history-edit"
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
                                                className="measurement-history-delete"
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

                                )
                            )}

                        </div>

                    )}

                </section>


                {isCustomMeasurement && (
                    <button
                        type="button"
                        className="delete-measurement-button"
                        onClick={deleteMeasurement}
                    >
                        Удалить показатель и всю историю
                    </button>
                )}

            </div>
        )
    }

    return (
        <div className="measurements">

            {!isTelegramMiniApp && (
                <button
                    type="button"
                    className="measurement-back-button"
                    onClick={goBack}
                >
                    ← Назад
                </button>
            )}


            <div className="measurements-header">

                <span className="measurements-eyebrow">
                    Тело и показатели
                </span>

                <h2>
                    Измерения
                </h2>

                <p>
                    Отслеживай изменения тела
                    и любые другие показатели со временем.
                </p>

            </div>


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

                                <div className="measurement-card-info">

                                    <span className="measurement-card-name">
                                        {measurement.name}
                                    </span>

                                    <span className="measurement-card-status">
                                        {latest
                                            ? `Последняя запись · ${latest.date}`
                                            : 'Записей пока нет'
                                        }
                                    </span>

                                </div>


                                <div className="measurement-card-value">

                                    <strong>
                                        {latest
                                            ? latest.value
                                            : '—'
                                        }
                                    </strong>

                                    <span>
                                        {measurement.unit}
                                    </span>

                                </div>


                                <span className="measurement-card-arrow">
                                    ›
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
                    onClick={() => {
                        setIsAddingMeasurement(true)
                        setNewMeasurementError('')
                    }}
                >

                    <span className="add-measurement-icon">
                        +
                    </span>

                    <span>
                        Добавить измерение
                    </span>

                </button>

            ) : (

                <div className="new-measurement-form">

                    <div className="new-measurement-header">

                        <span>
                            Новый показатель
                        </span>

                        <p>
                            Добавь то, что хочешь
                            отслеживать регулярно.
                        </p>

                    </div>


                    <div className="new-measurement-field">

                        <label>
                            Название
                        </label>

                        <input
                            type="text"
                            placeholder="Например: Обхват талии"
                            value={newMeasurementName}
                            onFocus={(event) =>
                                event.target.select()
                            }
                            onChange={(event) => {
                                setNewMeasurementName(
                                    event.target.value
                                )

                                setNewMeasurementError('')
                            }}
                        />

                        <span className="new-measurement-hint">
                            Название показателя,
                            который хочешь отслеживать.
                        </span>

                    </div>


                    <div className="new-measurement-field">

                        <label>
                            Единица измерения
                        </label>

                        <input
                            type="text"
                            placeholder="Например: см"
                            value={newMeasurementUnit}
                            onFocus={(event) =>
                                event.target.select()
                            }
                            onChange={(event) => {
                                setNewMeasurementUnit(
                                    event.target.value
                                )

                                setNewMeasurementError('')
                            }}
                        />

                        <span className="new-measurement-hint">
                            Лучше использовать короткое обозначение:
                            см, кг, %, мм.
                        </span>

                    </div>


                    {newMeasurementError && (
                        <div className="new-measurement-error">
                            {newMeasurementError}
                        </div>
                    )}


                    <div className="new-measurement-actions">

                        <button
                            type="button"
                            className="new-measurement-submit"
                            onClick={addCustomMeasurement}
                        >
                            <span>+</span>
                            Создать показатель
                        </button>


                        <button
                            type="button"
                            className="new-measurement-cancel"
                            onClick={() => {
                                setIsAddingMeasurement(false)
                                setNewMeasurementName('')
                                setNewMeasurementUnit('')
                                setNewMeasurementError('')
                            }}
                        >
                            Отмена
                        </button>

                    </div>

                </div>

            )}
          
            <section className="backup-section">

                <div className="backup-section-header">

                    <span>
                        Данные приложения
                    </span>

                    <h3>
                        Резервная копия
                    </h3>

                    <p>
                        Сохрани тренировки,
                        измерения и свои упражнения
                        в отдельный файл.
                    </p>

                </div>


                <button
                    type="button"
                    className="backup-export-button"
                    onClick={onExportBackup}
                >
                    Экспортировать данные
                </button>

            </section>
        </div>
    )
}

export default Measurements