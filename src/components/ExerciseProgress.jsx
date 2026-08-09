import exercises from '../data/exercises'
import MeasurementChart from './MeasurementChart'
import './ExerciseProgress.css'

function ExerciseProgress({
    exerciseId,
    workouts,
    customExercises,
    onBack
}) {
    const allExercises = [
        ...exercises,
        ...customExercises
]

    const exercise = allExercises.find(
    (item) =>
        item.id === exerciseId
    )

    if (!exercise) {
        return (
            <div>
                <button
                    type="button"
                    onClick={onBack}
                >
                    ← Назад
                </button>

                <p>Упражнение не найдено</p>
            </div>
        )
    }

    const history = Object.entries(workouts)
        .map(([date, workout]) => {
            const workoutExercise =
                workout.exercises.find(
                    (item) =>
                        item.exerciseId === exerciseId
                )

            if (!workoutExercise) {
                return null
            }

            const validSets =
                workoutExercise.sets.filter(
                    (set) =>
                        set.weight !== '' &&
                        !Number.isNaN(
                            Number(set.weight)
                        )
                )

            if (validSets.length === 0) {
                return null
            }

            const maxWeight = Math.max(
                ...validSets.map(
                    (set) => Number(set.weight)
                )
            )

            return {
                date: date,
                value: maxWeight.toString(),
                sets: workoutExercise.sets
            }
        })
        .filter((entry) => entry !== null)
        .sort(
            (a, b) =>
                b.date.localeCompare(a.date)
        )

    const chartHistory = history.map((entry) => ({
        date: entry.date,
        value: entry.value
    }))

    return (
        <div className="exercise-progress">

            <button
                type="button"
                onClick={onBack}
            >
                ← Назад
            </button>

            <h2>{exercise.name}</h2>

            <h3>Прогресс веса</h3>

            <MeasurementChart
                history={chartHistory}
                unit="кг"
            />

            <h3>История тренировок</h3>

            {history.length === 0 ? (
                <p>
                    Пока нет выполненных подходов
                </p>
            ) : (
                <div className="exercise-progress-history">

                    {history.map((entry) => (
                        <div
                            className="exercise-progress-workout"
                            key={entry.date}
                        >
                            <div className="exercise-progress-date">

                                <span>
                                    {entry.date}
                                </span>

                                <span>
                                    максимум {entry.value} кг
                                </span>

                            </div>

                            <div className="exercise-progress-sets">

                                {entry.sets.map(
                                    (set, index) => (
                                        <div
                                            className="exercise-progress-set"
                                            key={index}
                                        >
                                            <span>
                                                {index + 1}
                                            </span>

                                            <span>
                                                {set.weight || '—'} кг
                                            </span>

                                            <span>
                                                {set.reps || '—'} повт
                                            </span>
                                        </div>
                                    )
                                )}

                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    )
}

export default ExerciseProgress