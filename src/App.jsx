import { useEffect, useState } from 'react'
import './App.css'

import Calendar from './components/Calendar'
import WorkoutHeader from './components/WorkoutHeader'
import ExerciseList from './components/ExerciseList'
import BottomMenu from './components/BottomMenu'
import ExerciseCatalog from './components/ExerciseCatalog'
import Toast from './components/Toast'
import Measurements from './components/Measurements'

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem('gymTrackerWorkouts')

    if (!savedWorkouts) {
        return {}
    }

    try {
        return JSON.parse(savedWorkouts)
    } catch {
        return {}
    }
})
    const [currentScreen, setCurrentScreen] = useState('workout')
    const [catalogMode, setCatalogMode] = useState('browse')
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        localStorage.setItem(
            'gymTrackerWorkouts',
            JSON.stringify(workouts)
        )
    }, [workouts])

    const dateKey = selectedDate.toLocaleDateString('sv-SE')

    const currentWorkout = workouts[dateKey] || {
        name: '',
        exercises: []
    }

    function showToast(message) {
    setToastMessage(message)

    setTimeout(() => {
        setToastMessage('')
    }, 3000)
}

    function addExerciseToWorkout(exercise) {
        const alreadyAdded = currentWorkout.exercises.some(
            (item) => item.exerciseId === exercise.id
        )

        if (alreadyAdded) {
          setCurrentScreen('workout')
         showToast('Упражнение уже добавлено')
         return
        }

        const newExercise = {
            exerciseId: exercise.id,
            sets: []
        }

        setWorkouts({
            ...workouts,

            [dateKey]: {
                ...currentWorkout,

                exercises: [
                    ...currentWorkout.exercises,
                    newExercise
                ]
            }
        })

        setCurrentScreen('workout')
    }

    function addSetToExercise(exerciseId) {
        setWorkouts((previousWorkouts) => {
            const workout = previousWorkouts[dateKey] || {
                name: '',
                exercises: []
            }

            const updatedExercises = workout.exercises.map(
                (exercise) => {
                if (exercise.exerciseId === exerciseId) {
                    const previousSet =
                        exercise.sets[exercise.sets.length - 1]

                    const newSet = previousSet
                        ? {
                            weight: previousSet.weight,
                            reps: previousSet.reps
                        }
                        : {
                            weight: '',
                            reps: ''
                        }

                    return {
                        ...exercise,

                        sets: [
                            ...exercise.sets,
                            newSet
                        ]
                    }
                }

                    return exercise
                }
            )

            return {
                ...previousWorkouts,

                [dateKey]: {
                    ...workout,
                    exercises: updatedExercises
                }
            }
        })
    }

    function updateSet(
        exerciseId,
        setIndex,
        field,
        value
    ) {
        setWorkouts((previousWorkouts) => {
            const workout = previousWorkouts[dateKey]

            if (!workout) {
                return previousWorkouts
            }

            const updatedExercises = workout.exercises.map(
                (exercise) => {
                    if (exercise.exerciseId !== exerciseId) {
                        return exercise
                    }

                    const updatedSets = exercise.sets.map(
                        (set, index) => {
                            if (index !== setIndex) {
                                return set
                            }

                            return {
                                ...set,
                                [field]: value
                            }
                        }
                    )

                    return {
                        ...exercise,
                        sets: updatedSets
                    }
                }
            )

            return {
                ...previousWorkouts,

                [dateKey]: {
                    ...workout,
                    exercises: updatedExercises
                }
            }
        })
    }

    function deleteSet(exerciseId, setIndex) {
        setWorkouts((previousWorkouts) => {
            const workout = previousWorkouts[dateKey]

            if (!workout) {
                return previousWorkouts
            }

            const updatedExercises = workout.exercises.map(
                (exercise) => {
                    if (exercise.exerciseId !== exerciseId) {
                        return exercise
                    }

                    const updatedSets = exercise.sets.filter(
                        (set, index) => index !== setIndex
                    )

                    return {
                        ...exercise,
                        sets: updatedSets
                    }
                }
            )

            return {
                ...previousWorkouts,

                [dateKey]: {
                    ...workout,
                    exercises: updatedExercises
                }
            }
        })
    }

    function deleteExercise(exerciseId) {
        setWorkouts((previousWorkouts) => {
            const workout = previousWorkouts[dateKey]

            if (!workout) {
                return previousWorkouts
            }

            const updatedExercises = workout.exercises.filter(
                (exercise) =>
                    exercise.exerciseId !== exerciseId
            )

            return {
                ...previousWorkouts,

                [dateKey]: {
                    ...workout,
                    exercises: updatedExercises
                }
            }
        })
    }

    return (
        <div className="app">
            {currentScreen === 'workout' ? (
                <>
                    {/* Gym Tracker */}

                    <Calendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />

                    <WorkoutHeader
                        dateKey={dateKey}
                        workouts={workouts}
                        setWorkouts={setWorkouts}
                    />

                    <ExerciseList
                        workout={currentWorkout}
                        onAddSet={addSetToExercise}
                        onUpdateSet={updateSet}
                        onDeleteSet={deleteSet}
                        onDeleteExercise={deleteExercise}
                        onAddExercise={() => {
                            setCatalogMode('select')
                            setCurrentScreen('exercises')
                        }}
                    />

                    <BottomMenu
                        onOpenExercises={() => {
                            setCatalogMode('browse')
                            setCurrentScreen('exercises')
                        }}

                        onOpenMeasurements={() => {
                            setCurrentScreen('measurements')
                        }}
                    />
                </>
            ) : currentScreen === 'exercises' ? (
                <ExerciseCatalog
                    onBack={() =>
                        setCurrentScreen('workout')
                    }
                    mode={catalogMode}
                    onSelectExercise={addExerciseToWorkout}
                />
            ) : (
                <Measurements
                    onBack={() =>
                        setCurrentScreen('workout')
                    }
                />
            )}

            <Toast message={toastMessage} />
        </div>
    )
}

export default App