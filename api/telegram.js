export default {
    async fetch(request) {

        /*
            Telegram будет отправлять
            сюда POST-запросы.
        */

        if (request.method !== 'POST') {
            return new Response('OK')
        }


        const update =
            await request.json()


        const message =
            update.message


        /*
            Например Telegram может
            прислать update, который
            вообще не является сообщением.
        */

        if (!message?.chat?.id) {
            return new Response('OK')
        }


        /*
            Нас пока интересует
            только команда /start.
        */

        if (
            message.text?.startsWith('/start')
        ) {

            const chatId =
                message.chat.id


            const token =
                process.env.TELEGRAM_BOT_TOKEN


            const miniAppUrl =
                process.env.MINI_APP_URL


            const text =
                'Привет! 👋\n\n' +
                'Это простой трекер тренировок.\n\n' +
                'Здесь можно записывать упражнения и подходы, ' +
                'следить за рабочими весами и отслеживать ' +
                'изменения тела.\n\n' +
                'Нажми кнопку ниже, чтобы открыть приложение.'


            const telegramResponse =
                await fetch(
                    `https://api.telegram.org/bot${token}/sendMessage`,
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({
                            chat_id: chatId,

                            text,

                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        {
                                            text:
                                                'Открыть трекер',

                                            web_app: {
                                                url:
                                                    miniAppUrl
                                            }
                                        }
                                    ]
                                ]
                            }
                        })
                    }
                )


            /*
                Если Telegram вернул ошибку,
                она появится в логах Vercel.

                Пользователь её не увидит.
            */

            if (!telegramResponse.ok) {

                const error =
                    await telegramResponse.text()

                console.error(
                    'Telegram error:',
                    error
                )
            }
        }


        /*
            Telegram важно быстро получить
            успешный HTTP-ответ.
        */

        return new Response('OK')
    }
}