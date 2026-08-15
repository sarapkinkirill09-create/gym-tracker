import pdfMake from 'pdfmake/build/pdfmake'
import 'pdfmake/build/vfs_fonts'


function formatWorkoutDate(dateKey) {

    const [
        year,
        month,
        day
    ] = dateKey
        .split('-')
        .map(Number)


    const date = new Date(
        year,
        month - 1,
        day
    )


    return date.toLocaleDateString(
        'ru-RU',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }
    )
}


export function generateWorkoutPdf({
    dateKey,
    workout,
    allExercises
}) {

    const exerciseCount =
        workout.exercises.length


    const setCount =
        workout.exercises.reduce(
            (total, exercise) =>
                total + exercise.sets.length,
            0
        )


    const content = [

        {
            text: 'ТРЕНИРОВКА',

            style: 'title'
        },


        {
            text:
                formatWorkoutDate(dateKey),

            style: 'date'
        },


        {
            columns: [

                {
                    text:
                        `Упражнений: ${exerciseCount}`
                },

                {
                    text:
                        `Подходов: ${setCount}`
                }

            ],

            style: 'summary'
        }

    ]


    workout.exercises.forEach(
        (
            workoutExercise,
            exerciseIndex
        ) => {

            const exerciseData =
                allExercises.find(
                    (exercise) =>
                        String(exercise.id) ===
                        String(
                            workoutExercise.exerciseId
                        )
                )


            const exerciseName =
                exerciseData?.name ||
                'Неизвестное упражнение'


            content.push({

                text:
                    `${exerciseIndex + 1}. ${exerciseName}`,

                style: 'exerciseTitle'
            })


            /*
                Если подходов у упражнения
                пока вообще нет.
            */

            if (
                workoutExercise.sets.length === 0
            ) {

                content.push({

                    text:
                        'Подходов нет',

                    style: 'emptySets'
                })

                return
            }


            /*
                Заголовок таблицы.
            */

            const tableBody = [

                [
                    {
                        text: 'Подход',
                        bold: true
                    },

                    {
                        text: 'Вес',
                        bold: true
                    },

                    {
                        text: 'Повторения',
                        bold: true
                    }
                ]

            ]


            /*
                Настоящие подходы
                из тренировки.
            */

            workoutExercise.sets.forEach(
                (
                    set,
                    setIndex
                ) => {

                    const weight =
                        set.weight !== ''
                            ? `${set.weight} кг`
                            : '—'


                    const reps =
                        set.reps !== ''
                            ? String(set.reps)
                            : '—'


                    tableBody.push([

                        String(
                            setIndex + 1
                        ),

                        weight,

                        reps

                    ])

                }
            )


            content.push({

                table: {

                    headerRows: 1,

                    widths: [
                        70,
                        '*',
                        '*'
                    ],

                    body:
                        tableBody
                },

                margin: [
                    0,
                    0,
                    0,
                    8
                ]

            })

        }
    )


    const documentDefinition = {

        pageSize: 'A4',


        pageMargins: [
            32,
            32,
            32,
            32
        ],


        defaultStyle: {

            font: 'Roboto',

            fontSize: 11
        },


        content,


        styles: {

            title: {

                fontSize: 22,

                bold: true,

                margin: [
                    0,
                    0,
                    0,
                    5
                ]
            },


            date: {

                fontSize: 11,

                color: '#666666',

                margin: [
                    0,
                    0,
                    0,
                    20
                ]
            },


            summary: {

                fontSize: 12,

                margin: [
                    0,
                    0,
                    0,
                    15
                ]
            },


            exerciseTitle: {

                fontSize: 15,

                bold: true,

                margin: [
                    0,
                    12,
                    0,
                    6
                ]
            },


            emptySets: {

                color: '#777777',

                italics: true,

                margin: [
                    0,
                    0,
                    0,
                    8
                ]
            }

        }

    }


    pdfMake
        .createPdf(
            documentDefinition
        )
        .download(
            `Тренировка_${dateKey}.pdf`
        )
}