const mainText = document.querySelector('#main-text > h1')
const buttonNext = document.querySelector('#buttonNext')
const buttonPrevious = document.querySelector('#buttonPrevious')

let phraseId = 0
let smallPhrasesWereBuilt = false
let currentAnimationDelay = 0.1
let firstTime = 0
let moveBack = false
let noDisappearAnim = false
let imageIsShown = false
let moveMainTextLeft = false

function nextPhrase() {
    if (phraseId >= phrases.length-1) { return }
    phraseId += 1
    renderText()
}
function previousPhrase() {
    if (phraseId == 0) { return }
    phraseId -= 1
    renderText()
}
function disappear(callback) {
    if (!smallPhrasesWereBuilt) {
        Array.from(mainText.children).forEach((element, i) => {
            let backwardAnimDelay = (mainText.childElementCount - i)/40
            element.style.animationDelay = `${backwardAnimDelay}s`
            element.style.opacity = 1
            element.style.transform = "none"
            element.classList.add("disappear")
        })
    } else {
        const smallPhrasesDiv = document.querySelector(".smallPhrases")
        Array.from(smallPhrasesDiv.children).forEach((el, index) => {
            Array.from(el.children).forEach((element, i) => {
                let backwardAnimDelay = (el.childElementCount - i)/40
                element.style.animationDelay = `${backwardAnimDelay}s`
                element.style.opacity = 1
                element.style.transform = "none"
                element.classList.add("disappear")
            })
        })
    }
    setTimeout(() => {
        if (smallPhrasesWereBuilt) {
            document.querySelector(".smallPhrases").remove()
        }
        mainText.style.marginRight = 0
        callback()
    }, firstTime < 2 || noDisappearAnim ? 0 : 900)
}
function appear(currentPhrase, parentElement, extraAnimationDelay=0) {
    currentPhrase[0].split(' ').forEach((word, i) => {
        if (word == "\n") {
            parentElement.appendChild(document.createElement('br'))
        } else if (word.startsWith("[")) {
            const aLink = document.createElement('a')
            const refLink = word.slice(1, -1)
            aLink.href = refLink
            let authorName = ""
            sources.forEach((el, i) => {
                if (el[0] == refLink) {
                    aLink.textContent = i+1
                    authorName = el[1]
                }
            })
            const spanLink = document.createElement('span')
            if (refLink == "https://jamesclear.com/atomic-habits") {
                spanLink.textContent = "Atomic Habits"
            } else {
                spanLink.textContent = refLink
            }
            const longLink = document.createElement('p')
            longLink.textContent = `${authorName},  `
            longLink.appendChild(spanLink)
            aLink.appendChild(longLink)
            aLink.classList.add("word")
            aLink.classList.add("appear")
            aLink.style.animationDelay = `${extraAnimationDelay+(i/40)}s`
            const sub = document.createElement('sup')
            sub.appendChild(aLink)
            parentElement.appendChild(sub)
        } else {
            const span = document.createElement('span')
            span.textContent = `${word} `
            span.classList.add("word")
            span.classList.add("appear")
            span.style.animationDelay = `${extraAnimationDelay+(i/40)}s`
            parentElement.appendChild(span)
        }
    })
}
function usualText(currentPhrase) {
    currentAnimationDelay = 0.1
    disappear(() => {
        mainText.style.removeProperty("display")
        mainText.innerHTML = ""
        if (currentPhrase[1][1] != 0) {
            mainText.style.maxWidth = `${currentPhrase[1][1]}%`
        } else {
            mainText.style.removeProperty("max-width")
        }
        if (imageIsShown || moveMainTextLeft) {
            mainText.style.marginRight = "9%"
        }
        smallPhrasesWereBuilt = false
        appear(currentPhrase, mainText)
    })
}

buttonPrevious.style.opacity = 0
buttonPrevious.style.transform = "translateY(50px)"


buttonNext.addEventListener('click', x => { nextPhrase() })
buttonPrevious.addEventListener('click', x => {
    moveBack = true
    previousPhrase()
})

