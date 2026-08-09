import './ConfirmModal.css'

function ConfirmModal({
    title,
    message,
    confirmText = 'Удалить',
    cancelText = 'Отмена',
    onConfirm,
    onCancel
}) {
    if (!title) {
        return null
    }

    return (
        <div
            className="confirm-overlay"
            onClick={onCancel}
        >
            <div
                className="confirm-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                <div className="confirm-icon">
                    !
                </div>


                <div className="confirm-content">

                    <span className="confirm-eyebrow">
                        Подтверждение
                    </span>

                    <h2 id="confirm-title">
                        {title}
                    </h2>

                    <p>
                        {message}
                    </p>

                </div>


                <div className="confirm-actions">

                    <button
                        type="button"
                        className="confirm-cancel-button"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>


                    <button
                        type="button"
                        className="confirm-delete-button"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>

                </div>

            </div>
        </div>
    )
}

export default ConfirmModal