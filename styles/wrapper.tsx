import css from 'styled-jsx/css';

const wrap50 = css`
  .wrap50 {
    display: grid;
    grid-template-rows: auto;
    column-gap: 1.5rem;
    grid-template-columns: 50% auto;
    grid-template-areas: 'boxLeft boxRight';
  }
  .box-left {
    grid-area: boxLeft;
  }
  .box-right {
    grid-area: boxRight;
  }

  @media only screen and (max-width: 600px) {
    .wrap50 {
      grid-template-columns: auto;
      grid-template-areas:
        'boxLeft'
        'boxRight';
    }
  }
`;

const btnGroup = css`
  .btn-group {
    padding-top: 0.6em;
    padding-bottom: 0em;
    display: flex;
    justify-content: center;
  }
`;

const btnOK = css`
  .btn-ok {
    color: #fff;
    background-color: #2ea44f;
    border: 1px solid #d1d9df;
    font-weight: 700;
    min-width: 80px;
    padding: 6px;
    border: 1px solid #d1d9df;
    border-radius: 0.4rem;
    cursor: pointer;
  }

  .btn-ok:focus,
  .btn-ok:hover {
    background-color: #299146;
  }
  .btn-ok:active {
    background-color: #2ea44f;
  }
`;

const btnCancel = css`
  .btn-cancel {
    background-color: #eff1f9;
    color: #e49400;
    border: 1px solid #d1d9df;
    font-weight: 700;
    min-width: 80px;
    padding: 6px;
    border-radius: 0.4rem;
    cursor: pointer;
  }

  .btn-cancel:focus,
  .btn-cancel:hover {
    background-color: #e29300;
    color: #fff;
  }
  .btn-cancel:active {
    background-color: #ffa500;
    color: #fff;
  }
`;

const btnRemove = css`
  .btn-remove {
    background-color: #eff1f9;
    color: #ef0202;
    min-width: 80px;
    font-weight: 700;
    padding: 6px;
    border-radius: 0.4rem;
    cursor: pointer;
    border: 1px solid #d1d9df;
  }

  .btn-remove:focus,
  .btn-remove:hover {
    background-color: #ef0202;
    color: #fff;
  }
  .btn-remove:active {
    background-color: #df0202;
    color: #fff;
  }
`;

const addSpace = css`
  .add-space {
    margin-left: 6px;
    margin-right: 6px;
  }
`;

const wrap25 = css`
  .mb-2 {
    margin-bottom: 0.6em;
  }

  .box {
    background-color: #fff;
    border: 1px solid #d1d8df;
    border-radius: 5px;
    padding: 0 1rem;
  }

  .wrap25 {
    display: grid;
    column-gap: 1.5rem;
    grid-template-columns: 25% auto;
    grid-template-rows: auto;
    grid-template-areas: 'boxLeft boxRight';
  }

  .box-left {
    grid-area: boxLeft;
  }
  .box-right {
    grid-area: boxRight;
  }
`;

const btnLink = css`
  .btn-link {
    text-decoration: none;
    cursor: pointer;
    font-weight: 700;
    padding: 2px 6px;
    margin: -2px -6px;
    display: inline-block;
    border: 1px solid #e1f8ff;
    border-radius: 5px;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .btn-link:hover,
  .btn-link:focus,
  .btn-link:active {
    text-decoration: none;
    background-color: #ebf4ff;
    color: #0070f3;
    border-color: #0070f3;
  }
`;

export {
  btnLink,
  wrap25,
  wrap50,
  btnGroup,
  btnCancel,
  btnRemove,
  btnOK,
  addSpace,
};
