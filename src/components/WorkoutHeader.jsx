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
    const exerciseCount =
        workout.exercises.length

    const setCount =
        totalSets

    function changeName(newName) {
        setWorkouts({
            ...workouts,

            [dateKey]: {
                ...workout,
                name: newName
            }
        })
    }

    function getWordForm(
        number,
        one,
        few,
        many
    ) {
        const lastTwoDigits =
            number % 100

        const lastDigit =
            number % 10

        if (
            lastTwoDigits >= 11 &&
            lastTwoDigits <= 14
        ) {
            return many
        }

        if (lastDigit === 1) {
            return one
        }

        if (
            lastDigit >= 2 &&
            lastDigit <= 4
        ) {
            return few
        }

        return many
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
                {exerciseCount}{' '}
                {getWordForm(
                    exerciseCount,
                    'упражнение',
                    'упражнения',
                    'упражнений'
                )}

                {' • '}

                {setCount}{' '}
                {getWordForm(
                    setCount,
                    'подход',
                    'подхода',
                    'подходов'
                )}
            </p>
        </div>
    )
}

export default WorkoutHeader