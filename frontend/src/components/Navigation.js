import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import '../styles/Navigation.css';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg='dark' variant='dark' expand='lg' className='navbar-custom'>
      <Container>
        <Navbar.Brand href='/dashboard'>
          <span className='brand-icon'>💰</span> Trip Budget Calculator
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          {user && (
            <>
              <Nav className='ms-auto'>
                <Nav.Link href='/dashboard'>Dashboard</Nav.Link>
                <Nav.Link href='/create-trip'>Create Trip</Nav.Link>
                <span className='navbar-user'>
                  Welcome, <strong>{user.name}</strong>
                </span>
                <Button
                  variant='outline-light'
                  size='sm'
                  onClick={handleLogout}
                  className='ms-2'
                >
                  Logout
                </Button>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
