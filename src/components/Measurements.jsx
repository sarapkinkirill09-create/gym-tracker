import './Measurements.css'

function Measurements({ onBack }) {
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

                <button
                    type="button"
                    className="measurement-card"
                >
                    <span>Вес</span>
                    <span>— кг</span>
                </button>

                <button
                    type="button"
                    className="measurement-card"
                >
                    <span>Рост</span>
                    <span>— см</span>
                </button>

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