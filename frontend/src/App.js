import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import AccountOverviewPage from "./pages/AccountOverviewPage.jsx";


function App() {

  return (
    <Router>
      <main>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/account" element={<AccountOverviewPage />} exact />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
