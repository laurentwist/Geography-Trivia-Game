import React from "react";
import styled from "@emotion/styled";
import { useCookies } from "react-cookie";
import { Button } from "@mui/material";

const LeaderboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    border: 1px solid #000040;
    border-radius: 5px;

    padding: 50px;

    min-width: 600px;
    max-width: 1000px;

    h1 {
        margin: 0px 0px 25px 0px;

        font-size: 2em;
    }

    h2 {
        margin: 20px 0px;

        font-size: 1.5em;
    }

    h3 {
        margin: 20px 0px;

        font-size: 1.25em;
    }

    p {
        margin: 0px;

        font-size: 1em;
    }

    ol {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 10px;

        margin: 0px 0px 50px 0px;

        padding-left: 50px;

        li {
            counter-increment: li;
        }

        li::marker {
            content: "#" counter(li) "    ";
        }
    }
`

const DualLeaderboardsContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px; // Adjust this to change the space between the two leaderboards
    width: 100%;
    max-width: 100%;
    overflow-wrap: break-word;
`

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
`

const HomePageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    padding: 50px;
`

export function HomePage() {
    // Retrieve the leaderboard scores from the cookie array
    // const triviaScores = useCookies(["leaderboard"])[0].triviaLeaderboard || [];
    const [cookies, setCookie] = useCookies([
        "triviaLeaderboard",
        "superlativeLeaderboard",
    ]);
    console.log(cookies);

    // const superlativesScores =
    //   useCookies(["leaderboard"])[0].superlativeLeaderboard || [];

    // Separate the scores based on difficulty level
    const easyScores = cookies.triviaLeaderboard?.filter(
        (score) => score.difficulty === "easy"
    ) || []
    const mediumScores = cookies.triviaLeaderboard?.filter(
        (score) => score.difficulty === "medium"
    ) || []
    const hardScores = cookies.triviaLeaderboard?.filter(
        (score) => score.difficulty === "hard"
    ) || []

    const superlativesScores = cookies.superlativeLeaderboard || []

    // Sort the scores for each difficulty level
    const sortTriviaScores = (scores) => {
        return scores
            .sort((a, b) => {
                const aScorePerQuestion = a.score / a.questions;
                const bScorePerQuestion = b.score / b.questions;

                if (aScorePerQuestion > bScorePerQuestion) {
                    return -1;
                } else if (aScorePerQuestion < bScorePerQuestion) {
                    return 1;
                } else {
                    return b.questions - a.questions;
                }
            })
            .slice(0, 10);
    }

    const sortSuperlativesScores = (scores) => {
        return scores
            .sort((a, b) => {
                if (a.score > b.score) {
                    return -1;
                } else if (a.score < b.score) {
                    return 1;
                } else {
                    return b.level - a.level;
                }
            })
            .slice(0, 30);
    }

    // Capitalize the first letter of each word in the category
    const beautifyCategories = (categories) => {
        return categories
            .split(",")
            .map((category) =>
                category
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
            )
            .join(", ");
    }

    const clearLeaderboard = (difficulty) => {
        if (difficulty != "superlatives") {
            const newLeaderboard = cookies.triviaLeaderboard?.filter(
                (score) => score.difficulty !== difficulty
            ) || []
            console.log(newLeaderboard);

            setCookie("triviaLeaderboard", newLeaderboard);
        } else {
            setCookie("superlativeLeaderboard", []);
        }
    }

    const clearButtonStyles = {
        border: '1px solid #000040',
        color: '#000040',
        fontFamily: '"Merriweather", serif',
        '&:hover': {
            border: '1px solid #000040',
            backgroundColor: '#ccccd9'
        }
    }

    return (
        <HomePageContainer>
            <LeaderboardContainer>
                <h1>Leaderboard</h1>
                <DualLeaderboardsContainer>
                    <div>
                        <h2>Trivia Top Scores</h2>
                        <div id="easyScores">
                            <HeaderContainer>
                                <h3>Easy</h3>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        clearLeaderboard("easy");
                                    }}
                                    sx={clearButtonStyles}
                                >
                                    Clear
                                </Button>
                            </HeaderContainer>
                            {easyScores.length === 0 && <p>No recorded scores yet</p>}
                            <ol>
                                {sortTriviaScores(easyScores).map((score, index) => (
                                    <li key={index}>
                                        <strong>
                                            {score.score}/{score.questions}
                                        </strong>{" "}
                                        - Categories: {beautifyCategories(score.category)}
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div id="mediumScores">
                            <HeaderContainer>
                                <h3>Medium</h3>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        clearLeaderboard("medium");
                                    }}
                                    sx={clearButtonStyles}
                                >
                                    Clear
                                </Button>
                            </HeaderContainer>
                            {mediumScores.length === 0 && <p>No recorded scores yet</p>}
                            <ol>
                                {sortTriviaScores(mediumScores).map((score, index) => (
                                    <li key={index}>
                                        <strong>
                                            {score.score}/{score.questions}
                                        </strong>{" "}
                                        - Categories: {beautifyCategories(score.category)}
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div id="hardScores">
                            <HeaderContainer>
                                <h3>Hard</h3>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        clearLeaderboard("hard");
                                    }}
                                    sx={clearButtonStyles}
                                >
                                    Clear
                                </Button>
                            </HeaderContainer>
                            {hardScores.length === 0 && <p>No recorded scores yet</p>}
                            <ol>
                                {sortTriviaScores(hardScores).map((score, index) => (
                                    <li key={index}>
                                        <strong>
                                            {score.score}/{score.questions}
                                        </strong>{" "}
                                        - Categories: {beautifyCategories(score.category)}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                    <div id="superlativesLeaderboard">
                        <HeaderContainer>
                            <h2>Superlatives Top Scores</h2>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    clearLeaderboard("superlatives");
                                }}
                                sx={clearButtonStyles}
                            >
                                Clear
                            </Button>
                        </HeaderContainer>
                        {superlativesScores.length === 0 && (
                            <p>No recorded scores yet</p>
                        )}
                        <ol>
                            {sortSuperlativesScores(superlativesScores).map(
                                (score, index) => (
                                    <li key={index}>
                                        <strong>{score.score}</strong> points - Level{" "}
                                        {score.level}
                                    </li>
                                )
                            )}
                        </ol>
                    </div>
                </DualLeaderboardsContainer>
            </LeaderboardContainer>
        </HomePageContainer>
    );
}
