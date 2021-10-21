import css from 'styled-jsx/css'

export const utilsStyle = css`
.heading2Xl {
  font-size: 0.5rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.05rem;
}

.headingXl {
  font-size: 1rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.05rem;
  margin: 1rem 0;
}

@media only screen and (max-width: 600px) {
  .headingLg, .headingXl, .heading2Xl {
    font-size: 1rem;
  }
}

.headingLg {
  font-size: 1rem;
  line-height: 1;
  margin: 1rem 0;
}

.headingMd {
  font-size: 1.2rem;
  line-height: 1.5;
}
 
.borderCircle {
  border-radius: 0;
}

.colorInherit {
  color: inherit;
}

.padding1px {
  padding-top: 1px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.listItem {
  margin: 0 0 1.25rem;
}

.lightText {
  color: #666;
}
`