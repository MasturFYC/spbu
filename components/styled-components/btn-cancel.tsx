import { btnCancel } from '../../styles/wrapper';

const ButtonCancel = (props: any) => (
  <button type={'button'} onClick={props.onClick} className={'btn-cancel'}>
    {props.children}
    <style jsx>{btnCancel}</style>
  </button>
);

export { ButtonCancel };
