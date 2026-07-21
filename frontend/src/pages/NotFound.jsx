import { Header } from "../components/Header.jsx";
import "./NotFound.css";

export function NotFound() {
  return (
    <>
      <Header />
      <div className="not-found-message">page not found</div>
    </>
  );
}