function renderText() {
    firstTime += 1

    if (!intentionOptions.some(el => phraseId == el[1]+el[2])) {
        buttonNext.style.removeProperty("display")
        buttonNext.style.removeProperty("transform")
        buttonNext.style.removeProperty("opacity")
        if (phraseId == 0) {
            buttonPrevious.style.opacity = 0
            buttonPrevious.style.transform = "translateY(50px)"
        } else if (phraseId == (phrases.length-1)) {
            buttonNext.style.opacity = 0
            buttonNext.style.transform = "translateY(50px)"
        } else {
            buttonPrevious.style.opacity = 1
            buttonPrevious.style.transform = "none"
            buttonNext.style.opacity = 1
            buttonNext.style.transform = "none"
        }
        Array.from(buttonNext.parentElement.children).forEach((el) => {
            if (el != buttonNext && el != buttonPrevious) {
                el.remove()
            }
        })
    } else {
        buttonNext.style.opacity = 0
        buttonNext.style.transform = "translateY(50px)"
        const moveOnDiv = document.createElement('div')
        moveOnDiv.id = 'move-on'
        const moveOnButton = document.createElement('button')
        const buttonText = document.createElement('p')
        buttonText.textContent = "Move on"
        moveOnButton.appendChild(buttonText)
        moveOnButton.appendChild(buttonNext.children[0].cloneNode(true))
        moveOnButton.addEventListener('click', () => {
            phraseId = intentionOptions.at(-1)[1] + intentionOptions.at(-1)[2] + 1
            moveOnDiv.style.removeProperty("transform")
            moveOnDiv.style.removeProperty("opacity")
            buttonNext.style.removeProperty("display")
            moveMainTextLeft = false
            setTimeout(() => {
                buttonNext.style.removeProperty("transform")
                buttonNext.style.removeProperty("opacity")
                renderText()
            }, 500)
            const intentionOptionsDiv = document.querySelector('.intentionOptions')
            if (intentionOptionsDiv != undefined) {
                intentionOptionsDiv.style.transform = "translateY(50px)"
                intentionOptionsDiv.style.opacity = 0
                setTimeout(() => {
                    intentionOptionsDiv.remove()
                }, 800)
            }
        })
        moveOnDiv.appendChild(moveOnButton)
        setTimeout(() => {
            buttonNext.style.display = "none"
            buttonNext.parentElement.appendChild(moveOnDiv)
        }, 500)
        setTimeout(() => {
            moveOnDiv.style.opacity = 1
            moveOnDiv.style.transform = "none"
        }, 2000)
    }

    const currentPhrase = phrases[phraseId]

    if (currentPhrase[1][0] == 1) {
        usualText(currentPhrase)
    } else if (currentPhrase[1][0] == 2) {
        if (!moveBack) {
            const smallPhrase = document.createElement('p')
            smallPhrase.classList.add("smallPhrase")
            if (currentPhrase[1][2] == 1) {
                smallPhrase.style.marginLeft = "26px"
            }
            if (currentPhrase[1][1] == 0) {
                const smallPhrasesDiv = document.createElement('div')
                disappear(() => {
                    mainText.style.display = 'none'
                    smallPhrasesDiv.classList.add("smallPhrases")
                    if (imageIsShown || moveMainTextLeft) {
                        smallPhrasesDiv.style.marginRight = "9%"
                    }
                    appear(currentPhrase, smallPhrase, currentAnimationDelay)
                    currentAnimationDelay += 0.9
                    smallPhrasesDiv.appendChild(smallPhrase)
                    mainText.parentElement.appendChild(smallPhrasesDiv)
                    nextPhrase()
                })
            } else {
                const smallPhrasesDiv = document.querySelector(".smallPhrases")
                if (smallPhrasesDiv != undefined) {
                    appear(currentPhrase, smallPhrase, currentAnimationDelay)
                    currentAnimationDelay += 0.9
                    smallPhrasesDiv.appendChild(smallPhrase)
                    mainText.parentElement.appendChild(smallPhrasesDiv)
                    if (currentPhrase[1][1] == 1) { nextPhrase() }
                    else {
                        smallPhrasesWereBuilt = true
                        currentAnimationDelay = 0.1
                    }
                } else { previousPhrase() }
            }
        } else { previousPhrase() }
        noDisappearAnim = false
    } else if (currentPhrase[1][0] == 3) {
        usualText(currentPhrase)
        buttonNext.style.opacity = 0
        buttonNext.style.transform = "translateY(50px)"
        const twoOptions = document.createElement('div')
        twoOptions.id = "option-buttons"
        for (let i = 1; i < 3; i++) {
            const option = document.createElement('button')
            const optionText = document.createElement('p')
            optionText.textContent = currentPhrase[1][i][0]
            option.appendChild(optionText)
            option.appendChild(buttonNext.children[0].cloneNode(true))
            option.addEventListener('click', () => {
                phraseId = currentPhrase[1][i][1]-1
                twoOptions.style.removeProperty("transform")
                twoOptions.style.removeProperty("opacity")
                buttonNext.style.removeProperty("display")
                setTimeout(() => {
                    buttonNext.style.removeProperty("transform")
                    buttonNext.style.removeProperty("opacity")
                    moveMainTextLeft = false
                    renderText()
                }, 500)
            })
            twoOptions.appendChild(option)
        }
        setTimeout(() => {
            buttonNext.style.display = "none"
            buttonNext.parentElement.appendChild(twoOptions)
        }, 500)
        setTimeout(() => {
            twoOptions.style.transform = "none"
            twoOptions.style.opacity = 1
        }, 2000)
    } else if (currentPhrase[1][0] == 4) {
        if (!imageIsShown) {
            const img = document.createElement('img')
            img.addEventListener('click', () => {
                window.open("https://www.tandfonline.com/doi/full/10.1080/21679169.2021.1949038");
            })
            img.src = currentPhrase[0]
            img.classList.add("hiddenImg")
            disappear(() => {
                mainText.parentElement.parentElement.appendChild(img)
                mainText.style.display = 'none'
                noDisappearAnim = true
                setTimeout(() => { img.classList.remove("hiddenImg") }, 100)
                imageIsShown = true
                if (currentPhrase[1][1] == 0) { nextPhrase() }
                else { previousPhrase() }
            })
        } else {
            const img = document.querySelector('img')
            img.classList.add("hiddenImg")
            imageIsShown = false
            if (currentPhrase[1][1] == 0) { previousPhrase() }
            else { nextPhrase() }
            setTimeout(() => {
                img.remove()
            }, 500)
        }
    } else if (currentPhrase[1][0] == 5) {
        moveMainTextLeft = true
        usualText(currentPhrase)
        buttonNext.style.opacity = 0
        buttonNext.style.transform = "translateY(50px)"

        const intentionOptionsDiv = document.createElement('div')
        intentionOptionsDiv.classList.add("intentionOptions")

        intentionOptions.forEach((el, i) => {
            const option = document.createElement('p')
            option.textContent = el[0]
            option.addEventListener('click', () => {
                phraseId = el[1]
                const divOldPostion = intentionOptionsDiv.getBoundingClientRect()
                document.body.appendChild(intentionOptionsDiv)
                intentionOptionsDiv.style.left = divOldPostion.left + "px"
                intentionOptionsDiv.style.top = divOldPostion.top + "px"
                intentionOptionsDiv.style.right = "unset"
                moveMainTextLeft = false
                const moveOnDiv = document.querySelector('#move-on')
                if (moveOnDiv != undefined) {
                    moveOnDiv.style.removeProperty("transform")
                    moveOnDiv.style.removeProperty("opacity")
                    buttonNext.style.removeProperty("display")
                    setTimeout(() => {
                        buttonNext.style.removeProperty("transform")
                        buttonNext.style.removeProperty("opacity")
                    }, 500)
                }
                setTimeout(() => {
                    intentionOptionsDiv.style.top = "73.5vh"
                    renderText()
                }, 500)
            })
            intentionOptionsDiv.appendChild(option)
        })
        buttonNext.parentElement.appendChild(intentionOptionsDiv)
        setTimeout(() => {
            intentionOptionsDiv.style.opacity = 1
            intentionOptionsDiv.style.transform = "none"
        }, 1)
    } else { nextPhrase() }
    moveBack = false
}

