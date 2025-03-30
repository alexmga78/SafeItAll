import { FloatingLabel, Form } from "react-bootstrap";
import styles from "./Inputs.module.css";
import { ErrorMessage, Field } from "formik";

interface TextInputProps {
  label?: string;
  name: string;
  type: "text" | "email" | "password";
  placeholder: string;
  rows?: number;
  popupForm?: boolean;
  padding?: boolean;
}

export function TextInput({
  label,
  name,
  type,
  placeholder,
  rows,
  popupForm,
  padding,
}: TextInputProps) {
  let groupClassname = "";
  if (padding) groupClassname += `${styles.inputGroup}`;
  if (popupForm) groupClassname += ` ${styles.popupForm}`;

  return (
    <Form.Group className={groupClassname} controlId={name}>
      {popupForm ? (
        <FloatingLabel label={label}>
          <Field
            as={Form.Control}
            name={name}
            type={type}
            placeholder={placeholder}
            rows={rows} // Passed only if defined
            className="form-control"
          />
        </FloatingLabel>
      ) : (
        <>
          {label && <Form.Label>{label}</Form.Label>}
          <Field
            as={rows ? "textarea" : Form.Control}
            name={name}
            type={type}
            placeholder={placeholder}
            rows={rows} // Passed only if defined
            className="form-control"
          />
        </>
      )}
      <ErrorMessage component="div" className={styles.error} name={name} />
    </Form.Group>
  );
}