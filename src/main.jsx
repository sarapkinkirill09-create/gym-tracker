import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const telegram = window.Telegram?.WebApp

if (telegram) {

    /*
        Сообщаем Telegram,
        что интерфейс приложения готов.
    */
    telegram.ready()


    /*
        Цвет верхней панели Telegram.

        Берём тот же очень тёмный зелёный,
        который лежит в основе нашего фона.
    */
    telegram.setHeaderColor(
        '#050d09'
    )


    /*
        Цвет области вокруг Mini App.
        Особенно заметно при загрузке,
        изменении высоты окна и на краях.
    */
    telegram.setBackgroundColor(
        '#050d09'
    )


    /*
        Нижняя системная панель Telegram.

        Этот метод появился позже,
        поэтому сначала проверяем,
        поддерживает ли его клиент.
    */
    if (
        telegram.isVersionAtLeast('7.10')
    ) {
        telegram.setBottomBarColor(
            '#050d09'
        )
    }
}
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
  )