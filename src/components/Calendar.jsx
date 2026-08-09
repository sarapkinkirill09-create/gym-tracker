import { useState } from 'react'
import './Calendar.css'

function Calendar({
    selectedDate,
    setSelectedDate,
    workouts
}) {
    const dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']

    const monthNames = [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек'
    ]

    const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false)

    const [pickerYear, setPickerYear] = useState(
        selectedDate.getFullYear()
    )

    const dayOfWeek = selectedDate.getDay()

    const mondayOffset =
        dayOfWeek === 0 ? -6 : 1 - dayOfWeek

    const monday = new Date(selectedDate)

    monday.setDate(
        selectedDate.getDate() + mondayOffset
    )

    const week = dayNames.map((name, index) => {
        const date = new Date(monday)

        date.setDate(
            monday.getDate() + index
        )

        return {
            name,
            date
        }
    })

    function getDateKey(date) {
        return date.toLocaleDateString('sv-SE')
    }

    function hasWorkoutPlan(date) {
        const dateKey = getDateKey(date)

        const workout = workouts[dateKey]

        if (!workout) {
            return false
        }

        const hasName =
            workout.name?.trim() !== ''

        const hasExercises =
            workout.exercises?.length > 0

        return hasName || hasExercises
    }

    function changeWeek(direction) {
        const newDate = new Date(selectedDate)

        newDate.setDate(
            selectedDate.getDate() + direction * 7
        )

        setSelectedDate(newDate)
    }

    function openMonthPicker() {
        setPickerYear(
            selectedDate.getFullYear()
        )

        setIsMonthPickerOpen(true)
    }

    function selectMonth(monthIndex) {
        const currentDay = selectedDate.getDate()

        const lastDayOfMonth = new Date(
            pickerYear,
            monthIndex + 1,
            0
        ).getDate()

        const safeDay = Math.min(
            currentDay,
            lastDayOfMonth
        )

        const newDate = new Date(
            pickerYear,
            monthIndex,
            safeDay
        )

        setSelectedDate(newDate)
        setIsMonthPickerOpen(false)
    }

    return (
        <div>
            <button
                className="month-button"
                onClick={openMonthPicker}
            >
                {selectedDate.toLocaleString(
                    'ru-RU',
                    {
                        month: 'long'
                    }
                )}
            </button>

            <div className="week-navigation">

                <button
                    type="button"
                    onClick={() => changeWeek(-1)}
                >
                    ‹
                </button>

                <div className="calendar">
                    {week.map((day) => {
                        const isSelected =
                            selectedDate.toDateString() ===
                            day.date.toDateString()

                        const hasPlan =
                            hasWorkoutPlan(day.date)

                        let dayClassName =
                            'calendar-day'

                        if (isSelected) {
                            dayClassName += ' selected'
                        } else if (hasPlan) {
                            dayClassName += ' planned'
                        }

                        return (
                            <button
                                type="button"
                                key={day.date.toDateString()}
                                className={dayClassName}
                                onClick={() =>
                                    setSelectedDate(day.date)
                                }
                            >
                                <span className="calendar-day-name">
                                    {day.name}
                                </span>

                                <span className="calendar-day-number">
                                    {day.date.getDate()}
                                </span>

                                <span className="calendar-day-dot" />
                            </button>
                        )
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => changeWeek(1)}
                >
                    ›
                </button>

            </div>

            {isMonthPickerOpen && (
                <div
                    className="month-picker-overlay"
                    onClick={() =>
                        setIsMonthPickerOpen(false)
                    }
                >

                    <div
                        className="month-picker"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="year-navigation">

                            <button
                                type="button"
                                onClick={() =>
                                    setPickerYear(
                                        pickerYear - 1
                                    )
                                }
                            >
                                ‹
                            </button>

                            <h2>
                                {pickerYear}
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setPickerYear(
                                        pickerYear + 1
                                    )
                                }
                            >
                                ›
                            </button>

                        </div>

                        <div className="month-grid">
                            {monthNames.map(
                                (month, index) => {

                                    const isSelectedMonth =
                                        pickerYear ===
                                            selectedDate.getFullYear() &&
                                        index ===
                                            selectedDate.getMonth()

                                    return (
                                        <button
                                            type="button"
                                            key={month}
                                            className={
                                                isSelectedMonth
                                                    ? 'selected-month'
                                                    : ''
                                            }
                                            onClick={() =>
                                                selectMonth(index)
                                            }
                                        >
                                            {month}
                                        </button>
                                    )
                                }
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setIsMonthPickerOpen(false)
                            }
                        >
                            Закрыть
                        </button>

                    </div>

                </div>
            )}
        </div>
    )
}

export default Calendar