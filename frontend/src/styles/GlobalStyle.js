import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { font-size: 16px; -webkit-font-smoothing: antialiased; }

    body {
        font-family: ${({ theme }) => theme.fonts.sans};
        background: ${({ theme }) => theme.colors.bg};
        color: ${({ theme }) => theme.colors.text};
        line-height: 1.6;
        min-height: 100vh;
        transition: background 0.2s ease, color 0.2s ease;
    }

    a { text-decoration: none; color: inherit; }

    button { font-family: inherit; cursor: pointer; border: none; outline: none; }

    input, select, textarea {
        font-family: inherit;
        outline: none;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }

    /* React-datepicker override */
    .react-datepicker-wrapper { width: auto; }
    .react-datepicker__input-container input {
        padding: 10px 14px;
        border: 1.5px solid #E5E7EB;
        border-radius: 10px;
        font-size: 14px;
        background: #fff;
        cursor: pointer;
        transition: border-color 0.18s;
        &:focus { border-color: #3B82F6; }
    }
`;

export default GlobalStyle;