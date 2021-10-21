import {useNumberFieldState} from '@react-stately/numberfield';
import {useLocale} from '@react-aria/i18n';
//import { useButton } from '@react-aria/button';
import { useNumberField } from '@react-aria/numberfield';
import React from 'react';

function MyNumberField(props) {
  let { locale } = useLocale();
  let state = useNumberFieldState({ ...props, locale });
  let inputRef = React.useRef();
  let {
    labelProps,
    groupProps,
    inputProps,
    // incrementButtonProps,
    // decrementButtonProps
  } = useNumberField(props, state, inputRef);

  // let { buttonProps: incrementProps } = useButton(incrementButtonProps);
  // let { buttonProps: decrementProps } = useButton(decrementButtonProps);

  return (
    <div>
      <label {...labelProps}>{props.label}</label>
      <div {...groupProps}>
        {/* <button {...decrementProps}>-</button> */}
        <input {...inputProps} ref={inputRef} />
        {/* <button {...incrementProps}>+</button> */}
        <style jsx>
          {`
          input {
            text-align: right;
            width: 100%;
            border: none;
          }`}
        </style>
      </div>
    </div>
  );
}

export default MyNumberField;
