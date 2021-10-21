import { btnRemove, addSpace } from '../../styles/wrapper';

const ButtonRemove = (props: any) => (
  <button
    type={'button'}
    disabled={props.disabled}
    onClick={props.onClick}
    className={['btn-remove', props.disabled && 'btn-disable', props.isMiddle && 'add-space'].join(' ')}>
    {props.children}
    <style jsx>{btnRemove}</style>
    <style jsx>{addSpace}</style>
    <style jsx>{`
    .btn-disable,
    .btn-disable:hover {
      background-color: #eee;
      color:#999;
      cursor: default;
    }`}</style>
  </button>
);

export { ButtonRemove };
