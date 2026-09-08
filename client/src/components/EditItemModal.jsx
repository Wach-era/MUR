import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';


const EditItemModal = ({ item, isOpen, onClose, onItemUpdated }) => {
  const [formData, setFormData] = useState({ ...item });

  useEffect(() => {
    setFormData({ ...item });
  }, [item]);

  if (!isOpen || !item) return null;

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/api/items/${item._id}`, formData);
      onItemUpdated(res.data.data);
      onClose();
    } catch (err) {
      alert('Error updating item.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Edit Item Details</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Title: <input name="title" value={formData.title || ''} onChange={handleChange} style={styles.input} /></label>
          <label>Price (Ksh): <input name="price" type="number" step="0.01" value={formData.price || 0} onChange={handleChange} style={styles.input} /></label>
          <label>Stock Quantity: <input name="stockQuantity" type="number" value={formData.stockQuantity || 1} onChange={handleChange} style={styles.input} /></label>
          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.submitBtn}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 },
  modal: { backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '380px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { width: '100%', padding: '6px', margin: '4px 0 8px 0' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' },
  cancelBtn: { padding: '8px 12px', background: '#e2e8f0', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  submitBtn: { padding: '8px 12px', background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default EditItemModal;