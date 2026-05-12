import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    destinationName: '',
    travelDate: '',
    numberOfTravelers: 1,
    packageType: 'Silver',
    price: 0,
    contactAddress: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bookings');
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenModal = (booking = null) => {
    if (booking) {
      setEditingId(booking._id);
      setFormData({
        destinationName: booking.destinationName,
        travelDate: new Date(booking.travelDate).toISOString().split('T')[0],
        numberOfTravelers: booking.numberOfTravelers,
        packageType: booking.packageType,
        price: booking.price,
        contactAddress: booking.contactAddress
      });
    } else {
      setEditingId(null);
      setFormData({
        destinationName: '',
        travelDate: '',
        numberOfTravelers: 1,
        packageType: 'Silver',
        price: 0,
        contactAddress: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/bookings/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/bookings', formData);
      }
      setIsModalOpen(false);
      fetchBookings();
    } catch (err) {
      console.error('Error saving booking', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`http://localhost:5000/api/bookings/${id}`);
        fetchBookings();
      } catch (err) {
        console.error('Error deleting booking', err);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar">
        <div className="navbar-brand">TravelAdmin</div>
        <div className="navbar-nav">
          <span style={{ color: 'var(--text-muted)' }}>Welcome, {user.name}</span>
          <button className="btn btn-danger" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>My Bookings</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + New Booking
          </button>
        </div>

        <div className="bookings-grid">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <h3 className="booking-dest">{booking.destinationName}</h3>
              <div className="booking-detail">
                <span>Date</span>
                <span>{new Date(booking.travelDate).toLocaleDateString()}</span>
              </div>
              <div className="booking-detail">
                <span>Travelers</span>
                <span>{booking.numberOfTravelers}</span>
              </div>
              <div className="booking-detail">
                <span>Price</span>
                <span>${booking.price}</span>
              </div>
              
              <span className={`badge badge-${booking.packageType.toLowerCase()}`}>
                {booking.packageType} Package
              </span>
              
              <div style={{ marginTop: '0.5rem' }}>
                <span className={`status-${booking.bookingStatus.toLowerCase()}`} style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                  {booking.bookingStatus}
                </span>
              </div>

              <div className="card-actions">
                <button className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }} onClick={() => handleOpenModal(booking)}>Edit</button>
                <button className="btn btn-danger" style={{ flex: 1, padding: '0.5rem' }} onClick={() => handleDelete(booking._id)}>Cancel</button>
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              No bookings found. Start by creating a new booking!
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Edit Booking' : 'Add New Booking'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Destination</label>
                <input type="text" name="destinationName" className="form-control" value={formData.destinationName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Travel Date</label>
                <input type="date" name="travelDate" className="form-control" value={formData.travelDate} onChange={handleChange} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Travelers</label>
                  <input type="number" name="numberOfTravelers" min="1" className="form-control" value={formData.numberOfTravelers} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input type="number" name="price" min="0" className="form-control" value={formData.price} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Package Type</label>
                <select name="packageType" className="form-control" value={formData.packageType} onChange={handleChange}>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Contact Address</label>
                <textarea name="contactAddress" className="form-control" value={formData.contactAddress} onChange={handleChange} required rows="3"></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {editingId ? 'Update Booking' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
