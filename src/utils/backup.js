const STORAGE_KEYS = [
    'gymTrackerWorkouts',
    'gymTrackerMeasurements',
    'gymTrackerCustomExercises',
    'gymTrackerDeletedExerciseIds'
]


export function exportGymTrackerBackup() {

    /*
        Здесь мы ТОЛЬКО читаем localStorage.

        Существующие данные
        никак не изменяются.
    */

    const storage = {}


    STORAGE_KEYS.forEach((key) => {

        const value =
            localStorage.getItem(key)


        if (value !== null) {
            storage[key] = value
        }

    })


    const backup = {

        app: 'gym-tracker',

        version: 1,

        exportedAt:
            new Date().toISOString(),

        storage

    }


    const json =
        JSON.stringify(
            backup,
            null,
            2
        )


    const blob =
        new Blob(
            [json],
            {
                type:
                    'application/json;charset=utf-8'
            }
        )


    const url =
        URL.createObjectURL(blob)


    const link =
        document.createElement('a')


    const today =
        new Date()
            .toLocaleDateString('sv-SE')


    link.href = url

    link.download =
        `gym-tracker-backup-${today}.json`


    document.body.appendChild(link)

    link.click()

    link.remove()


    setTimeout(() => {
        URL.revokeObjectURL(url)
    }, 1000)
}