import React from "react";
import ReactDOM from "react-dom/client";
import { Global, css } from "@emotion/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";


import { Root, ErrorPage } from './App'
import { TriviaPage } from './components/Trivia'
import { HomePage } from './components/Home'
import { SuperlativesPage } from './components/Superlatives'
import { TriviaPractice } from './components/TriviaPractice'
import { CountryEntry, CountryEntryContainer, EncyclopediaPage } from './components/Encyclopedia'

const globalStyles = css`
  @import url("https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap");

  html {
    color: #000040;
    font-family: "Merriweather", serif;
    font-weight: 400;
    font-style: normal;
  }

  body {
    margin: 0px;
  }
`;

const queryClient = new QueryClient();

const router = createBrowserRouter([

    {
        path: "/",
        element: <Root />,
        errorElement: <Root><ErrorPage /></Root>,
        children: [
            { index: true, element: <HomePage /> },
            { path: "trivia", element: <TriviaPage /> },
            { path: "triviapractice", element: <TriviaPractice /> },
            { path: "superlatives", element: <SuperlativesPage /> },
            {
                path: "encyclopedia",
                element: <EncyclopediaPage />,
                children: [
                    { index: true, element: <CountryEntryContainer><h1>Select a country on the left to view information about it.</h1></CountryEntryContainer> },
                    { path: ":ccn3", element: <CountryEntry /> }
                ]
            },
            { path: "*", element: <h1>404: Page Not Found</h1> }
        ]
    }
])

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Global styles={globalStyles} />
        <CookiesProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </CookiesProvider>
    </React.StrictMode>
);
