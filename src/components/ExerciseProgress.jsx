import { useEffect } from 'react'
import exercises from '../data/exercises'
import MeasurementChart from './MeasurementChart'
import './ExerciseProgress.css'

function ExerciseProgress({
    exerciseId,
    workouts,
    customExercises,
    deletedExerciseIds,
    onBack
}) {
        const telegram =
            window.Telegram?.WebApp

        const isTelegramMiniApp =
            Boolean(
                telegram &&
                telegram.platform &&
                telegram.platform !== 'unknown'
            )


        useEffect(() => {
            const backButton =
                telegram?.BackButton

            if (
                !isTelegramMiniApp ||
                !backButton
            ) {
                return
            }


            function handleTelegramBack() {
                onBack()
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
            onBack,
            telegram,
            isTelegramMiniApp
        ])
    /*
        Собираем встроенные и пользовательские
        упражнения в один общий список.
    */
    const allExercises = [
        ...exercises,
        ...customExercises
    ].filter(
        (exercise) =>
            !deletedExerciseIds.includes(
                exercise.id
            )
    )


    /*
        Находим упражнение, прогресс
        которого сейчас открыт.
    */
    const exercise = allExercises.find(
        (item) =>
            item.id === exerciseId
    )


    if (!exercise) {
        return (
            <div className="exercise-progress">

                {!isTelegramMiniApp && (
                    <button
                        type="button"
                        className="progress-back-button"
                        onClick={onBack}
                    >
                        ← Назад
                    </button>
                )}

                <div className="progress-empty">
                    Упражнение не найдено
                </div>

            </div>
        )
    }


    /*
        Собираем историю упражнения
        из всех тренировок.

        Для графика пока используем
        максимальный вес каждой тренировки.
    */
    const history = Object.entries(workouts)
        .map(([date, workout]) => {

            const workoutExercise =
                workout.exercises.find(
                    (item) =>
                        item.exerciseId === exerciseId
                )

            if (!workoutExercise) {
                return null
            }


            const validSets =
                workoutExercise.sets.filter(
                    (set) =>
                        set.weight !== '' &&
                        !Number.isNaN(
                            Number(set.weight)
                        )
                )


            if (validSets.length === 0) {
                return null
            }


            const maxWeight = Math.max(
                ...validSets.map(
                    (set) =>
                        Number(set.weight)
                )
            )


            return {
                date: date,
                value: maxWeight.toString(),
                sets: workoutExercise.sets
            }
        })

        .filter(
            (entry) =>
                entry !== null
        )

        .sort(
            (a, b) =>
                b.date.localeCompare(a.date)
        )


    /*
        MeasurementChart нужны только
        дата и значение.
    */
    const chartHistory =
        history.map((entry) => ({
            date: entry.date,
            value: entry.value
        }))


    function formatDate(date) {
        const [year, month, day] =
            date.split('-')

        return `${day}.${month}.${year}`
    }


    return (
        <div className="exercise-progress">

            {!isTelegramMiniApp && (
                <button
                    type="button"
                    className="progress-back-button"
                    onClick={onBack}
                >
                    ← Назад
                </button>
)}


            <div className="progress-header">

                <span className="progress-eyebrow">
                    Прогресс упражнения
                </span>

                <h2>
                    {exercise.name}
                </h2>

                <p>
                    Максимальный вес
                    в каждой тренировке
                </p>

            </div>


            <section className="progress-section">

                <div className="progress-section-header">
                    <div>
                        <span className="progress-section-label">
                            Динамика
                        </span>

                        <h3>
                            Прогресс веса
                        </h3>
                    </div>

                    <span className="progress-unit-badge">
                        кг
                    </span>
                </div>


                <MeasurementChart
                    history={chartHistory}
                    unit="кг"
                />

            </section>


            <section className="progress-section">

                <div className="progress-section-header">
                    <div>
                        <span className="progress-section-label">
                            Журнал
                        </span>

                        <h3>
                            История тренировок
                        </h3>
                    </div>

                    {history.length > 0 && (
                        <span className="progress-history-count">
                            {history.length}
                        </span>
                    )}
                </div>


                {history.length === 0 ? (

                    <div className="progress-empty">
                        Пока нет выполненных подходов
                    </div>

                ) : (

                    <div className="exercise-progress-history">

                        {history.map((entry) => (

                            <div
                                className="exercise-progress-workout"
                                key={entry.date}
                            >

                                <div className="exercise-progress-date">

                                    <div>
                                        <span className="history-date-label">
                                            Тренировка
                                        </span>

                                        <strong>
                                            {formatDate(
                                                entry.date
                                            )}
                                        </strong>
                                    </div>


                                    <div className="history-max-weight">

                                        <span>
                                            максимум
                                        </span>

                                        <strong>
                                            {entry.value}
                                            <small>
                                                кг
                                            </small>
                                        </strong>

                                    </div>

                                </div>


                                <div className="exercise-progress-sets">

                                    {entry.sets.map(
                                        (set, index) => (

                                            <div
                                                className="exercise-progress-set"
                                                key={index}
                                            >

                                                <span className="history-set-number">
                                                    {index + 1}
                                                </span>


                                                <div className="history-set-value">
                                                    <strong>
                                                        {set.weight || '—'}
                                                    </strong>

                                                    <span>
                                                        кг
                                                    </span>
                                                </div>


                                                <div className="history-set-value">
                                                    <strong>
                                                        {set.reps || '—'}
                                                    </strong>

                                                    <span>
                                                        повт
                                                    </span>
                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    )
}

export default ExerciseProgress