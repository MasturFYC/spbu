import { btnGroup } from '../../styles/wrapper';

const ButtonGroup = (props: any) => (
  <div className={'btn-group'}>
    {props.children}
    <style jsx>{btnGroup}</style>
  </div>
);

export { ButtonGroup };
