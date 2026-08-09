import './WorkoutExerciseCard.css'

function WorkoutExerciseCard({
    exerciseData,
    workoutExercise,
    previousPerformance,
    onAddSet,
    onUpdateSet,
    onDeleteSet,
    onDeleteExercise,
    onOpenProgress
}) {
    const setCount =
        workoutExercise.sets.length

    function formatDate(date) {
        const [year, month, day] =
            date.split('-')

        return `${day}.${month}`
    }

    return (
        <div className="workout-exercise-card">

            <div className="workout-exercise-header">

                <div className="workout-exercise-title-block">

                    <h3>
                        {exerciseData.name}
                    </h3>

                    {previousPerformance && (
                        <div className="previous-performance">
                            <span>
                                Прошлый раз:
                            </span>

                            <strong>
                                {previousPerformance.weight} кг
                                {' × '}
                                {previousPerformance.reps}
                            </strong>

                            <span>
                                · {formatDate(
                                    previousPerformance.date
                                )}
                            </span>
                        </div>
                    )}

                </div>

                <div className="workout-exercise-set-count">
                    {setCount}
                </div>

            </div>


            <div className="workout-exercise-divider" />


            <div className="workout-exercise-body">

                {workoutExercise.sets.length === 0 && (
                    <div className="no-sets-message">
                        Подходов пока нет
                    </div>
                )}

                <div className="workout-sets">

                    {workoutExercise.sets.map(
                        (set, index) => (
                            <div
                                className="workout-set"
                                key={index}
                            >

                                <div className="set-number">
                                    {index + 1}
                                </div>


                                <div className="set-field">

                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={set.weight}
                                        onFocus={(event) =>
                                            event.target.select()
                                        }
                                        onChange={(event) =>
                                            onUpdateSet(
                                                workoutExercise.exerciseId,
                                                index,
                                                'weight',
                                                event.target.value
                                            )
                                        }
                                    />

                                    <span>
                                        кг
                                    </span>

                                </div>


                                <div className="set-field">

                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={set.reps}
                                        onFocus={(event) =>
                                            event.target.select()
                                        }
                                        onChange={(event) =>
                                            onUpdateSet(
                                                workoutExercise.exerciseId,
                                                index,
                                                'reps',
                                                event.target.value
                                            )
                                        }
                                    />

                                    <span>
                                        повт
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="delete-set-button"
                                    onClick={() =>
                                        onDeleteSet(
                                            workoutExercise.exerciseId,
                                            index
                                        )
                                    }
                                >
                                    ×
                                </button>

                            </div>
                        )
                    )}

                </div>


                <div className="workout-exercise-actions">

                    <button
                        type="button"
                        className="exercise-action-button progress-button"
                        onClick={() =>
                            onOpenProgress(
                                workoutExercise.exerciseId
                            )
                        }
                    >
                        <span className="action-icon">
                            ↗
                        </span>

                        <span>
                            Прогресс
                        </span>
                    </button>


                    <button
                        type="button"
                        className="exercise-action-button add-set-button"
                        onClick={() =>
                            onAddSet(
                                workoutExercise.exerciseId,
                                previousPerformance
                            )
                        }
                    >
                        <span className="action-icon">
                            +
                        </span>

                        <span>
                            Подход
                        </span>
                    </button>


                    <button
                        type="button"
                        className="exercise-action-button delete-exercise-button"
                        onClick={() =>
                            onDeleteExercise(
                                workoutExercise.exerciseId
                            )
                        }
                    >
                        <span>
                            Удалить
                        </span>
                    </button>

                </div>

            </div>

        </div>
    )
}

export default WorkoutExerciseCard