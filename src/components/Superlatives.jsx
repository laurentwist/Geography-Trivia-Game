import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import styled from "@emotion/styled"
import HelpPanel from "./HelpPanel"
import { useCookies } from "react-cookie"
let currentScore = {
    score: 0,
    level: 1,
}
let preventDoubleEntry = false

function Help() {
    return (
        <HelpPanel>
            <h1>Instructions</h1>
            <p>Click the country name that answers the superlative question.</p>
            <p>
                Correct answers will be crossed off, and a new question will be
                asked for the remaining countries. Incorrect answers will be
                marked in red. You have three attempts per level before the game
                resets.
            </p>
            <p>
                Levels are defined by the total number of country options. Once
                you eliminate all but one country, the game will advance to the
                next level up to a maximum of 12 options.
            </p>
            <p>
                Check out the{" "}
                <Link to="/encyclopedia">
                    <strong>encyclopedia</strong>
                </Link>{" "}
                to learn about the metrics used in this game.
            </p>
        </HelpPanel>
    )
}

const Answer = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;

    border: 1px solid #000040;
    border-radius: 5px;

    padding: 5px;

    width: 125px;
    height: 125px;

    font-size: 1em;
    color: #000040;
    font-family: "Merriweather", serif;
    font-weight: 400;
    font-style: normal;

    text-decoration: ${(props) => (props.disabled ? "line-through" : "none")};

    background-color: ${(props) =>
        props.disabled ? "#555585" : props.incorrect_guess ? "red" : "#ffffff"};

    &:hover {
        background-color: ${(props) =>
        props.disabled ? "" : props.incorrect_guess ? "red" : "#ccccd9"};
    }

    p {
        position: absolute;
        top: -50px;
        right: -40px;

        border: 1px solid #000040;
        border-radius: 5px;

        padding: 10px;

        width: 125px;

        background-color: ${(props) =>
        props.correct ? "lightgreen" : "#ffffff"};
    }
`;

const AnswerBoxContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 50px;

    max-width: 800px;
`

function AnswerBox({ answers, setGuess, reveal, question }) {
    return (
        <AnswerBoxContainer>
            {answers?.map((a) => (
                <Answer
                    key={a.ccn3}
                    disabled={a.disabled}
                    incorrect_guess={a.incorrect_guess}
                    correct={a.ccn3 === question?.correctAnswer.ccn3}
                    onClick={(e) => {
                        setGuess(a)
                    }}
                >
                    {a.name.common}
                    {(reveal || a.incorrect_guess) && !a.disabled && question?.getRevealText(a)}
                </Answer>
            ))}
        </AnswerBoxContainer>
    )
}

const AttemptCounterContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;

    h3 {
        font-size: 1.25em;
    }

    span {
        border-radius: 50%;

        width: 25px;
        height: 25px;

        background-color: #000040;
    }
`

function AttemptCounter({ attempts }) {
    return (
        <AttemptCounterContainer>
            <h3>Attempts:</h3>
            {attempts.map((key) => (
                <span key={key}></span>
            ))}
        </AttemptCounterContainer>
    )
}

const QuestionBoxContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    border: 1px solid #000040;
    border-radius: 5px;

    padding: 50px;

    @media (min-width: 1080px) {
        min-width: 800px;
    }
`

function QuestionBox({ question }) {
    return (
        <QuestionBoxContainer>
            <h1>{question?.text}</h1>
        </QuestionBoxContainer>
    )
}

const SuperlativesPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;

    padding: 50px;

    h1 {
        margin: 0px;
    }
