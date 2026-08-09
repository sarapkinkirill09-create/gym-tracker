function BottomMenu({
    onOpenExercises,
    onOpenMeasurements
}) {
    return (
        <div className="bottom-menu">

            <button
                type="button"
                className="bottom-menu-button active"
                onClick={onOpenExercises}
            >
                <svg
                    className="bottom-menu-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M6 8v8M3.5 9.5v5M18 8v8M20.5 9.5v5M6 12h12"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                </svg>

                <span>
                    Упражнения
                </span>
            </button>


            <div className="bottom-menu-divider" />


            <button
                type="button"
                className="bottom-menu-button"
                onClick={onOpenMeasurements}
            >
                <svg
                    className="bottom-menu-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M5 18L18 5L21 8L8 21L5 18Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                    />

                    <path
                        d="M15.5 7.5L17 9M12.5 10.5L14 12M9.5 13.5L11 15"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                    />
                </svg>

                <span>
                    Измерения
                </span>
            </button>

        </div>
    )
}

export default BottomMenu