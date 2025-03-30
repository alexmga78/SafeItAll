import { Stack } from "react-bootstrap";
import styles from "./Home.module.css";
import HackNavbar from "../HackNavbar/HackNavbar";
import DarkRoomEffect from "../DarkRoomEffect/DarkRoomEffect";

export default function Home() {
  return (
    <DarkRoomEffect>
      <Stack>
        <HackNavbar />
      </Stack>
    </DarkRoomEffect>
  );
}
