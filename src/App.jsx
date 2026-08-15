import { useEffect, useState } from 'react'
import './App.css'
import exercises from './data/exercises'

import {
    exportGymTrackerBackup
} from './utils/backup'

import {
    hapticLight,
    hapticMedium,
    hapticWarning,
    hapticError
} from './utils/haptics'

import {
    generateWorkoutPdf
} from './utils/generateWorkoutPdf'

import Calendar from './components/Calendar'
import WorkoutHeader from './components/WorkoutHeader'
import ExerciseList from './components/ExerciseList'
import BottomMenu from './components/BottomMenu'
import ExerciseCatalog from './components/ExerciseCatalog'
import Toast from './components/Toast'
import Measurements from './components/Measurements'
import ExerciseProgress from './components/ExerciseProgress'
import ConfirmModal from './components/ConfirmModal'

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

    const [selectedCatalogGroup, setSelectedCatalogGroup] =
        useState(null)

    const [exerciseProgressBackScreen, setExerciseProgressBackScreen] =
        useState('workout')

    const [customExercises, setCustomExercises] = useState(() => {
        const savedCustomExercises =
            localStorage.getItem('gymTrackerCustomExercises')

        if (!savedCustomExercises) {
            return []
        }

        try {
            return JSON.parse(savedCustomExercises)
        } catch {
            return []
        }
    })

    const [deletedExerciseIds, setDeletedExerciseIds] =
        useState(() => {
            const savedDeletedExerciseIds =
                localStorage.getItem(
                    'gymTrackerDeletedExerciseIds'
                )

            if (!savedDeletedExerciseIds) {
                return []
            }

            try {
                return JSON.parse(
                    savedDeletedExerciseIds
                )
            } catch {
                return []
            }
        })

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
    const [confirmDialog, setConfirmDialog] = useState(null)

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

    useEffect(() => {
        localStorage.setItem(
            'gymTrackerCustomExercises',
            JSON.stringify(customExercises)
        )
    }, [customExercises])

    useEffect(() => {
        localStorage.setItem(
            'gymTrackerDeletedExerciseIds',
            JSON.stringify(deletedExerciseIds)
        )
    }, [deletedExerciseIds])

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

    function downloadBackup() {

        exportGymTrackerBackup()

        hapticLight()

        showToast(
            'Резервная копия создана'
        )
    }

    function downloadWorkoutPdf() {

        const allExercises = [
            ...exercises,
            ...customExercises
        ].filter(
            (exercise) =>
                !deletedExerciseIds.includes(
                    exercise.id
                )
        )


        hapticLight()


        generateWorkoutPdf({
            dateKey,
            workout:
                currentWorkout,
            allExercises
        })
    }

    function openConfirmDialog({
        title,
        message,
        confirmText = 'Удалить',
        onConfirm
    }) {
        setConfirmDialog({
            title,
            message,
            confirmText,
            onConfirm
        })
    }


    function closeConfirmDialog() {
        setConfirmDialog(null)
    }


    function confirmDialogAction() {
        if (!confirmDialog) {
            return
        }

        const action =
            confirmDialog.onConfirm

        setConfirmDialog(null)

        action()
    }

    function addExerciseToWorkout(exercise) {
        const alreadyAdded = currentWorkout.exercises.some(
            (item) => item.exerciseId === exercise.id
        )

        if (alreadyAdded) {
            hapticError()

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

        hapticLight()

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

        hapticLight()
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

        hapticMedium()
    }

    function moveExercise(
        activeExerciseId,
        overExerciseId
    ) {
        /*
            Если упражнение отпустили
            на то же самое место —
            ничего не делаем.
        */
        if (
            activeExerciseId ===
            overExerciseId
        ) {
            return
        }


        setWorkouts((previousWorkouts) => {

            const workout =
                previousWorkouts[dateKey]


            if (!workout) {
                return previousWorkouts
            }


            /*
                Находим старую и новую
                позицию упражнения.
            */

            const oldIndex =
                workout.exercises.findIndex(
                    (exercise) =>
                        exercise.exerciseId ===
                        activeExerciseId
                )


            const newIndex =
                workout.exercises.findIndex(
                    (exercise) =>
                        exercise.exerciseId ===
                        overExerciseId
                )


            /*
                На всякий случай:
                если что-то не найдено,
                исходные данные не трогаем.
            */

            if (
                oldIndex === -1 ||
                newIndex === -1
            ) {
                return previousWorkouts
            }


            /*
                Создаём копию массива.

                Например:

                [A, B, C]

                переносим C на место A

                →

                [C, A, B]
            */

            const updatedExercises = [
                ...workout.exercises
            ]


            const [movedExercise] =
                updatedExercises.splice(
                    oldIndex,
                    1
                )


            updatedExercises.splice(
                newIndex,
                0,
                movedExercise
            )


            return {
                ...previousWorkouts,

                [dateKey]: {
                    ...workout,

                    exercises:
                        updatedExercises
                }
            }
        })


        /*
            Лёгкий отклик после
            успешной перестановки.
        */

        hapticLight()
    }

    function deleteExerciseFromCatalog(exercise) {

        openConfirmDialog({
            title: 'Удалить упражнение?',

            message:
                `«${exercise.name}» будет удалено ` +
                'из каталога, всех тренировок ' +
                'и истории прогресса.',

            confirmText: 'Удалить',

            onConfirm: () =>
                confirmDeleteExerciseFromCatalog(
                    exercise
                )
        })
    }


    function confirmDeleteExerciseFromCatalog(
        exercise
    ) {
        const isCustomExercise =
            typeof exercise.id === 'string' &&
            exercise.id.startsWith('custom-')


        if (isCustomExercise) {

            setCustomExercises(
                (previousExercises) =>
                    previousExercises.filter(
                        (item) =>
                            item.id !== exercise.id
                    )
            )

        } else {

            setDeletedExerciseIds(
                (previousIds) => {

                    if (
                        previousIds.includes(
                            exercise.id
                        )
                    ) {
                        return previousIds
                    }

                    return [
                        ...previousIds,
                        exercise.id
                    ]
                }
            )

        }


        /*
            Также удаляем упражнение
            из всех сохранённых тренировок.
        */
        setWorkouts((previousWorkouts) => {

            const updatedWorkouts = {}


            Object.entries(previousWorkouts)
                .forEach(([date, workout]) => {

                    updatedWorkouts[date] = {
                        ...workout,

                        exercises:
                            workout.exercises.filter(
                                (workoutExercise) =>
                                    workoutExercise.exerciseId !==
                                    exercise.id
                            )
                    }

                })


            return updatedWorkouts
        })

        hapticWarning()
        
        showToast(
            `«${exercise.name}» удалено`
        )
    }

    return (
        <div className="app">
            {currentScreen === 'workout' ? (
                <>
                    {/* Gym Tracker */}

                    <Calendar
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        workouts={workouts}
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
                        customExercises={customExercises}
                        deletedExerciseIds={deletedExerciseIds}

                        onAddExercise={() => {
                            setCatalogMode('select')
                            setSelectedCatalogGroup(null)
                            setCurrentScreen('exercises')
                        }}

                        onAddSet={addSetToExercise}
                        onUpdateSet={updateSet}
                        onDeleteSet={deleteSet}
                        onDeleteExercise={deleteExercise}

                        onMoveExercise={moveExercise}

                        onGeneratePdf={downloadWorkoutPdf}

                        onOpenProgress={(exerciseId) => {
                            setSelectedExerciseId(exerciseId)

                            setExerciseProgressBackScreen(
                                'workout'
                            )

                            setCurrentScreen(
                                'exerciseProgress'
                            )
                        }}
                    />

                    <BottomMenu

                        onOpenExercises={() => {
                            setCatalogMode('browse')

                            setSelectedCatalogGroup(null)

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
                    customExercises={customExercises}
                    setCustomExercises={setCustomExercises}
                    deletedExerciseIds={deletedExerciseIds}
                    onDeleteCatalogExercise={deleteExerciseFromCatalog}
                    selectedGroup={selectedCatalogGroup}
                    setSelectedGroup={setSelectedCatalogGroup}

                    onOpenProgress={(exerciseId) => {
                        setSelectedExerciseId(exerciseId)

                        setExerciseProgressBackScreen(
                            'exercises'
                        )

                        setCurrentScreen(
                            'exerciseProgress'
                        )
                    }}
                />
            ) : currentScreen === 'measurements' ? (
                <Measurements
                    onBack={() =>
                        setCurrentScreen('workout')
                    }
                    measurements={measurements}
                    setMeasurements={setMeasurements}
                    onRequestConfirm={openConfirmDialog}
                    onExportBackup={downloadBackup}
                />
            ) : (
                <ExerciseProgress
                    exerciseId={selectedExerciseId}
                    workouts={workouts}
                    customExercises={customExercises}
                    deletedExerciseIds={deletedExerciseIds}

                    onBack={() =>
                        setCurrentScreen(
                            exerciseProgressBackScreen
                        )
                    }
                />
             )}

            {confirmDialog && (
                <ConfirmModal
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    confirmText={
                        confirmDialog.confirmText
                    }
                    onCancel={
                        closeConfirmDialog
                    }
                    onConfirm={
                        confirmDialogAction
                    }
                />
            )}

            <Toast message={toastMessage} />
        </div>
    )
}

export default App