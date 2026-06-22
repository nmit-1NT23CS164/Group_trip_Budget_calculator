import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { tripService } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await tripService.getAllTrips();
      setTrips(response.data);
    } catch (err) {
      setError('Failed to fetch trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await tripService.deleteTrip(tripId);
        setTrips(trips.filter(trip => trip._id !== tripId));
      } catch (err) {
        setError('Failed to delete trip');
      }
    }
  };

  if (loading) {
    return (
      <Container className='dashboard-container d-flex justify-content-center align-items-center'>
        <Spinner animation='border' />
      </Container>
    );
  }

  return (
    <Container className='dashboard-container'>
      <div className='dashboard-header'>
        <h1>Welcome, {user?.name}!</h1>
        <p>Manage your trips and expenses</p>
      </div>

      {error && <Alert variant='danger'>{error}</Alert>}

      <Row className='mb-4'>
        <Col md={12}>
          <Button href='/create-trip' variant='success' size='lg'>
            + Create New Trip
          </Button>
        </Col>
      </Row>

      {trips.length === 0 ? (
        <Alert variant='info'>
          No trips yet. <a href='/create-trip'>Create your first trip!</a>
        </Alert>
      ) : (
        <Row>
          {trips.map(trip => (
            <Col md={4} key={trip._id} className='mb-4'>
              <Card className='trip-card'>
                <Card.Body>
                  <Card.Title>{trip.name}</Card.Title>
                  <Card.Text>{trip.description}</Card.Text>
                  <div className='trip-details'>
                    <p>
                      <strong>Members:</strong> {trip.members.length}
                    </p>
                    <p>
                      <strong>Budget:</strong> ${trip.budget.toFixed(2)}
                    </p>
                  </div>
                  <div className='trip-actions'>
                    <Button href={`/trip/${trip._id}`} variant='primary' size='sm'>
                      View Details
                    </Button>
                    <Button
                      variant='danger'
                      size='sm'
                      onClick={() => handleDeleteTrip(trip._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
