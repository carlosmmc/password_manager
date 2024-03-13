import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer.jsx";
import Header from "./components/header.jsx";
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
      <div id="rcc"></div>
      <Footer />
    </Router>
  );
}

export default App;
