function MeasurementChart({ history, unit }) {
    if (history.length === 0) {
        return (
            <p>Для графика пока нет данных</p>
        )
    }

    const sortedHistory = [...history].sort(
        (a, b) => a.date.localeCompare(b.date)
    )

    const width = 340
    const height = 220

    const paddingLeft = 48
    const paddingRight = 12
    const paddingTop = 14
    const paddingBottom = 34

    const graphWidth =
        width - paddingLeft - paddingRight

    const graphHeight =
        height - paddingTop - paddingBottom

    const values = sortedHistory.map(
        (entry) => Number(entry.value)
    )

    const dataMin = Math.min(...values)
    const dataMax = Math.max(...values)

    let minValue
    let maxValue

    if (dataMin === dataMax) {
        const extra =
            Math.max(Math.abs(dataMin) * 0.05, 1)

        minValue = dataMin - extra
        maxValue = dataMax + extra
    } else {
        const extra =
            (dataMax - dataMin) * 0.15

        minValue = dataMin - extra
        maxValue = dataMax + extra
    }

    const timestamps = sortedHistory.map(
        (entry) =>
            new Date(
                `${entry.date}T00:00:00`
            ).getTime()
    )

    const minTime = Math.min(...timestamps)
    const maxTime = Math.max(...timestamps)

    function getX(timestamp) {
        if (minTime === maxTime) {
            return paddingLeft + graphWidth / 2
        }

        return (
            paddingLeft +
            ((timestamp - minTime) /
                (maxTime - minTime)) *
                graphWidth
        )
    }

    function getY(value) {
        return (
            paddingTop +
            ((maxValue - value) /
                (maxValue - minValue)) *
                graphHeight
        )
    }

    const points = sortedHistory.map(
        (entry, index) => ({
            x: getX(timestamps[index]),
            y: getY(Number(entry.value)),
            value: Number(entry.value),
            date: entry.date
        })
    )

    const polylinePoints = points
        .map(
            (point) =>
                `${point.x},${point.y}`
        )
        .join(' ')

    const yTickCount = 5

    const yTicks = Array.from(
        { length: yTickCount },
        (_, index) => {

            const ratio =
                index / (yTickCount - 1)

            const value =
                maxValue -
                ratio * (maxValue - minValue)

            const y =
                paddingTop +
                ratio * graphHeight

            return {
                value,
                y
            }
        }
    )

    const xLabelIndexes = [
        ...new Set([
            0,
            Math.floor(
                (sortedHistory.length - 1) / 2
            ),
            sortedHistory.length - 1
        ])
    ]

    function formatValue(value) {
        return Number(
            value.toFixed(1)
        ).toString()
    }

    function formatDate(date) {
        const [year, month, day] =
            date.split('-')

        return `${day}.${month}`
    }

    return (
        <div className="measurement-chart">

            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="measurement-chart-svg"
            >

                {/* Горизонтальная сетка и ось Y */}
                {yTicks.map((tick, index) => (
                    <g key={index}>

                        <line
                            x1={paddingLeft}
                            y1={tick.y}
                            x2={
                                width -
                                paddingRight
                            }
                            y2={tick.y}
                            className="chart-grid-line"
                        />

                        <text
                            x={paddingLeft - 7}
                            y={tick.y + 4}
                            textAnchor="end"
                            className="chart-label"
                        >
                            {formatValue(
                                tick.value
                            )}
                        </text>

                    </g>
                ))}

                {/* Ось Y */}
                <line
                    x1={paddingLeft}
                    y1={paddingTop}
                    x2={paddingLeft}
                    y2={
                        height -
                        paddingBottom
                    }
                    className="chart-axis"
                />

                {/* Ось X */}
                <line
                    x1={paddingLeft}
                    y1={
                        height -
                        paddingBottom
                    }
                    x2={
                        width -
                        paddingRight
                    }
                    y2={
                        height -
                        paddingBottom
                    }
                    className="chart-axis"
                />

                {/* Подписи дат */}
                {xLabelIndexes.map((index) => {
                    const point = points[index]

                    return (
                        <text
                            key={point.date}
                            x={point.x}
                            y={height - 10}
                            textAnchor="middle"
                            className="chart-label"
                        >
                            {formatDate(
                                point.date
                            )}
                        </text>
                    )
                })}

                {/* Линия графика */}
                {points.length > 1 && (
                    <polyline
                        points={polylinePoints}
                        className="chart-progress-line"
                    />
                )}

                {/* Точки */}
                {points.map((point) => (
                    <circle
                        key={point.date}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        className="chart-point"
                    />
                ))}

                {/* Единица измерения */}
                <text
                    x="6"
                    y="12"
                    className="chart-unit"
                >
                    {unit}
                </text>

            </svg>

        </div>
    )
}

export default MeasurementChart