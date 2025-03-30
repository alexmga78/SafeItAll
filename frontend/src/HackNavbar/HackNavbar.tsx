import { Button, Container, Nav, Navbar, Image, Stack } from "react-bootstrap";
import styles from "./HackNavbar.module.css";
import Popup from "../Popup/Popup";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { TextInput } from "../Inputs/Inputs";
import HackButton from "../HackButton/HackButton";
import { createSafe, CreateSafeRequest, shareSafe, ShareSafeRequest } from "./api";
import { useLocation } from "react-router-dom";


// Navbarul de aici: https://www.figma.com/file/SWHby6nl2RlaGnOwxRJSDd/Site?node-id=4%3A203&t=p7XhMdgcGVD24ZCi-0
export default function HackNavbar() {
	const [showCreatePopup, setShowCreatePopup] = useState(false);
	const [showSharePopup, setShowSharePopup] = useState(false);
	const location = useLocation();
	const [username, setUsername] = useState("");

	useEffect(() => {
		setUsername(location.hash.replace('#', ''));
	}, [location]);

  return (
    <>
      <Navbar
        className={`${styles.nav} shadow`}
        bg="white"
        expand="xxl"
        sticky="top"
      >
        <Container className="px-4" fluid>
          <Navbar.Brand href="/">
            <Image height={60} src="/safe.png" />
          </Navbar.Brand>
          <Navbar.Toggle />

          <Navbar.Collapse className="justify-content-end">
            <Nav className="align-items-center text-center">
              <Nav.Link className="mx-2" href="/#alex">
				  alex
              </Nav.Link>
			  <Nav.Link className="mx-2" href="/#alin">
				  alin
              </Nav.Link>
                <Button className="m-2" onClick={() => setShowCreatePopup(true)}>
					Create Safe
                </Button>
                <Button className="m-2" onClick={() => setShowSharePopup(true)}>
					Share Safe
                </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

	  <Popup show={showCreatePopup} handleClose={() => setShowCreatePopup(false)}>
		<Formik
			initialValues={{ text: "", safe: "" }}
			onSubmit={(values) => {
				const data: CreateSafeRequest = {
					ownerId: username,
					safeId: values.safe,
					text: values.text,
				};
				createSafe(data);
				setShowCreatePopup(false);
			}}
			>
			{({ isSubmitting }) => (
				<Form>
				<Stack gap={3}>
					<TextInput name="safe" type="text" label="Safe name" placeholder="Enter safe name" />
					<TextInput name="text" type="text" label="Text for safe" placeholder="Enter your secret" />
					<HackButton variant="white" type="submit" >Submit</HackButton>
				</Stack>
				</Form>
			)}
			</Formik>
	  </Popup>

	  <Popup show={showSharePopup} handleClose={() => setShowSharePopup(false)}>
		<Formik
			initialValues={{ safe: "", friend: "" }}
			onSubmit={(values) => {
				const data: ShareSafeRequest = {
					userId: username,
					safeId: values.safe,
					friendId: values.friend,
				};
				shareSafe(data);
				setShowSharePopup(false);
			}}
			>
			{({ isSubmitting }) => (
				<Form>
				<Stack gap={3}>
					<TextInput name="safe" type="text" label="The safe name" placeholder="Enter the safe to share" />
					<TextInput name="friend" type="text" label="The friend name" placeholder="Enter the friend to share with" />
					<HackButton variant="white" type="submit" >Submit</HackButton>
				</Stack>
				</Form>
			)}
			</Formik>
	  </Popup>
    </>
  );
}