`

/*
 * The complete list of questions; must have the following fields
 * text: the text of the question
 * getRevealText(country): a function that returns a <p> element showing the metric used by the question for the given country
 * reducer: a reducer function that produces an object with the following fields
 *     top: the top country by this question's metric found so far
 *     invalid: a boolean that is true if the question is invalid for any county so far
 *     tie: a boolean that is true if the current top country is tied with another country found so far
 */
const allQuestions = [
    {
        text: "Which country has the longest official English name?",
        getRevealText(country) {
            return country ? (
                <p>
                    {country.name.official} (
                    <strong>{country.name.official.length}</strong> characters)
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (currentCountry.name.official.length > top.name.official.length)
                return { top: currentCountry, invalid, tie: false }
            else if (
                currentCountry.name.official.length === top.name.official.length
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country has the shortest official English name?",
        getRevealText(country) {
            return country ? (
                <p>
                    {country.name.official} (
                    <strong>{country.name.official.length}</strong> characters)
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (currentCountry.name.official.length < top.name.official.length)
                return { top: currentCountry, invalid, tie: false }
            else if (
                currentCountry.name.official.length === top.name.official.length
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country's capital is farthest north?",
        getRevealText(country) {
            if (country?.capitalInfo.latlng) {
                const formattedLat = `${Math.abs(
                    country.capitalInfo.latlng[0]
                )}° ${country.capitalInfo.latlng[0] > 0 ? "N" : "S"}`
                const formattedLng = `${Math.abs(
                    country.capitalInfo.latlng[1]
                )}° ${country.capitalInfo.latlng[1] > 0 ? "E" : "W"}`
                return (
                    <p>
                        {country.capital[0]} (<strong>{formattedLat}</strong>,{" "}
                        {formattedLng})
                    </p>
                )
            }
            return <p></p>
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (!top.capitalInfo.latlng || !currentCountry.capitalInfo.latlng)
                return { top, invalid: true, tie }

            if (
                currentCountry.capitalInfo.latlng[0] > top.capitalInfo.latlng[0]
            )
                return { top: currentCountry, invalid, tie: false }
            else if (
                currentCountry.capitalInfo.latlng[0] ===
                top.capitalInfo.latlng[0]
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country's capital is farthest south?",
        getRevealText(country) {
            if (country?.capitalInfo.latlng) {
                const formattedLat = `${Math.abs(
                    country.capitalInfo.latlng[0]
                )}° ${country.capitalInfo.latlng[0] > 0 ? "N" : "S"}`
                const formattedLng = `${Math.abs(
                    country.capitalInfo.latlng[1]
                )}° ${country.capitalInfo.latlng[1] > 0 ? "E" : "W"}`
                return (
                    <p>
                        {country.capital[0]} (<strong>{formattedLat}</strong>,{" "}
                        {formattedLng})
                    </p>
                )
            }
            return <p></p>
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (!top.capitalInfo.latlng || !currentCountry.capitalInfo.latlng)
                return { top, invalid: true, tie }

            if (
                currentCountry.capitalInfo.latlng[0] < top.capitalInfo.latlng[0]
            )
                return { top: currentCountry, invalid, tie: false }
            else if (
                currentCountry.capitalInfo.latlng[0] ===
                top.capitalInfo.latlng[0]
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country's capital is farthest east?",
        getRevealText(country) {
            if (country?.capitalInfo.latlng) {
                const formattedLat = `${Math.abs(
                    country.capitalInfo.latlng[0]
                )}° ${country.capitalInfo.latlng[0] > 0 ? "N" : "S"}`
                const formattedLng = `${Math.abs(
                    country.capitalInfo.latlng[1]
                )}° ${country.capitalInfo.latlng[1] > 0 ? "E" : "W"}`
                return (
                    <p>
                        {country.capital[0]} ({formattedLat},{" "}
                        <strong>{formattedLng}</strong>)
                    </p>
                )
            }
            return <p></p>
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (!top.capitalInfo.latlng || !currentCountry.capitalInfo.latlng)
                return { top, invalid: true, tie }

            if (
                currentCountry.capitalInfo.latlng[1] > top.capitalInfo.latlng[1]
            )
                return { top: currentCountry, invalid, tie: false }
            else if (
                currentCountry.capitalInfo.latlng[1] ===
                top.capitalInfo.latlng[1]
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country's capital is farthest west?",
        getRevealText(country) {
            if (country?.capitalInfo.latlng) {
                const formattedLat = `${Math.abs(
                    country.capitalInfo.latlng[0]
                )}° ${country.capitalInfo.latlng[0] > 0 ? "N" : "S"}`
                const formattedLng = `${Math.abs(
                    country.capitalInfo.latlng[1]
                )}° ${country.capitalInfo.latlng[1] > 0 ? "E" : "W"}`
                return (
                    <p>
                        {country.capital[0]} ({formattedLat},{" "}
                        <strong>{formattedLng}</strong>)
                    </p>
                )
            }
            return <p></p>
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (!top.capitalInfo.latlng || !currentCountry.capitalInfo.latlng)
                return { top, invalid: true, tie }

            if (
                currentCountry.capitalInfo.latlng[1] < top.capitalInfo.latlng[1]
            )
                return { top: currentCountry, invalid: false }
            else if (
                currentCountry.capitalInfo.latlng[1] ===
                top.capitalInfo.latlng[1]
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country has the largest land area?",
        getRevealText(country) {
            const numFormat = Intl.NumberFormat("en-US")
            return country ? (
                <p>
                    <strong>{numFormat.format(country.area)}</strong> km²
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (currentCountry.area > top.area)
                return { top: currentCountry, invalid, tie: false }
            else if (currentCountry.area === top.area)
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country has the smallest land area?",
        getRevealText(country) {
            const numFormat = Intl.NumberFormat("en-US")
            return country ? (
                <p>
                    <strong>{numFormat.format(country.area)}</strong> km²
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (currentCountry.area < top.area)
                return { top: currentCountry, invalid, tie: false }
            else if (currentCountry.area === top.area)
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country has the largest population?",
        getRevealText(country) {
            const numFormat = Intl.NumberFormat("en-US")
            return country ? (
                <p>
                    <strong>{numFormat.format(country.population)}</strong>{" "}
                    people
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (currentCountry.population > top.population)
                return { top: currentCountry, invalid, tie: false }
            else if (currentCountry.population === top.population)
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country has the smallest population?",
        getRevealText(country) {
            const numFormat = Intl.NumberFormat("en-US")
            return country ? (
                <p>
                    <strong>{numFormat.format(country.population)}</strong>{" "}
                    people
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (currentCountry.population < top.population)
                return { top: currentCountry, invalid, tie: false }
            else if (currentCountry.population === top.population)
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country has the largest average population density",
        getRevealText(country) {
            const numFormat = Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
            })
            return country ? (
                <p>
                    <strong>
                        {numFormat.format(country.population / country.area)}
                    </strong>{" "}
                    people / km²
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (
                currentCountry.population / currentCountry.area >
                top.population / top.area
            )
                return { top: currentCountry, invalid, tie: false }
            else if (
                currentCountry.population / currentCountry.area ===
                top.population / top.area
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country has the smallest average population density?",
        getRevealText(country) {
            const numFormat = Intl.NumberFormat("en-US", {
                maximumFractionDigits: 2,
            })
            return country ? (
                <p>
                    <strong>
                        {numFormat.format(country.population / country.area)}
                    </strong>{" "}
                    people / km²
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (
                currentCountry.population / currentCountry.area <
                top.population / top.area
            )
                return { top: currentCountry, invalid, tie: false }
            else if (
                currentCountry.population / currentCountry.area ===
                top.population / top.area
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country speaks the most languages?",
        getRevealText(country) {
            return country ? (
                <p>
                    <strong>{Object.keys(country.languages).length}</strong>{" "}
                    languages
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (
                Object.keys(currentCountry.languages).length >
                Object.keys(top.languages).length
            )
                return { top: currentCountry, invalid, tie: false }
            else if (
                Object.keys(currentCountry.languages).length ===
                Object.keys(top.languages).length
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country speaks the fewest languages?",
        getRevealText(country) {
            return country ? (
                <p>
                    <strong>{Object.keys(country.languages).length}</strong>{" "}
                    languages
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (
                Object.keys(currentCountry.languages).length <
                Object.keys(top.languages).length
            )
                return { top: currentCountry, invalid, tie: false }
            else if (
                Object.keys(currentCountry.languages).length ===
                Object.keys(top.languages).length
            )
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country borders the most other countries?",
        getRevealText(country) {
            return country ? (
                <p>
                    <strong>{country.borders ? country.borders.length : 0}</strong> countries
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            const topBorders = top.borders ? top.borders.length : 0
            const currentBorders = currentCountry.borders ? currentCountry.borders.length : 0

            if (currentBorders > topBorders)
                return { top: currentCountry, invalid, tie: false }
            else if (currentBorders === topBorders)
                return { top, invalid, tie: true }
            else
                return { top, invalid, tie }
        }
    },
    {
        text: "Which country borders the fewest other countries?",
        getRevealText(country) {
            return country ? (
                <p>
                    <strong>{country.borders ? country.borders.length : 0}</strong> countries
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            const topBorders = top.borders ? top.borders.length : 0
            const currentBorders = currentCountry.borders ? currentCountry.borders.length : 0

            if (currentBorders < topBorders)
                return { top: currentCountry, invalid, tie: false }
            else if (currentBorders === topBorders)
                return { top, invalid, tie: true }
            else
                return { top, invalid, tie }
        }
    },
    {
        text: "Which country has the most timezones?",
        getRevealText(country) {
            return country ? (
                <p>
                    <strong>{country.timezones.length}</strong> timezones
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (currentCountry.timezones.length > top.timezones.length)
                return { top: currentCountry, invalid, tie: false }
            else if (currentCountry.timezones.length === top.timezones.length)
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
    {
        text: "Which country has the fewest timezones?",
        getRevealText(country) {
            return country ? (
                <p>
                    <strong>{country.timezones.length}</strong> timezones
                </p>
            ) : (
                <p></p>
            )
        },
        reducer: ({ top, invalid, tie }, currentCountry) => {
            if (currentCountry.timezones.length < top.timezones.length)
                return { top: currentCountry, invalid, tie: false }
            else if (currentCountry.timezones.length === top.timezones.length)
                return { top, invalid, tie: true }
            else return { top, invalid, tie }
        },
    },
]

function generateRandomQuestion(answers) {
    if (!answers || answers.length < 2) return undefined

    const shuffledQuestions = allQuestions
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    // Search the shuffled questions for a valid question and get its correct answer
    let i = 0
    let correctAnswer = answers.reduce(shuffledQuestions[i].reducer, {
        top: answers[0],
        invalid: false,
        tie: false,
    })
    while (
        i < shuffledQuestions.length - 1 &&
        (correctAnswer.invalid || correctAnswer.tie)
    ) {
        i++
        correctAnswer = answers.reduce(shuffledQuestions[i].reducer, {
            top: answers[0],
            invalid: false,
            tie: false,
        })
    }

    // If no valid question could be found, return undefined
    if (
        i === shuffledQuestions.length - 1 &&
        (correctAnswer.invalid || correctAnswer.tie)
    ) {
        return undefined
    }

    // console.log("correctAnswer:", correctAnswer.top.name.common)

    const questionWithCorrectAnswer = {
        text: shuffledQuestions[i].text,
        getRevealText: shuffledQuestions[i].getRevealText,
        correctAnswer: correctAnswer.top,
    }

    return questionWithCorrectAnswer
}

export function SuperlativesPage() {
    const [nAnswers, setNAnswers] = useState(4)
    const [answers, setAnswers] = useState([])
    const [attempts, setAttempts] = useState([0, 1, 2])
    const [currentQuestion, setCurrentQuestion] = useState()
    const [guess, setGuess] = useState()
    const [reveal, setReveal] = useState(false)

    // Leaderboard cookie
    const [cookies, setCookie] = useCookies(["superlativeLeaderboard"])
    let stringLeaderboard = cookies["superlativeLeaderboard"]
    let leaderboard = stringLeaderboard ? [...stringLeaderboard] : []

    // Query for all country data
    const { data: allCountries } = useQuery({
        queryKey: ["allCountries"],
        queryFn: async () => {
            const res = await fetch(
                "https://restcountries.com/v3.1/independent?status=true"
            )
            return res.json()
        },
    })

    // Local function that selects a random set of countries and a question
    function resetGame() {
        setReveal(false)
        preventDoubleEntry = false

        if (!allCountries) return

        let question = undefined
        let selectedData = undefined
        while (!question) {
            const shuffledData = allCountries
                .map((value) => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)

            selectedData = shuffledData.slice(0, nAnswers).map((country) => ({
                ...country,
                disabled: false,
                incorrect_guess: false,
            }))

            question = generateRandomQuestion(selectedData)
        }

        setAnswers(selectedData)
        setCurrentQuestion(question)
    }

    // Reset the game when the countries data loads in
    useEffect(resetGame, [nAnswers, allCountries])

    // A guess handler function which is passed to the answer buttons
    useEffect(() => {
        if (!guess || !currentQuestion || reveal) return

        // Check whether guessed answer is correct
        if (guess.ccn3 === currentQuestion.correctAnswer.ccn3) {
            // Correct guess
            currentScore.score += 1

            // Disable the guessed answer and clear any incorrect guesses
            setAnswers(
                answers.map((a) => {
                    if (a.ccn3 === guess.ccn3) a.disabled = true
                    a.incorrect_guess = false
                    return a
                })
            )

            // Generate a new question from the remaining answers
            const enabledAnswers = answers.filter((a) => !a.disabled)
            const nextQuestion = generateRandomQuestion(enabledAnswers)

            // Check whether there is more than one answer and whether the question generated successfully
            if (enabledAnswers.length > 1 && nextQuestion) {
                setCurrentQuestion(nextQuestion)
            } else {
                // Advance to the next level
                currentScore.level += 1
                setAttempts([0, 1, 2])
                setNAnswers(Math.min(nAnswers + 1, 12))
                resetGame()
            }
        } else {
            // Incorrect guess
            currentScore.score -= 1

            // Mark the incorrect guess
            setAnswers(
                answers.map((a) => {
                    if (a.ccn3 === guess.ccn3) a.incorrect_guess = true
                    return a
                })
            )

            // Check if there are any attempts left
            if (attempts.length > 1) {
                // Remove one attempt
                setAttempts(attempts.slice(0, attempts.length - 1))
            } else {
                // All attempts used, so reveal the answer
                setReveal(true)
                preventDoubleEntry = true
                setCookie("superlativeLeaderboard", [
                    ...leaderboard,
                    currentScore,
                ])
                currentScore = { score: 0, level: 1 }

                // Wait 3 seconds, then reset the game to the starting state (3 attempts, 4 answers)
                setTimeout(() => {
                    setAttempts([0, 1, 2])
                    setNAnswers(4)
                    resetGame()
                }, 5000)

            }
        }
    }, [guess])

    return (
        <SuperlativesPageContainer>
            <QuestionBox question={currentQuestion} />
            <AttemptCounter attempts={attempts} />
            <AnswerBox
                answers={answers}
                setGuess={setGuess}
                reveal={reveal}
                question={currentQuestion}
            />
            <Help />
        </SuperlativesPageContainer>
    )
}
