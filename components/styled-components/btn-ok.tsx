import { btnOK, addSpace } from '../../styles/wrapper';

const ButtonOK = (props: any) => (
  <button
    type={'submit'}
    disabled={props.disabled}
    onClick={props.onClick}
    className={['btn-ok', props.disabled && 'btn-disable', props.isMiddle && 'add-space'].join(' ')}>
    {props.children}
    <style jsx>{btnOK}</style>
    <style jsx>{addSpace}</style>
    <style jsx>{`
    .btn-disable, .btn-disable:hover {
      background-color: #73af84;
      color:#fff;
      cursor: default;
    }`}</style>
  </button>
);

export { ButtonOK };
