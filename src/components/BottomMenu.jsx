function BottomMenu({
    onOpenExercises,
    onOpenMeasurements
}) {
    return (
        <div className="bottom-menu">

            <button
                type="button"
                onClick={onOpenExercises}
            >
                Упражнения
            </button>

            <button
                type="button"
                onClick={onOpenMeasurements}
            >
                Измерения
            </button>

        </div>
    )
}

export default BottomMenu