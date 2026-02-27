import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
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

export default GlobalStyle