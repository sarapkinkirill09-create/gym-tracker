import './WorkoutHeader.css'

function WorkoutHeader({
    dateKey,
    workouts,
    setWorkouts
}) {
    const workout = workouts[dateKey] || {
        name: '',
        exercises: []
    }

    const totalSets = workout.exercises.reduce(
        (sum, exercise) => sum + exercise.sets.length,
        0
    )

    function changeName(newName) {
        setWorkouts({
            ...workouts,

            [dateKey]: {
                ...workout,
                name: newName
            }
        })
    }

    return (
        <div className="workout-header">
            <input
                className="workout-name-input"
                type="text"
                placeholder="Введите название тренировки..."
                value={workout.name}
                onFocus={(event) => event.target.select()}
                onChange={(event) =>
                    changeName(event.target.value)
                }
/>

            <p>
                {workout.exercises.length} упражнений • {totalSets} подходов
            </p>
        </div>
    )
}

export default WorkoutHeader