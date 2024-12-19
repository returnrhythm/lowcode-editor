import { Button as AntdButton } from "antd";
import { CommonComponentProps } from "../../interface";

const Button = ({ type, text, styles, id, ...props }: CommonComponentProps) => {
  return (
    <AntdButton type={type} style={styles} id={id + ""} {...props}>
      {text}
    </AntdButton>
  );
};

export default Button;
