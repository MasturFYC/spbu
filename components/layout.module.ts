import css from 'styled-jsx/css'

export const layoutStyle = css`
.container {
  padding: 0;
  margin: 0 auto;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.backToHome {
  margin: 3rem 0 0;
}
`

export const mainLayout = css`

.main-layout {
  color: #444;
  display: grid;
  grid-template-columns: auto;
  grid-template-areas:
  'boxHeader'
  'boxContent'
  'boxFooter';
  padding: 0;
  min-height: 100vh;
}

.main-content {
  grid-area: boxContent;
  display: grid;
  width: 100%;
  margin: 0 auto;
  grid-template-columns: 250px auto;
  grid-template-areas:
  'leftContent rightContent';
  min-height: calc(100vh - (4rem + 5rem));
  padding:0rem 2rem;
}

.box-header {
  grid-area: boxHeader;
  height: 4rem;
  min-height: 4rem;
  background-color: #444;
  color: #eee;
  padding: 0 2rem;
}

.box-footer {
  grid-area: boxFooter;
  font-size: small;
  min-height: 5rem;
  height: 5rem;
  padding: 2rem;
  margin: 0 2rem;
  border-top: 1px solid #d1d8df;
}

.left-content{
  grid-area: leftContent;
  padding: 0 0.6rem;
}

.right-content{
  grid-area: rightContent;
  padding: 1rem 0.6rem;
}

@media only screen and (max-width: 600px) {
  .main-layout {
    padding: 0;
  }
  .main-content {
    grid-template-columns: auto;
    grid-template-areas:
      "rightContent"
      "leftContent";
    padding: 0;
    min-height: calc(100vh - (4rem + 5rem));
  }
  .container {
    max-width: 100vw;
  }

  .box-header {
    padding: 0 0.6rem;
    height: 5rem;
    min-height: 5rem;
  }

  .box-footer {
    margin: 0 0.6rem;
     padding: 2rem 0.6rem 0.6rem 0.6rem;
  }
}
`