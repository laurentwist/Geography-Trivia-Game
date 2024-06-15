import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import DisplayQuestionsPractice from './DisplayQuestionsPractice'

export function TriviaPractice() {
    const categoryOptions = [
        "music",
        "sport_and_leisure",
        "film_and_tv",
        "arts_and_literature",
        "history",
        "society_and_culture",
        "science",
        "geography",
        "food_and_drink",
        "general_knowledge"
    ]

    const [inputQuery, setInputQuery] = useState('')
    const [questions, setQuestions] = useState([])
    const [answerResults, setAnswerResults] = useState([])
    const [displayQuiz, setDisplayQuiz] = useState(false)

    const { data, refetch } = useQuery({
        queryKey: ['triviaQuestions', inputQuery],
        queryFn: async () => {
            const res = await fetch(inputQuery)
            return res.json()
        },
        enabled: false,
    })

    useEffect(() => {
        // automatically generate quiz when component mounts
        generateQuiz()
    }, [])

    useEffect(() => {
        if (data) {
            setQuestions(data)
            setAnswerResults(Array(data.length).fill(null))
        }
    }, [data])

    useEffect(() => {
        if (inputQuery) {
            refetch()
        }
    }, [inputQuery, refetch])

    console.log("Questions: ", questions)

    const generateQuiz = () => {
        const baseString = `https://the-trivia-api.com/api/questions?`
        const categoryString = categoryOptions.join(',')
        const limit = 50
        const queryURL = `${baseString}categories=${categoryString}&limit=${limit}`
        setInputQuery(queryURL)
        setDisplayQuiz(true)
    }

    return (
        <div>
            {displayQuiz && questions.map((question, index) => (
                <DisplayQuestionsPractice
                    key={index}
                    question={question}
                    answerResult={answerResults[index]}
                    questionNumber={index + 1}
                    totalQuestions={questions.length}
                />
            ))}
        </div>
    )
}