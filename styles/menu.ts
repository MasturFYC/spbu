import css from "styled-jsx/css";

export const menuStyle = css`
.navbar-dropdown-content {
  display: none;
  position: absolute;
  min-width: 160px;
  z-index: 1;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 2, 2);
  color: #000;
  border: 1px solid #cecece;
  border-radius: 5px;
  padding: 0.6rem 0;
}
.navbar-dropdown {
  position: relative;
  display: inline-block;
  padding: 0 10px;
  margin: 0 5px;
  filter: drop-shadow(0px 10px 8px #d1d8dfaa);
}
.navbar-dropdown a::first {
    margin: -1px-1px 0-1px;
}
.navbar-dropdown a {
  display: flex;
  padding: 0.6rem;
  line-height: 1;
  flex-direction: column;
  text-decoration: none;
  transition: color 0.15s ease, border-color 0.15s ease;
}
.navbar-dropdown a:hover,
.navbar-dropdown a:active {
  color: #fff;
  background-color: #0070f3;
}
.navbar-dropdown a:hover {
  margin: -1px -1px 0 -1px;
}
.navbar-dropdown:hover {
  cursor: pointer;
}
.navbar-dropdown:hover .navbar-dropdown-content {
  display: block;
}
`