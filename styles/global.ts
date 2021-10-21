import css from 'styled-jsx/css'

export const globalStyle = css.global`
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  line-height: 1.6;
  font-size: 14px;
  background-color: #f8fafa;
}

* {
  box-sizing: border-box;
}

a {
  color: #0070f3;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  display: block;
}

input.box-input {
  font-family: inherit;
  border-radius: 3px;
  border: none;
  padding: 1px 6px 2px 6px;
  height: 1.9em;
  box-shadow: 0 0 0 1px #c7c7c7;
  outline: none;
  min-width: 50px;
}
select, textarea {
  font-family: inherit;
  border-radius: 3px;
  border: none;
  padding: 1px 6px 2px 6px;
  box-shadow: 0 0 0 1px #c7c7c7;
  outline: none;
}
select:focus, textarea:focus, input.box-input:focus {
    box-shadow: 0 0 0 2px #0084ff;
    border: none;
    outline: none;
    transition: color 0.15s ease, box-shadow 0.15s ease;
  }

select, label, input, textarea {
  font-size: 14px;
}
select {
  padding: 4px 6px;
}
`