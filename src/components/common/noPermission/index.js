import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { logoutUser } from "../../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PermissionLogo from "../../../assets/NoPermission.svg";

const NoPermissionPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Dispatch logoutUser thunk
      await dispatch(logoutUser()).unwrap(); // Ensures proper error handling
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <Container className="d-flex vh-100 align-items-center justify-content-center">
      <Row>
        <Col>
          <Card className="text-center shadow-lg p-4">
            <Card.Img
              variant="top"
              alt="No Permission"
              src={PermissionLogo} // Replace with your image path
              style={{ width: "200px", margin: "0 auto" }}
            />
            <Card.Body>
              <Card.Title>No access of any module </Card.Title>
              <Card.Text>
                You currently do not have the necessary permissions to access
                this module.
                <br />
                Please contact the administrator for further assistance.
              </Card.Text>
              <Button variant="primary" onClick={() => handleLogout()}>
                Log Out
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NoPermissionPage;
