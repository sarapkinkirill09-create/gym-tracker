function BottomMenu({ onOpenExercises }) {
    return (
        <div className="bottom-menu">
            <button
                type="button"
                onClick={onOpenExercises}
            >
                Упражнения
            </button>

            <button type="button">
                Измерения
            </button>
        </div>
    )
}

export default BottomMenu