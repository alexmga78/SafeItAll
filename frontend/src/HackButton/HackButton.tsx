import { CSSProperties } from "react";
import { Button } from "react-bootstrap";
import styles from "./HackButton.module.css";

interface HackButtonProps {
  onClick?: (() => void) | ((e: any) => void);
  variant: "green" | "white";
  children: any;
  className?: string;
  styling?: CSSProperties;

  type?: "submit" | "button";
}

export default function HackButton({
  onClick,
  variant,
  children,
  className,
  styling,
  ...props
}: HackButtonProps) {
  if (className) className += ` ${styles.hackBtn}`;
  else className = styles.hackBtn;
  className += " shadow";

  return (
    <Button onClick={onClick} className={className} {...props} style={styling}>
      {children}
    </Button>
  );
}