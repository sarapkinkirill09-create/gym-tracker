import exercises from '../data/exercises'
import WorkoutExerciseCard from './WorkoutExerciseCard'

function ExerciseList({
    workout,
    onAddExercise,
    onAddSet,
    onUpdateSet,
    onDeleteSet,
    onDeleteExercise
}) {
    return (
        <div>
            <hr />

            {workout.exercises.length === 0 ? (
                <p>Пока нет упражнений</p>
            ) : (
                <div>
                    {workout.exercises.map((workoutExercise) => {

                        const exerciseData = exercises.find(
                            (exercise) =>
                                exercise.id === workoutExercise.exerciseId
                        )

                        if (!exerciseData) {
                            return null
                        }

                        return (
                            <WorkoutExerciseCard
                                key={workoutExercise.exerciseId}
                                exerciseData={exerciseData}
                                workoutExercise={workoutExercise}
                                onAddSet={onAddSet}
                                onUpdateSet={onUpdateSet}
                                onDeleteSet={onDeleteSet}
                                onDeleteExercise={onDeleteExercise}
                            />
                        )
                    })}
                </div>
            )}

            <button
                className="add-exercise-button"
                type="button"
                onClick={onAddExercise}
>
    + Добавить упражнение
</button>
            <hr />
        </div>
    )
}

export default ExerciseList