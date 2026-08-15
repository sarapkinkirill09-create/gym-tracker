import {
    DndContext,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors
} from '@dnd-kit/core'

import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'

import exercises from '../data/exercises'
import WorkoutExerciseCard from './WorkoutExerciseCard'

function ExerciseList({
    workout,
    workouts,
    dateKey,
    customExercises,
    deletedExerciseIds,
    onAddExercise,
    onAddSet,
    onUpdateSet,
    onDeleteSet,
    onMoveExercise,
    onDeleteExercise,
    onOpenProgress
}) {

        const sensors = useSensors(
            useSensor(
                PointerSensor,
                {
                    activationConstraint: {
                        distance: 6
                    }
                }
            )
        )


        function handleDragEnd(event) {
            const {
                active,
                over
            } = event


            if (!over) {
                return
            }


            if (
                active.id ===
                over.id
            ) {
                return
            }


            onMoveExercise(
                active.id,
                over.id
            )
        }

    const allExercises = [
        ...exercises,
        ...customExercises
    ].filter(
        (exercise) =>
            !deletedExerciseIds.includes(
                exercise.id
            )
    )

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

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={workout.exercises.map(
                            (exercise) =>
                                exercise.exerciseId
                        )}
                        strategy={
                            verticalListSortingStrategy
                        }
                    >
                            <div>
                                {workout.exercises.map(
                                    (workoutExercise) => {

                                        const exerciseData =
                                            allExercises.find(
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

                                                onAddSet={
                                                    onAddSet
                                                }

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
                        </SortableContext>
                    </DndContext>
            )}

            <button
                type="button"
                className="add-exercise-button"
                onClick={onAddExercise}
            >
                <span className="add-exercise-icon">
                    +
                </span>

                <span>
                    Добавить упражнение
                </span>
            </button>
        </>
    )
}

export default ExerciseList