// 1 - text
// 2 - tpb
//   2.1 - 0=first, 1=mid, 2=last
//   2.2 - 0=add, 1=key
// 3 - question
//   [1] - question
//   [2] - next phrases id
// 4 - image
//   4.1 - 0=first, 1=last
// 5 - selection

const phrases = [
    ["Have you ever had that experience where you set yourself a really great goal,", [1, 0]],
    ["you start working on it, but then time just slips by, and suddenly,", [1, 0]],
    ["it's already been a month and you realize you haven't really moved forward since those first few days?", [1, 0]],
    ["I have a great example of this problem...", [1, 60]],
    ["There was a woman who went on vacation and, very confidently, took three books with her that she wanted to read.", [1, 0]],
    ["But by the end of the vacation, she had only read a third of the first book.", [1, 0]],
    ["And most of her free time was spent mindlessly scrolling TikTok. [https://www.theatlantic.com/ideas/archive/2025/01/attention-valuable-resource/681221/]", [1, 0]],
    // ---
    ["I think we've all run into this problem.", [1, 0]],
    ["We want to do something, but we don't do it.", [1, 55]],
    ["Or we don't really want to do something, but we still end up doing it.", [1, 48]],
    ["In science, this is called \n the Intention-Behavior Gap.", [1, 0]],
    ["There are different theories about how intention and action interact, but we'll look at just a few of the most common ones.", [1, 0]],
    // ---
    ["The first thing to understand is that behind almost every action we take, there is an intention.", [2, 0, 0]],
    ["Every intention has its own strength, and the strength is mostly influenced by three things: [https://doi.org/10.1016/0749-5978(91)90020-T]", [2, 1, 0]],
    ["1. How you feel about the action", [2, 1, 1]],
    ["2. How others feel about the action", [2, 1, 1]],
    ["3. Whether you feel capable of doing the action", [2, 1, 1]],
    ["And if you could rated each of these aspects on a 10-point scale in relation to your intention, \n then the more points your intention “scores“, the stronger it should be.", [2, 2, 0]],
    ["Do you want to learn more about the intention, or should we move on?", [3, ["I want to learn more", 20], ["Let's move on", 46]]],
    // ---
    ["Which aspect of your intention do you want to strengthen?", [5, 0]],
    ["There are several different ways to improve your attitude toward an unpleasant action:", [2, 0, 0]],
    ["1. Connect doing the action with its outcomes.  Meaning: help your brain \n      understand that an unpleasant action, repeated consistently → a desired result. [https://userpage.fu-berlin.de/~health/hapa/schwarzereurpsych2008.pdf] \n      Here are a few examples:", [2, 1, 1]],
    ["             - Make a list of desired outcomes you could have in a week, a month, a year, and longer.", [2, 1, 1]],
    ["             - Visualize pleasant outcomes (but it's important not to overdo it).", [2, 1, 1]],
    ["             - But probably the most helpful approach is still to try to explain to yourself that \n                 if you want this result, then you simply need to do this action, \n                 though this is not a very simple process that should happen inside the person.", [2, 2, 1]],
    ["2. Make the action seem less scary. The brain often exaggerates actions we don't like, \n      but if we look at the problem from a different angle, everything can become easier. \n      Here are a few examples of how to do that: [https://userpage.fu-berlin.de/~health/hapa/schwarzereurpsych2008.pdf]", [2, 0, 0]],
    ["         - Break the action into many simple and small steps.", [2, 1, 1]],
    ["         - Try doing a “mini-version” of the big action first.", [2, 1, 1]],
    ["         - Listen to real experiences from others.", [2, 1, 1]],
    ["3. Lighten the emotional weight of the goal. Often we take the execution of our action so \n      seriously that it simply exhausts us, and then we no longer want to deal with it. \n      So you can just change the tone in which you think about this action, \n      for example, think of it like a game or an experiment. [https://pmc.ncbi.nlm.nih.gov/articles/PMC6125069/]", [2, 2, 0]],
    // ---
    ["To strengthen this aspect, it would help if the opinions of people around you \n pushed you toward performing the desired action. In practice, you can: [https://doi.org/10.1016/0749-5978(91)90020-T]", [2, 0, 0]],
    ["1. Find people who support you, believe you can succeed, \n      and help you during times of failure.", [2, 1, 1]],
    ["2. Find an environment where the desired action is clearly supported, \n      this could be people with similar interests, channels on social media, \n      or simply a group of friends where everyone is interested in one \n      topic related to the desired action.", [2, 2, 1]],
    // ---
    ["To strengthen the sense of capability, there are several different ways to achieve this:", [2, 0, 0]],
    ["1. Make starting the task easier. We're less likely to start hard tasks when the effort \n      feels too big or the payoff feels too vague. \n      Here are a few examples of how to make difficult actions feel easier: [https://userpage.fu-berlin.de/~health/hapa/schwarzereurpsych2008.pdf]", [2, 1, 1]],
    ["             - Start with something easier and gradually move to something harder.", [2, 1, 1]],
    ["             - Tell yourself you'll work only for a few minutes, because the main thing is to start.", [2, 1, 1]],
    ["             - Accept that it's better to do it somehow than perfectly as you planned.", [2, 2, 1]],
    ["2. Encourage yourself. This helps create the feeling that you're not fighting something, \n      but achieving a great goal; and that you're already succeeding. Here are a few examples: [https://userpage.fu-berlin.de/~health/hapa/schwarzereurpsych2008.pdf]", [2, 0, 0]],
    ["         - Write down things you've already achieved.", [2, 1, 1]],
    ["         - Promise yourself a small reward for successful completion to reinforce the intention, \n             but not to replace it.", [2, 1, 1]],
    ["3. Create a stable environment. Many people find it hard to start doing something new in \n      a stressful, new, or uncertain setting, so here are a few examples: [https://userpage.fu-berlin.de/~health/hapa/schwarzereurpsych2008.pdf]", [2, 1, 0]],
    ["         - Plan in advance. This helps you get into a working mindset.", [2, 1, 1]],
    ["         - Remove everything that distracts you from the action.", [2, 1, 1]],
    ["         - Create a calm and pleasant environment that you like.", [2, 2, 1]],
    // ---
    ["Ok, another reason we sometimes don't do what we want to do is because we have the intention, but...", [1, 0]],
    ["we don't have a specific plan of action.", [1, 0]],
    ["hapa.jpeg", [4, 0]],
    ["This diagram shows this idea really well. [https://userpage.fu-berlin.de/~health/hapa/schwarzereurpsych2008.pdf]", [2, 0, 0]],
    ["Sometimes we come up with an intention, but to keep taking action in the long term \n we also need to come up with the specific steps we're going to take.", [2, 1, 0]],
    ["For example, instead of just saying “I want to start eating healthy“, \n it's much more effective to actually write down:", [2, 1, 0]],
    ["1. what you consider healthy and unhealthy", [2, 1, 1]],
    ["2. which healthy meals you're willing to cook and eat", [2, 1, 1]],
    ["3. which ingredients you need in order to make those healthy meals", [2, 1, 1]],
    ["4. what your eating schedule looks like, whether you can have snacks, etc.", [2, 2, 1]],
    // ---
    ["If your goal is to exercise, then it helps to plan: [https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf]", [2, 0, 0]],
    ["1. when you will work out", [2, 1, 1]],
    ["2. which exact exercises you will do", [2, 1, 1]],
    ["It's really important not to just sit around waiting for that magical moment of \n “when inspiration comes to me”, but to build your own plans and habits.", [2, 1, 0]],
    ["Because in reality, that perfect moment of “inspiration” almost never comes.", [2, 2, 0]],
    // ---
    ["Another important part of this model is planning what you will do when obstacles appear. [https://userpage.fu-berlin.de/~health/hapa/schwarzereurpsych2008.pdf]", [2, 0, 0]],
    ["Using the exercise example, you need to plan what you will do \n when you come home really tired from work, and so on.", [2, 2, 0]],
    // ---
    ["And the last two elements in this diagram that help you keep going over the long term are: [https://userpage.fu-berlin.de/~health/hapa/schwarzereurpsych2008.pdf]", [2, 0, 0]],
    ["1. Monitoring and analyzing how well you're following through. \n      For example, you can start a calendar where you mark all the days you exercise", [2, 1, 1]],
    ["2. Believing that you can actually do what you want to do. \n      In reality, believing that you can do what you want, \n      believing that you can stand firm even when things get hard, \n      and believing that you can get back up after a failure - all of this strongly \n      affects the chances that you'll actually succeed. \n      That's why we so often see motivational phrases like “keep going”  \n      and “you got this” - because they really can help in tough moments. [https://www.apa.org/topics/personality/willpower]", [2, 2, 1]],
    ["hapa.jpeg", [4, 1]],
    // ---
    ["And the final factor that creates the Intention-Behavior Gap is habits.", [1, 0]],
    ["Our brain uses a lot of energy from our body.", [1, 55]],
    ["And habits are a great way for it to save some of that energy.", [1, 0]],
    ["A good example is how, when you walk into the bathroom or your bedroom,", [1, 0]],
    ["you automatically turn on the light if you need it.", [1, 60]],
    ["And that's great, because if every time you walked into the your bedroom", [1, 0]],
    ["you had to consciously think about where the light switch is, and how I turn it on", [1, 0]],
    ["you'd be wasting time and energy for no reason.", [1, 55]],
    ["Instead, it just happens instantly and effortlessly.", [1, 0]],
    ["So habits are how our brain automates the repetitive tasks we do over and over again. [https://jamesclear.com/atomic-habits]", [1, 0]],
    // ---
    ["And we can use this mechanism to our advantage.", [1, 40]],
    ["For example, if your goal is to start doing your homework as early as possible after you \n get home, you can build a little routine: every day, after you come home from college, \n you do some light physical exercises, then you listen to music you enjoy (as a bit of rest), \n and then you start your homework.", [2, 0, 0]],
    ["And already 30-60 minutes after you get home, you can, with renewed energy, \n sit down and do your homework.", [2, 1, 0]],
    ["But here the sequence is a very important part, meaning: \n       you come home → do light exercises → listen to music → start doing homework.", [2, 1, 0]],
    ["For your brain, it's important to remember what comes after what, \n meaning that after exercise comes music, and after music comes homework, \n without any deviations. [https://jamesclear.com/atomic-habits]", [2, 2, 0]],
    ["And probably the most important aspect of building a habit is consistency.", [2, 0, 0]],
    ["The more often a sequence of actions is repeated, the faster it becomes a habit. \n And the more often we deviate from the planned sequence, the slower that habit forms.", [2, 1, 0]],
    ["At the beginning, building healthy habits can feel really hard. \n But the longer you manage to stick to your plan of action, the easier it will get later. [https://jamesclear.com/atomic-habits]", [2, 2, 0]],
    // ---
    ["Finishing, I want to say that this gap between what we want and what we do can be reduced, and even overcome. [https://eprints.whiterose.ac.uk/id/eprint/107519/3/The]", [1, 0]],
    ["You just need to...", [1, 0]],
    ["1. Sort out your intentions - understand what your true desires are.", [1, 0]],
    ["2. Build a clear plan for how exactly you're going to reach your goal.", [1, 0]],
    ["3. Repeat what you want to do again and again until it becomes a habit.", [1, 0]],
    ["And finally, at every step, keep believing that you will succeed.", [1, 0]],
]

const intentionOptions = [ // name, id, length
    ["Attitude toward the action", 20, 9],
    ["Other people's opinion", 30, 2],
    ["Sense of capability", 33, 11]
]

const sources = [
    ["https://www.theatlantic.com/ideas/archive/2025/01/attention-valuable-resource/681221/", "Chris Hayes"],
    ["https://doi.org/10.1016/0749-5978(91)90020-T", "Icek Ajzen"],
    ["https://userpage.fu-berlin.de/~health/hapa/schwarzereurpsych2008.pdf", "Schwarzer and Luszczynska"],
    ["https://pmc.ncbi.nlm.nih.gov/articles/PMC6125069/", "Mark Faries"],
    ["https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf", "Peter Gollwitzer"],
    ["https://www.apa.org/topics/personality/willpower", "APA"],
    ["https://jamesclear.com/atomic-habits", "James Clear"],
    ["https://eprints.whiterose.ac.uk/id/eprint/107519/3/The", "Sheeran and Webb"],
]

renderText()