import { useState } from 'react'
import './Calendar.css'

function Calendar({
    selectedDate,
    setSelectedDate
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
                    {week.map((day) => (
                        <button
                            type="button"
                            key={day.date.toDateString()}
                            onClick={() =>
                                setSelectedDate(day.date)
                            }
                        >
                            <span>
                                {day.name}
                            </span>

                            <span>
                                {day.date.getDate()}
                            </span>

                            {selectedDate.toDateString() ===
                            day.date.toDateString()
                                ? '●'
                                : ''}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={() => changeWeek(1)}
                >
                    ›
                </button>

            </div>

            {isMonthPickerOpen && (
                <div className="month-picker-overlay">

                    <div className="month-picker">

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
                                (month, index) => (
                                    <button
                                        type="button"
                                        key={month}
                                        onClick={() =>
                                            selectMonth(index)
                                        }
                                    >
                                        {month}
                                    </button>
                                )
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