import { useEffect, useState } from 'react'
import exercises from '../data/exercises'
import './ExerciseCatalog.css'

function ExerciseCatalog({
    onBack,
    mode,
    onSelectExercise
}) {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    const telegram = window.Telegram?.WebApp

    const isTelegramMiniApp = Boolean(telegram?.initData)

    const filteredExercises = exercises.filter((exercise) => {
        const correctGroup = exercise.muscleGroup === selectedGroup

        const correctSearch = exercise.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())

        return correctGroup && correctSearch
    })

    function goBack() {
        if (selectedGroup !== null) {
            setSelectedGroup(null)
            setSearchQuery('')
        } else {
            onBack()
        }
    }

    useEffect(() => {
        const backButton = telegram?.BackButton

        if (!backButton) {
            return
        }

        function handleTelegramBack() {
            if (selectedGroup !== null) {
                setSelectedGroup(null)
                setSearchQuery('')
            } else {
                onBack()
            }
        }

        backButton.show()
        backButton.onClick(handleTelegramBack)

        return () => {
            backButton.offClick(handleTelegramBack)
            backButton.hide()
        }
    }, [selectedGroup, onBack, telegram])

    function handleExerciseClick(exercise) {
        if (mode === 'select') {
            onSelectExercise(exercise)
        }
    }

    return (
        <div className="exercise-catalog">

            {!isTelegramMiniApp && (
                <button
                    type="button"
                    onClick={goBack}
                >
                    ← Назад
                </button>
            )}

            <h2>Упражнения</h2>

            {mode === 'select' && (
                <p>Выберите упражнение для тренировки</p>
            )}

            {selectedGroup === null ? (
                <div>
                    <button
                        type="button"
                        className="group-button"
                        onClick={() => setSelectedGroup('Ноги')}
                    >
                        Ноги
                    </button>
                </div>
            ) : (
                <div>
                    <h3>{selectedGroup}</h3>

                    <input
                        type="text"
                        placeholder="Поиск упражнения..."
                        value={searchQuery}
                        onFocus={(event) => event.target.select()}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                    />

                    <div className="exercise-cards">
                        {filteredExercises.map((exercise) => (
                            <div
                                className="exercise-card"
                                key={exercise.id}
                                onClick={() =>
                                    handleExerciseClick(exercise)
                                }
                            >
                                <p>{exercise.name}</p>
                            </div>
                        ))}
                    </div>

                    <button type="button">
                        + Добавить упражнение
                    </button>
                </div>
            )}

        </div>
    )
}

export default ExerciseCatalog