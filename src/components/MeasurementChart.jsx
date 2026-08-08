function MeasurementChart({ history, unit }) {
    if (history.length === 0) {
        return (
            <p>Для графика пока нет данных</p>
        )
    }

    const sortedHistory = [...history].sort(
        (a, b) => a.date.localeCompare(b.date)
    )

    const values = sortedHistory.map(
        (entry) => Number(entry.value)
    )

    let minValue = Math.min(...values)
    let maxValue = Math.max(...values)

    if (minValue === maxValue) {
        minValue -= 1
        maxValue += 1
    }

    const width = 320
    const height = 180
    const padding = 20

    const usableWidth = width - padding * 2
    const usableHeight = height - padding * 2

    const points = sortedHistory.map((entry, index) => {
        const x =
            sortedHistory.length === 1
                ? width / 2
                : padding +
                  (index / (sortedHistory.length - 1)) *
                      usableWidth

        const value = Number(entry.value)

        const y =
            padding +
            ((maxValue - value) /
                (maxValue - minValue)) *
                usableHeight

        return {
            x,
            y,
            value,
            date: entry.date
        }
    })

    const polylinePoints = points
        .map((point) => `${point.x},${point.y}`)
        .join(' ')

    return (
        <div className="measurement-chart">

            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="measurement-chart-svg"
            >
                {points.length > 1 && (
                    <polyline
                        points={polylinePoints}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                    />
                )}

                {points.map((point) => (
                    <circle
                        key={point.date}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="currentColor"
                    />
                ))}
            </svg>

            <div className="measurement-chart-info">

                <span>
                    {sortedHistory[0].date}
                </span>

                <span>
                    {minValue.toFixed(1)}
                    {' – '}
                    {maxValue.toFixed(1)}
                    {' '}
                    {unit}
                </span>

                <span>
                    {
                        sortedHistory[
                            sortedHistory.length - 1
                        ].date
                    }
                </span>

            </div>

        </div>
    )
}

export default MeasurementChart