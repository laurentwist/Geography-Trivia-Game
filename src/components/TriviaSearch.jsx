import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { css } from "@emotion/react";
import { RadioButtonCheckedRounded, RadioButtonUncheckedRounded } from "@mui/icons-material";
import Sheet from "@mui/joy/Sheet";
import {
    Box,
    Checkbox,
    FormControlLabel,
    Button,
    Slider,
    MenuItem,
    Select,
} from "@mui/material";
import { useCookies } from "react-cookie";
import DisplayQuestion from "./DisplayQuestions";
let currentScore = {
    score: 0,
    questions: 0,
    difficulty: "",
    category: "",
};

export default function Search() {
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
        "general_knowledge",
    ];

    const pointValues = {
        easy: 10,
        medium: 20,
        hard: 30,
    };

    const [checkedValues, setcheckedValues] = useState([]);
    const [difficulty, setDifficulty] = useState("easy");
    const [numberofQuestions, setNumberOfQuestions] = useState(10);
    const [inputQuery, setInputQuery] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerResult, setAnswerResult] = useState(null);
    const [displayQuiz, setDisplayQuiz] = useState(false);
    const [pointTotal, setPointTotal] = useState(0);
    const [triviaResults, setTriviaResults] = useState(false)
    const [answerHistory, setAnswerHistory] = useState([])

    // Leaderboard storage as cookies
    const [cookies, setCookie] = useCookies(["triviaLeaderboard"]);
    let stringLeaderboard = cookies["triviaLeaderboard"];
    let leaderboard = stringLeaderboard ? [...stringLeaderboard] : [];

    // Capitalize the first letter of each word in the category
    const beautifyCategories = (categories) => {
        return categories
            .split(",")
            .map((category) => category
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "))
            .join(", ")
    };

    console.log("Leaderboard: ", leaderboard);

    const { data, refetch } = useQuery({
        queryKey: ["triviaQuestions", inputQuery],
        queryFn: async () => {
            const res = await fetch(inputQuery);
            return res.json();
        },
        enabled: false, // prevent automatic fetching
    });

    useEffect(() => {
        if (inputQuery) {
            refetch();
        }
    }, [inputQuery, refetch]);
    useEffect(() => {
        if (inputQuery) {
            refetch();
        }
    }, [inputQuery, refetch]);

    useEffect(() => {
        if (data) {
            setQuestions(data);
        }
    }, [data]);

    console.log("Questions: ", questions);

    const generateQuiz = () => {
        const baseString = `https://the-trivia-api.com/api/questions?`;
        let categoryString = checkedValues.join(",");
        const queryURL = `${baseString}categories=${categoryString}&limit=${numberofQuestions}&difficulty=${difficulty}`;
        setInputQuery(queryURL);
        setDisplayQuiz(true);
        currentScore.score = 0;
        currentScore.questions = numberofQuestions;
        currentScore.difficulty = difficulty;
        currentScore.category =
            categoryString === "" ? "all_categories" : categoryString;
    };

    const handleCheckboxChange = (value) => {
        setcheckedValues((prevValues) =>
            prevValues.includes(value)
                ? prevValues.filter((item) => item !== value)
                : [...prevValues, value]
        );
    };

    console.log("Point Total", pointTotal);
    const handleNextQuestion = (selectedAnswer) => {
        console.log("Selected Answer:", selectedAnswer);

        // check if the selected answer is correct
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setAnswerResult({ message: "Correct!", color: "green" });
            currentScore.score++;
            console.log("Current Score: ", currentScore);
            setPointTotal((pointTotal) => pointTotal + pointValues[difficulty]);
            setAnswerHistory(answerHistory => [...answerHistory, [currentQuestion.question, 'Correct!', currentQuestion.correctAnswer]])
        } else {
            setAnswerResult({ message: "Incorrect!", color: "red" });
            setAnswerHistory(answerHistory => [...answerHistory, [currentQuestion.question, 'Incorrect!', currentQuestion.correctAnswer]])
        }

        // move to the next question
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            // clear answer result after a delay
            setTimeout(() => {
                setAnswerResult(null);
            }, 1000) // 1 second delay before clearing the result
        }
        // Trivia Results

        if (currentQuestionIndex >= questions.length - 1) {
            let points = pointTotal
            if (selectedAnswer === currentQuestion.correctAnswer) {
                points = pointTotal + pointValues[difficulty]
            }
            setAnswerResult(null);
            setDisplayQuiz(false)
            setTriviaResults(true)
            leaderboard.push(currentScore);
            stringLeaderboard = JSON.stringify(leaderboard);
            setCookie("triviaLeaderboard", stringLeaderboard);
            console.log("Finished Quiz, Points: ", points)
        }
    }

    const handleReset = () => {
        console.log("Resetting Trivia Page")
        setInputQuery('')
        setQuestions([])
        setCurrentQuestionIndex(0)
        setAnswerResult(null)
        setAnswerHistory([])
        setPointTotal(0)
        setDisplayQuiz(false)
        setTriviaResults(false)
    }

    const flexCenterStyle = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', padding: '10px' };

    function SelectGroup() {
        return (
            <>
                <div style={flexCenterStyle}>
                    {categoryOptions.map((category) => (
                        <Sheet
                            key={category}
                            variant="outlined"
                            sx={{
                                borderRadius: 'md',
                                boxShadow: 'sm',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                minWidth: 120,
                                '&:hover': {
                                    border: '1px solid #000040'
                                },
                                '.MuiFormControlLabel-label': { color: '#000040', fontFamily: '"Merriweather", serif' }
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        icon={<RadioButtonUncheckedRounded sx={{ color: '#000040' }} />}
                                        checkedIcon={<RadioButtonCheckedRounded sx={{ color: '#000040' }} />}
                                        checked={checkedValues.includes(category)}
                                        onChange={() => handleCheckboxChange(category)}
                                    />
                                }
                                label={category.replace(/_/g, ' ').toUpperCase()}
                                value={category}
                            />
                        </Sheet>
                    ))}
                </div>
                <div style={flexCenterStyle}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        defaultValue='easy'
                        sx={{ color: '#000040', fontFamily: '"Merriweather", serif' }}
                    >
                        <MenuItem
                            value="easy"
                            sx={{ color: '#000040', fontFamily: '"Merriweather", serif' }}
                        >Easy</MenuItem>
                        <MenuItem
                            value="medium"
                            sx={{ color: '#000040', fontFamily: '"Merriweather", serif' }}
                        >Medium</MenuItem>
                        <MenuItem
                            value="hard"
                            sx={{ color: '#000040', fontFamily: '"Merriweather", serif' }}
                        >Difficult</MenuItem>
                    </Select>
                </div>
            </>
        );
    }

    return (
        <>
            {!displayQuiz && !triviaResults && (
                <div>
                    <SelectGroup props={categoryOptions} />
                    <div style={flexCenterStyle}>
                        <Box sx={{ width: '50%' }}>
                            <h3>Number of Questions</h3>
                            <Slider
                                defaultValue={10}
                                step={1}
                                marks
                                min={1}
                                max={20}
                                value={numberofQuestions}
                                valueLabelDisplay="auto"
                                onChange={(e, newValue) => setNumberOfQuestions(newValue)}
                            />
                        </Box>
                    </div>

                    <div style={flexCenterStyle}>
                        <Button variant="contained" onClick={generateQuiz} sx={{ fontFamily: '"Merriweather", serif' }}>
                            Start Quiz
                        </Button>
                    </div>
                </div>
            )}

            {displayQuiz && (
                <div>
                    {answerResult && (
                        <div
                            css={[popupBoxStyles, { backgroundColor: answerResult.color }]}
                        >
                            {answerResult.message}
                        </div>
                    )}
                    {questions.length > 0
                        && currentQuestionIndex < questions.length &&
                        !triviaResults && (
                            <DisplayQuestion
                                question={questions[currentQuestionIndex]}
                                onNextQuestion={handleNextQuestion}
                                questionNumber={currentQuestionIndex + 1}
                                totalQuestions={questions.length}
                            />
                        )}
                </div>
            )}
            {questions.length === 0 && !triviaResults && displayQuiz && <div>Loading...</div>}
            {triviaResults && (
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <div style={{ display: 'block', textAlign: 'center' }}>
                        <h2>Quiz Finished!</h2>
                        <h3>
                            Your score: {currentScore.score}/{currentScore.questions}
                        </h3>
                        <h3>Difficulty: {beautifyCategories(currentScore.difficulty)}</h3>
                        <h3>Category: {beautifyCategories(currentScore.category)}</h3>
                        <div>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {answerHistory.map((question, index) =>
                                    <li key={index}>
                                        <p style={{ color: question[1] === 'Correct!' ? 'green' : 'red' }}>
                                            Question: {question[0]} Your answer was {question[1]} The answer was "{question[2]}"
                                        </p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <Button variant="contained" onClick={handleReset} style={{ marginTop: '20px', fontFamily: '"Merriweather", serif' }}>
                        Try Again?
                    </Button>
                </div>

            )}
        </>
    );
}

const popupBoxStyles = css`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 10px;
    font-size: 24px;
    color: white;
    background-color: rgba(0, 128, 0, 0.8);
    text-align: center;
    z-index: 1000;
`;
