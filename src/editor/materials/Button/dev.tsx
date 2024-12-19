/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button as AntdButton } from "antd";
import { ButtonType } from "antd/es/button";
import { CommonComponentProps } from "../../interface";
import { useDrag } from "react-dnd";
export interface ButtonProps {
  type: ButtonType;
  text: string;
}

const Button = ({ type, text, id, styles }: CommonComponentProps) => {
  const [_, drag] = useDrag({
    type: "Button",
    item: {
      type: "Button",
      dragType: "move",
      id: id,
    },
  });

  return (
    <AntdButton type={type} data-component-id={id} style={styles} ref={drag}>
      {text}
    </AntdButton>
  );
};

export default Button;
