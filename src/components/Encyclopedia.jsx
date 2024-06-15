import { Link, NavLink, Outlet, useParams } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'
import styled from "@emotion/styled"

export const CountryEntryContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: 20px;

    padding: 20px;

    overflow-y: scroll;

    h1 {
        margin: 0px;

        font-size: 1.5em;
    }

    p {
        margin: 0px;

        font-size: 1.25em;
    }

    ul {
        margin: 0px;

        & li {
            font-size: 1em;
        }
    }

    a, a:visited {
        color: inherit;
    }
`

export function CountryEntry() {
    const { ccn3 } = useParams()

    const { data: countryData } = useQuery({
        queryKey: ["countryQuery", ccn3],
        queryFn: async () => {
            const res = await fetch(`https://restcountries.com/v3.1/alpha/${ccn3}`)
            return res.json()
        }
    })

    const { data: borderingData } = useQuery({
        queryKey: ["borderingQuery", countryData],
        queryFn: async () => {
            const codes = countryData[0].borders.join(",")
            const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes}`)
            return res.json()
        },
        enabled: !!countryData?.at(0).borders
    })

    const numFormat = Intl.NumberFormat("en-US")

    const country = countryData?.at(0)
    function formatCoordinates(latlng) {
        const formattedLat = `${Math.abs(latlng[0])}° ${latlng[0] > 0 ? "N" : "S"}`
        const formattedLng = `${Math.abs(latlng[1])}° ${latlng[1] > 0 ? "E" : "W"}`
        return `(${formattedLat}, ${formattedLng})`
    }

    return (
        <CountryEntryContainer>
            {country &&
                <>
                    <h1>{country.name.common}</h1>
                    <p><strong>Official English Name:</strong> {country.name.official}</p>
                    <p><strong>Capital:</strong> {country.capital[0]} {formatCoordinates(country.capitalInfo.latlng)}</p>
                    <p><strong>Area:</strong> {numFormat.format(country.area)} km²</p>
                    <p><strong>Population:</strong> {numFormat.format(country.population)} people</p>
                    <p><strong>Average Population Density:</strong> {numFormat.format(country.population / country.area)} people / km²</p>
                    <p><strong>Languages ({Object.keys(country.languages).length})</strong></p>
                    <ul>
                        {Object.keys(country.languages).map(lang => <li key={lang}>{country.languages[lang]}</li>)}
                    </ul>
                    {country.borders &&
                        <>
                            <p><strong>Bordering Countries ({country.borders.length})</strong></p>
                            <ul>
                                {borderingData?.map(c => <li key={c.ccn3}><Link to={"/encyclopedia/" + c.ccn3}>{c.name.common}</Link></li>)}
                            </ul>
                        </>
                    }
                    <p><strong>Timezones ({country.timezones.length})</strong></p>
                    <ul>
                        {country.timezones.map(t => <li key={t}>{t}</li>)}
                    </ul>
                </>
            }
        </CountryEntryContainer>
    )
}

const EntryList = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;

    border-right: 5px solid #000040;

    overflow-y: scroll;

    a {
        padding: 20px;

        font-size: 1.5em;
        color: #000040;
        font-family: "Merriweather", serif;
        font-weight: 400;
        font-style: normal;

        text-decoration: none;
        
        &:hover, &visited:hover {
            background-color: #ccccd9;
        }
    }

    .active {
        background-color: #ccccd9;
    }
`

const EncyclopediaContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;

    position: absolute;
    top: 152px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`

export function EncyclopediaPage() {
    const { data: allCountryNamesCCN3 } = useQuery({
        queryKey: ["allCountryNamesCCN3"],
        queryFn: async () => {
            const res = await fetch("https://restcountries.com/v3.1/independent?status=true&fields=name,ccn3")
            return res.json()
        }
    })

    return (
        <EncyclopediaContainer>
            <EntryList>
                {allCountryNamesCCN3?.sort((a, b) => a.name.common < b.name.common ? -1 : 1).map(c => (
                    <NavLink key={c.ccn3} to={c.ccn3}>{c.name.common}</NavLink>
                ))}
            </EntryList>
            <Outlet />
        </EncyclopediaContainer>
    )
}