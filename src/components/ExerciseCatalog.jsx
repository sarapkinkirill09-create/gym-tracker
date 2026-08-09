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
    setCustomExercises,
    deletedExerciseIds,
    onDeleteCatalogExercise,
    selectedGroup,
    setSelectedGroup
}) {

    const [searchQuery, setSearchQuery] =
        useState('')

    const [isAddingExercise, setIsAddingExercise] =
        useState(false)

    const [newExerciseName, setNewExerciseName] =
        useState('')

    const [newExerciseGroup, setNewExerciseGroup] =
        useState('')

    const [newExerciseSecondaryGroups,setNewExerciseSecondaryGroups] = 
        useState('')

    const [newExerciseError, setNewExerciseError] =
        useState('')

    const telegram = window.Telegram?.WebApp

    const isTelegramMiniApp =
        Boolean(telegram?.initData)

    const allExercises = [
        ...exercises,
        ...customExercises
    ].filter(
        (exercise) =>
            !deletedExerciseIds.includes(
                exercise.id
            )
    )

    const groupMap = new Map()

    allExercises.forEach((exercise) => {
        const exerciseGroups = [
            exercise.muscleGroup,
            ...(exercise.secondaryMuscleGroups || [])
        ]

        exerciseGroups.forEach((group) => {
            const groupKey =
                normalizeText(group)

            if (!groupMap.has(groupKey)) {
                groupMap.set(
                    groupKey,
                    capitalizeText(group)
                )
            }
        })
    })

    const groups = [
        ...groupMap.values()
    ]

    const filteredExercises =
        allExercises.filter((exercise) => {
            const exerciseGroups = [
                exercise.muscleGroup,
                ...(exercise.secondaryMuscleGroups || [])
            ]

            const correctGroup =
                selectedGroup === null ||
                exerciseGroups.some(
                    (group) =>
                        normalizeText(group) ===
                        normalizeText(selectedGroup)
                )

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
            setNewExerciseSecondaryGroups('')
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

        const enteredSecondaryGroups =
            newExerciseSecondaryGroups
                .split(',')
                .map((group) =>
                    cleanText(group)
                )
                .filter((group) =>
                    group !== ''
                )

        const existingGroup =
            groups.find(
                (group) =>
                    normalizeText(group) ===
                    normalizeText(enteredGroup)
            )

        const muscleGroup =
            existingGroup ||
            capitalizeText(enteredGroup)
            
        const secondaryMuscleGroups = []

            enteredSecondaryGroups.forEach(
                (enteredSecondaryGroup) => {

                    const normalizedSecondary =
                        normalizeText(
                            enteredSecondaryGroup
                        )

                    // Основную группу второй раз не добавляем.
                    if (
                        normalizedSecondary ===
                        normalizeText(muscleGroup)
                    ) {
                        return
                    }

                    // Повтор внутри дополнительных групп.
                    const alreadyAdded =
                        secondaryMuscleGroups.some(
                            (group) =>
                                normalizeText(group) ===
                                normalizedSecondary
                        )

                    if (alreadyAdded) {
                        return
                    }

                    // Проверяем, есть ли уже такая группа
                    // в нашем каталоге.
                    const existingSecondaryGroup =
                        groups.find(
                            (group) =>
                                normalizeText(group) ===
                                normalizedSecondary
                        )

                    secondaryMuscleGroups.push(
                        existingSecondaryGroup ||
                        capitalizeText(
                            enteredSecondaryGroup
                        )
                    )
                }
            )
   
        const newExercise = {
            id: `custom-${Date.now()}`,
            name: name,
            muscleGroup: muscleGroup,
            secondaryMuscleGroups:
                secondaryMuscleGroups
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
        setNewExerciseSecondaryGroups('')
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

                <input
                    type="text"
                    placeholder="Доп. группы через запятую"
                    value={newExerciseSecondaryGroups}
                    onFocus={(event) =>
                        event.target.select()
                    }
                    onChange={(event) => {
                        setNewExerciseSecondaryGroups(
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
                    <div
                        className="exercise-catalog-row"
                        key={exercise.id}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                handleExerciseClick(
                                    exercise
                                )
                            }
                        >
                            {exercise.name}
                        </button>

                        {mode === 'browse' && (
                            <button
                                type="button"
                                onClick={() =>
                                    onDeleteCatalogExercise(
                                        exercise
                                    )
                                }
                            >
                                ×
                            </button>
                        )}
                    </div>
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