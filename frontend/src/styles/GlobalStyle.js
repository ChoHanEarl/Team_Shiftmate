import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    *, *::before, *::after {box-sizing: border-box; margin: 0; paddding: 0;}
    body {
        font-family: 'Segoe UI', sans-serif;
        background: #F9FAFB;
        color: #1F2937;
        -webkit-font-smoothing: antialiased;
    }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }
    input, select, textarea { font-family: inherit; }
    a { text-decoration: none; color: inherit; }
`

export default GlobalStyle;