import { Stack, Card, Row, Col } from "react-bootstrap";
import HackNavbar from "../HackNavbar/HackNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import HackButton from "../HackButton/HackButton";
import Popup from "../Popup/Popup";
import { Form, Formik } from "formik";
import { CreateSafeRequest, openSafe, OpenSafeRequest } from "../HackNavbar/api";
import { TextInput } from "../Inputs/Inputs";
import DarkRoomEffect from "../DarkRoomEffect/DarkRoomEffect";
import Swal from "sweetalert2";

export default function Home() {
  interface Safe {
    id: string;
    text: string;
  }

  const [safes, setSafes] = useState<Safe[]>([]);

  const [username, setUsername] = useState("");

  const [popup, setPopup] = useState(false);

  const fetchSafes = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/safe/user/${userId}`);
      if (response.data) {
        setSafes(response.data);
      }
    } catch (error) {
      console.error("Error fetching safes:", error);
    }
  };
  
  const location = useLocation();
  
  useEffect(() => {
    const hash = location.hash.substring(1); 
    if (hash) {
      fetchSafes(hash);
      setUsername(hash);
    }

  }, [location.hash]);

  return (
    <DarkRoomEffect>
    <Stack gap={3} className="min-vh-100">
      <HackNavbar />

      <Row className="g-4 p-4">
        {safes.map((safe) => (
          <Col key={safe.id} xs={12} md={6} lg={4} xl={3}>
            <Card className="h-100 shadow justify-content-center align-items-center">
              <Card.Img
                variant="top"
                src="/safe.png"
                alt={`Safe ${safe.id}`}
                className="w-50"
              />
              <Card.Body>
                <HackButton variant="white" onClick={() => setPopup(true)}>Try to open me!</HackButton>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty state */}
      {safes.length === 0 && (
        <div className="text-center mt-5">
          <h4>No safes found</h4>
          <p className="text-muted">Create your first safe to get started</p>
        </div>
      )}

        <Popup show={popup} handleClose={() => setPopup(false)}>
      <Formik
        initialValues={{ userName: "", safe: "" }}
        onSubmit={async (values) => {
          const data: OpenSafeRequest = {
            userId: values.userName,
            safeId: values.safe,
          };
          const res: any = await openSafe(data);
		  console.log(res);
		  if (!res.error) {
			Swal.fire({
				title: `${res.ownerId} este incantat de ${res.text}`,
				icon: "success",
			});
		  } else {
			Swal.fire({
				title: "N-ai voie",
				icon: "error",
			});
		  }
          setPopup(false);
        }}
        >
        {({ isSubmitting }) => (
          <Form>
          <Stack gap={3}>
            <TextInput name="safe" type="text" label="Safe name" placeholder="Enter safe name" />
            <TextInput name="userName" type="text" label="Username" placeholder="Enter your username" />
            <HackButton variant="white" type="submit" >Submit</HackButton>
          </Stack>
          </Form>
        )}
        </Formik>
      </Popup>
    </Stack>
    </DarkRoomEffect>
  );
}