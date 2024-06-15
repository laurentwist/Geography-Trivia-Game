import { Outlet, NavLink, useRouteError } from 'react-router-dom'
import styled from '@emotion/styled'

export function Root({ children }) {
    return (
        <>
            <SideBar />
            <main>
                {children || <Outlet />}
            </main>
        </>
    )
}

const SidebarContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    padding: 0px;

    width: 100%;

    background-color: #b1c3dc;

    h1 {
        margin: 20px;

        font-size: 1.75em;
    }

    div {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    a {
        border-bottom: 5px solid transparent;

        padding: 20px 30px;

        font-size: 1.5em;
        color: #000040;
        
        text-decoration: none;

        &:hover, &:visited:hover {
            border-bottom: 5px solid #555585;

            color: #404070;

            background-color: #ccccd9;
        }

        &:visited {
            color: inherit;
        }
    }

    .active {
        border-bottom: 5px solid #404070;

        background-color: #ccccd9;
    }
`

export function SideBar() {
    return (
        <SidebarContainer>
            <h1>CS 494 Group 6 - Trivia Games</h1>
            <div>
                <NavLink exact="true" to="/">Home</NavLink>
                <NavLink to="/trivia">Trivia</NavLink>
                <NavLink to="/triviapractice">Trivia Practice</NavLink>
                <NavLink to="/superlatives">Superlatives</NavLink>
                <NavLink to="/encyclopedia">Encyclopedia</NavLink>
            </div>
        </SidebarContainer>
    )
}

export function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <>
            <p>Error: {error.statusText || error.message}</p>
        </>
    )
}
