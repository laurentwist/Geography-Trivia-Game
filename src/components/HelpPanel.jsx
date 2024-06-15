import React, { useState } from 'react';
import styled from "@emotion/styled"

const HelpPanelContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    z-index: 999;

    position: absolute;
    right: 0px;

    button {
        display: flex;
        justify-content: center;
        align-items: center;

        padding: 10px;

        border: 1px solid #000040;
        border-right: 0px;
        border-radius: 5px 0px 0px 5px;

        fill: #000040;

        background-color: #ffffff;

        img {
            width: 40px;
            height: 40px;
        }
    }

    div {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        gap: 20px;

        border: 1px solid #000040;
        border-right: 0px;
        border-radius: 0px 0px 0px 5px;

        padding: 20px;

        max-width: 300px;

        background-color: #ffffff;

        h1 {
            margin: 0px;

            font-size: 1.5em;
        }

        p {
            margin: 0px;

            line-height: 1.5em;

            font-size: 1em;
        }

        a, a:visited {
            color: #404070;
        }
    }
`

const HelpPanel = ({ children }) =>{
    const [helpOpen, setHelpOpen] = useState(false)

    return (
        <HelpPanelContainer>
            <button onClick={() => setHelpOpen(!helpOpen)}>
                <img src={helpOpen ? "/close_icon.svg" : "/help_icon.svg"} />
            </button>
            {helpOpen &&
                <div>
                    {children}
                </div>
            }
        </HelpPanelContainer>
    )
}

export default HelpPanel;