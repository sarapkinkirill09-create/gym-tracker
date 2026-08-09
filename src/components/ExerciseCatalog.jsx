import { useEffect, useState } from 'react'
import exercises from '../data/exercises'

import {
    cleanText,
    normalizeText,
    capitalizeText
} from '../utils/text'

function ExerciseCatalog({
    onBack,
    mode,
    onSelectExercise,
    onOpenProgress,
    customExercises,
    setCustomExercises
}) {
    const [selectedGroup, setSelectedGroup] =
        useState(null)

    const [searchQuery, setSearchQuery] =
        useState('')

    const [isAddingExercise, setIsAddingExercise] =
        useState(false)

    const [newExerciseName, setNewExerciseName] =
        useState('')

    const [newExerciseGroup, setNewExerciseGroup] =
        useState('')

    const [newExerciseError, setNewExerciseError] =
        useState('')

    const telegram = window.Telegram?.WebApp

    const isTelegramMiniApp =
        Boolean(telegram?.initData)

    const allExercises = [
        ...exercises,
        ...customExercises
    ]

    const groupMap = new Map()

allExercises.forEach((exercise) => {
    const groupKey =
        normalizeText(exercise.muscleGroup)

    if (!groupMap.has(groupKey)) {
        groupMap.set(
            groupKey,
            capitalizeText(
                exercise.muscleGroup
            )
        )
    }
})

const groups = [
    ...groupMap.values()
]

    const filteredExercises =
        allExercises.filter((exercise) => {
            const correctGroup =
                selectedGroup === null ||
                normalizeText(exercise.muscleGroup) ===
                    normalizeText(selectedGroup)

            const correctSearch =
    normalizeText(exercise.name)
        .includes(
            normalizeText(searchQuery)
        )

            return (
                correctGroup &&
                correctSearch
            )
        })

    function goBack() {
        if (isAddingExercise) {
            setIsAddingExercise(false)
            setNewExerciseName('')
            setNewExerciseGroup('')
            setNewExerciseError('')
            return
        }

        if (selectedGroup !== null) {
            setSelectedGroup(null)
            setSearchQuery('')
            return
        }

        onBack()
    }

    function handleExerciseClick(exercise) {
        if (mode === 'select') {
            onSelectExercise(exercise)
        } else {
            onOpenProgress(exercise.id)
        }
    }

    function createExercise() {
        const name =
            cleanText(newExerciseName)

        const enteredGroup =
            cleanText(newExerciseGroup)

        if (
            name === '' ||
            enteredGroup === ''
        ) {
            setNewExerciseError(
                'Введите название и группу мышц'
            )

            return
        }

        const alreadyExists =
            allExercises.some(
                (exercise) =>
                    normalizeText(exercise.name) ===
                    normalizeText(name)
            )

        if (alreadyExists) {
            setNewExerciseError(
                'Упражнение с таким названием уже существует'
            )

            return
        }

        const existingGroup =
            groups.find(
                (group) =>
                    normalizeText(group) ===
                    normalizeText(enteredGroup)
            )

        const muscleGroup =
            existingGroup ||
            capitalizeText(enteredGroup)
            
        const newExercise = {
            id: `custom-${Date.now()}`,
            name: name,
            muscleGroup: muscleGroup
        }

        setCustomExercises(
            (previousExercises) => [
                ...previousExercises,
                newExercise
            ]
        )

        setNewExerciseName('')
        setNewExerciseGroup('')
        setNewExerciseError('')
        setIsAddingExercise(false)

        if (mode === 'select') {
            onSelectExercise(newExercise)
        }
    }

    useEffect(() => {
        const backButton =
            telegram?.BackButton

        if (!backButton) {
            return
        }

        function handleTelegramBack() {
            goBack()
        }

        backButton.show()

        backButton.onClick(
            handleTelegramBack
        )

        return () => {
            backButton.offClick(
                handleTelegramBack
            )

            backButton.hide()
        }
    }, [
        selectedGroup,
        isAddingExercise,
        onBack,
        telegram
    ])

    if (isAddingExercise) {
        return (
            <div className="exercise-catalog">

                {!isTelegramMiniApp && (
                    <button
                        type="button"
                        onClick={goBack}
                    >
                        ← Назад
                    </button>
                )}

                <h2>
                    Новое упражнение
                </h2>

                <input
                    type="text"
                    placeholder="Название упражнения"
                    value={newExerciseName}
                    onFocus={(event) =>
                        event.target.select()
                    }
                    onChange={(event) => {
                        setNewExerciseName(
                            event.target.value
                        )

                        setNewExerciseError('')
                    }}
                />

                <input
                    type="text"
                    placeholder="Группа мышц"
                    value={newExerciseGroup}
                    onFocus={(event) =>
                        event.target.select()
                    }
                    onChange={(event) => {
                        setNewExerciseGroup(
                            event.target.value
                        )

                        setNewExerciseError('')
                    }}
                />

                {newExerciseError && (
                    <p>
                        {newExerciseError}
                    </p>
                )}

                <button
                    type="button"
                    onClick={createExercise}
                >
                    Создать упражнение
                </button>

                <button
                    type="button"
                    onClick={goBack}
                >
                    Отмена
                </button>

            </div>
        )
    }

    return (
        <div className="exercise-catalog">

            {!isTelegramMiniApp && (
                <button
                    type="button"
                    onClick={goBack}
                >
                    ← Назад
                </button>
            )}

            <h2>
                {mode === 'select'
                    ? 'Добавить упражнение'
                    : 'Упражнения'
                }
            </h2>

            <input
                type="text"
                placeholder="Поиск упражнения..."
                value={searchQuery}
                onFocus={(event) =>
                    event.target.select()
                }
                onChange={(event) =>
                    setSearchQuery(
                        event.target.value
                    )
                }
            />

            <button
                type="button"
                onClick={() => {
                    setIsAddingExercise(true)
                    setNewExerciseError('')

                    if (selectedGroup !== null) {
                        setNewExerciseGroup(
                            selectedGroup
                        )
                    }
                }}
            >
                + Создать упражнение
            </button>

            {selectedGroup === null &&
            searchQuery.trim() === '' ? (

                <div className="exercise-groups">

                    {groups.map((group) => (
                        <button
                            key={group}
                            type="button"
                            onClick={() => {
                                setSelectedGroup(
                                    group
                                )

                                setSearchQuery('')
                            }}
                        >
                            {group}
                        </button>
                    ))}

                </div>

            ) : (

                <div className="exercise-list">

                    {selectedGroup !== null && (
                        <h3>
                            {selectedGroup}
                        </h3>
                    )}

                    {filteredExercises.map(
                        (exercise) => (
                            <button
                                key={exercise.id}
                                type="button"
                                onClick={() =>
                                    handleExerciseClick(
                                        exercise
                                    )
                                }
                            >
                                {exercise.name}
                            </button>
                        )
                    )}

                    {filteredExercises.length === 0 && (
                        <p>
                            Упражнение не найдено
                        </p>
                    )}

                </div>
            )}

        </div>
    )
}

export default ExerciseCatalog