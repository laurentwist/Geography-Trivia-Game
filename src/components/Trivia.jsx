import styled from '@emotion/styled'
import Search from './TriviaSearch'
import HelpPanel from './HelpPanel'
import { Link } from 'react-router-dom'

const TriviaPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 10px;

    padding: 20px;

    h1 {
        margin: 0px;
    }
`

function Help() {
    return (
        <HelpPanel>
            <h1>Instructions</h1>
            <p>Click the categories that you would be interested in answering trivia in. Select a difficulty and drag the slider to indicate how many questions you want to answer.</p>
            <p>You only get one attempt to answer each question, so take your time and read each one carefully!</p>
            <p>Check out the <Link to="/triviapractice"><strong>trivia practice</strong></Link> to brush up on your knowledge before competing.</p>
        </HelpPanel>
    )
}

export function TriviaPage() {
    return (
        <TriviaPageContainer>
            <Help/>
            <Search />
        </TriviaPageContainer>
    )
}