import exercises from '../data/exercises'
import WorkoutExerciseCard from './WorkoutExerciseCard'

function ExerciseList({
    workout,
    workouts,
    dateKey,
    onAddExercise,
    onAddSet,
    onUpdateSet,
    onDeleteSet,
    onDeleteExercise,
    onOpenProgress
}) {

    function getPreviousPerformance(exerciseId) {
        const previousDates = Object.keys(workouts)
            .filter((date) => date < dateKey)
            .sort((a, b) => b.localeCompare(a))

        for (const date of previousDates) {
            const previousWorkout = workouts[date]

            const previousExercise =
                previousWorkout.exercises.find(
                    (exercise) =>
                        exercise.exerciseId === exerciseId
                )

            if (!previousExercise) {
                continue
            }

            const validSets =
                previousExercise.sets.filter((set) => {
                    const weight = Number(set.weight)
                    const reps = Number(set.reps)

                    return (
                        set.weight !== '' &&
                        set.reps !== '' &&
                        !Number.isNaN(weight) &&
                        !Number.isNaN(reps)
                    )
                })

            if (validSets.length === 0) {
                continue
            }

            let bestSet = validSets[0]

            for (const set of validSets) {
                const weight = Number(set.weight)
                const bestWeight =
                    Number(bestSet.weight)

                const reps = Number(set.reps)
                const bestReps =
                    Number(bestSet.reps)

                if (
                    weight > bestWeight ||
                    (
                        weight === bestWeight &&
                        reps > bestReps
                    )
                ) {
                    bestSet = set
                }
            }

            return {
                date: date,
                weight: bestSet.weight,
                reps: bestSet.reps
            }
        }

        return null
    }

    return (
        <>
            {workout.exercises.length === 0 ? (
                <p>Пока нет упражнений</p>
            ) : (
                <div>
                    {workout.exercises.map(
                        (workoutExercise) => {

                            const exerciseData =
                                exercises.find(
                                    (exercise) =>
                                        exercise.id ===
                                        workoutExercise.exerciseId
                                )

                            if (!exerciseData) {
                                return null
                            }

                            const previousPerformance =
                                getPreviousPerformance(
                                    workoutExercise.exerciseId
                                )

                            return (
                                <WorkoutExerciseCard
                                    key={
                                        workoutExercise.exerciseId
                                    }
                                    exerciseData={
                                        exerciseData
                                    }
                                    workoutExercise={
                                        workoutExercise
                                    }
                                    previousPerformance={
                                        previousPerformance
                                    }
                                    onAddSet={onAddSet}
                                    onUpdateSet={
                                        onUpdateSet
                                    }
                                    onDeleteSet={
                                        onDeleteSet
                                    }
                                    onDeleteExercise={
                                        onDeleteExercise
                                    }
                                    onOpenProgress={
                                        onOpenProgress
                                    }
                                />
                            )
                        }
                    )}
                </div>
            )}

            <button
                className="add-exercise-button"
                type="button"
                onClick={onAddExercise}
            >
                + Добавить упражнение
            </button>
        </>
    )
}

export default ExerciseList