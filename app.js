const mainText = document.querySelector('#main-text > h1')
const buttonNext = document.querySelector('#buttonNext')
const buttonPrevious = document.querySelector('#buttonPrevious')

let phraseId = 0

buttonNext.addEventListener('click', x => {
    if (phraseId == phrases.length-1) { return }
    phraseId += 1
    mainText.textContent = phrases[phraseId]
})

buttonPrevious.addEventListener('click', x => {
    if (phraseId == 0) { return }
    phraseId -= 1
    mainText.textContent = phrases[phraseId]
})

const phrases = [
    "Have you ever had that experience where you set yourself a really great goal,",
    "you start working on it, but then time just slips by, and before you know it,",
    "a whole month has passed and you haven't made any progress after the first few days?",
    "I have a really good example of problem like this...",
    "One woman, confidently going on vacation, packed three books she wanted to read.",
    "But by the end of the vacation, she had only managed to finish a third of the one book.",
    "And most of her free time was spent mindlessly scrolling through TikTok."
]