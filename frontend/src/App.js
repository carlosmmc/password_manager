import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer.jsx";
import Header from "./components/header.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AuthenticationPage from "./pages/AuthenticationPage.jsx";
import AccountOverviewPage from "./pages/AccountOverviewPage.jsx";
import AddCredentialPage from "./pages/AddCredentialPage.jsx";
import EditCredentialPage from "./pages/EditCredentialPage.jsx";

function App() {
  return (
    <Router>
      <main>
        <Header />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} exact />
            <Route path="/register" element={<RegisterPage />} exact />
            <Route path="/authentication" element={<AuthenticationPage />} exact/>
            <Route path="/account" element={<AccountOverviewPage />} exact />
            <Route path="/account/add" element={<AddCredentialPage />} exact />
            <Route path="/account/edit" element={<EditCredentialPage />} exact />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
