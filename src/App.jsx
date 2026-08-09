import { useEffect, useState } from 'react'
import './App.css'

import Calendar from './components/Calendar'
import WorkoutHeader from './components/WorkoutHeader'
import ExerciseList from './components/ExerciseList'
import BottomMenu from './components/BottomMenu'
import ExerciseCatalog from './components/ExerciseCatalog'
import Toast from './components/Toast'
import Measurements from './components/Measurements'
import ExerciseProgress from './components/ExerciseProgress'

function App() {
    const [selectedDate, setSelectedDate] = useState(new Date())

    const [workouts, setWorkouts] = useState(() => {
        const savedWorkouts =
            localStorage.getItem('gymTrackerWorkouts')

        if (!savedWorkouts) {
            return {}
        }

        try {
            return JSON.parse(savedWorkouts)
        } catch {
            return {}
        }
    })

    const [selectedExerciseId, setSelectedExerciseId] =
        useState(null)

    const [measurements, setMeasurements] = useState(() => {
        const savedMeasurements =
            localStorage.getItem('gymTrackerMeasurements')

        if (!savedMeasurements) {
            return {
                weight: {
                    name: 'Вес',
                    unit: 'кг',
                    history: []
                },

                height: {
                    name: 'Рост',
                    unit: 'см',
                    history: []
                }
            }
        }

        try {
            return JSON.parse(savedMeasurements)
        } catch {
            return {
                weight: {
                    name: 'Вес',
                    unit: 'кг',
                    history: []
                },

                height: {
                    name: 'Рост',
                    unit: 'см',
                    history: []
                }
            }
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

    useEffect(() => {
    localStorage.setItem(
        'gymTrackerMeasurements',
        JSON.stringify(measurements)
        )
    }, [measurements])

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

    function addSetToExercise(
        exerciseId,
        previousPerformance
    ) {
        setWorkouts((previousWorkouts) => {
            const workout = previousWorkouts[dateKey] || {
                name: '',
                exercises: []
            }

            const updatedExercises = workout.exercises.map(
                (exercise) => {
                    if (
                        exercise.exerciseId !== exerciseId
                    ) {
                        return exercise
                    }

                    const previousSet =
                        exercise.sets[
                            exercise.sets.length - 1
                        ]

                    let newSet

                    if (previousSet) {
                        // Если подходы уже есть —
                        // копируем предыдущий подход.
                        newSet = {
                            weight: previousSet.weight,
                            reps: previousSet.reps
                        }
                    } else if (previousPerformance) {
                        // Если это первый подход —
                        // берём лучший подход
                        // предыдущей тренировки.
                        newSet = {
                            weight:
                                previousPerformance.weight,
                            reps:
                                previousPerformance.reps
                        }
                    } else {
                        // Упражнение выполняется впервые.
                        newSet = {
                            weight: '',
                            reps: ''
                        }
                    }

                    return {
                        ...exercise,

                        sets: [
                            ...exercise.sets,
                            newSet
                        ]
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
                        workouts={workouts}
                        dateKey={dateKey}

                        onAddExercise={() => {
                            setCatalogMode('select')
                            setCurrentScreen('exercises')
                        }}

                        onAddSet={addSetToExercise}
                        onUpdateSet={updateSet}
                        onDeleteSet={deleteSet}
                        onDeleteExercise={deleteExercise}

                        onOpenProgress={(exerciseId) => {
                            setSelectedExerciseId(exerciseId)
                            setCurrentScreen('exerciseProgress')
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
            ) : currentScreen === 'measurements' ? (
                <Measurements
                    onBack={() =>
                        setCurrentScreen('workout')
                    }
                    measurements={measurements}
                    setMeasurements={setMeasurements}
                />
            ) : (
                <ExerciseProgress
                    exerciseId={selectedExerciseId}
                    workouts={workouts}
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