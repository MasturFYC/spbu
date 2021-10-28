import React, { CSSProperties } from 'react';

type SpanLinkProps = {
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  children?: JSX.Element | JSX.Element[] | string | string[];
};
export function SpanLink(props: SpanLinkProps) {
  let { onClick, children } = props;

  const hover = useHover(
    {
      textDecoration: 'underline',
      fontWeight: 700,
      cursor: 'pointer',
    },
    {
      fontWeight: 700,
      cursor: 'pointer',
    }
  );

  return (
    <span {...hover} onClick={onClick}>
      {children}
    </span>
  );
}
function useHover(styleOnHover: CSSProperties, styleOnNotHover: CSSProperties = {}) {
  const [style, setStyle] = React.useState(styleOnNotHover);
  const onMouseEnter = () => setStyle(styleOnHover);
  const onMouseLeave = () => setStyle(styleOnNotHover);

  return { style, onMouseEnter, onMouseLeave };
}
