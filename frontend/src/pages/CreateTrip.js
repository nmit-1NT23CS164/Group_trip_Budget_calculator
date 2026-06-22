import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { tripService } from '../services/api';
import '../styles/CreateTrip.css';

const CreateTrip = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await tripService.createTrip(formData);
      navigate(`/trip/${response.data.trip._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='create-trip-container'>
      <Card className='create-trip-card'>
        <Card.Body>
          <h2 className='text-center mb-4'>Plan Your Trip</h2>
          {error && <Alert variant='danger'>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
              <Form.Label>Trip Name</Form.Label>
              <Form.Control
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='e.g., Summer Vacation 2024'
                required
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as='textarea'
                name='description'
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder='Describe your trip...'
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type='date'
                name='startDate'
                value={formData.startDate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type='date'
                name='endDate'
                value={formData.endDate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Budget</Form.Label>
              <Form.Control
                type='number'
                name='budget'
                value={formData.budget}
                onChange={handleChange}
                placeholder='0.00'
                step='0.01'
              />
            </Form.Group>

            <Button
              variant='primary'
              type='submit'
              className='w-100'
              disabled={loading}
            >
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateTrip;
