import './WorkoutExerciseCard.css'

function WorkoutExerciseCard({
    exerciseData,
    workoutExercise,
    onAddSet,
    onUpdateSet,
    onDeleteSet,
    onDeleteExercise,
    onOpenProgress
}) {
    const setCount = workoutExercise.sets.length

    return (
        <div className="workout-exercise-card">

            <div className="workout-exercise-header">

                <div className="workout-exercise-image">
                    IMG
                </div>

                <h3>
                    {exerciseData.name}
                </h3>

                <div className="workout-exercise-set-count">
                    {setCount} подходов
                </div>

            </div>

            <div className="workout-exercise-body">

                {workoutExercise.sets.length === 0 && (
                    <p>Подходов пока нет</p>
                )}

                {workoutExercise.sets.map((set, index) => (
                    <div
                        className="workout-set"
                        key={index}
                    >
                        <span>{index + 1}</span>

                        <input
                            type="number"
                            placeholder="Вес"
                            value={set.weight}
                            onFocus={(event) => event.target.select()}
                            onChange={(event) =>
                                onUpdateSet(
                                    workoutExercise.exerciseId,
                                    index,
                                    'weight',
                                    event.target.value
                                )
                            }
                        />

                        <span>кг</span>

                        <input
                            type="number"
                            placeholder="Повт."
                            value={set.reps}
                            onFocus={(event) => event.target.select()}
                            onChange={(event) =>
                                onUpdateSet(
                                    workoutExercise.exerciseId,
                                    index,
                                    'reps',
                                    event.target.value
                                )
                            }
                        />

                        <span>повт</span>

                        <button
                            type="button"
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
                ))}

                <button
                    type="button"
                    onClick={() =>
                        onOpenProgress(workoutExercise.exerciseId)
                    }
                >
                    Прогресс
                </button>

                <button
                    type="button"
                    onClick={() =>
                        onAddSet(workoutExercise.exerciseId)
                    }
                >
                    + Добавить подход
                </button>

                <button
                    type="button"
                    className="delete-exercise-button"
                    onClick={() =>
                        onDeleteExercise(
                            workoutExercise.exerciseId
                        )
                    }
                >
                    Удалить упражнение
                </button>

            </div>

        </div>
    )
}

export default WorkoutExerciseCard