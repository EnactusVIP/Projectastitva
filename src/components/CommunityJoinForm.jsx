import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import styles from './CommunityJoinForm.module.css';

export default function CommunityJoinForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    consent: true,
    website_url: '', // Anti-spam honeypot
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const newErrors = {};

    // Full Name
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    // Phone Number (Indian mobile format)
    const strippedPhone = formData.phone.trim().replace(/[\s\-()]/g, '');
    const phoneRegex = /^(?:\+91|91|0)?([6-9]\d{9})$/;
    if (!strippedPhone) {
      newErrors.phone = 'Please enter your phone number.';
    } else if (!phoneRegex.test(strippedPhone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    // City
    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city.';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City name must be at least 2 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field-specific error upon typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      return;
    }

    // Anti-spam honeypot check
    if (formData.website_url) {
      onSuccess();
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine endpoint path (compatible with both root / and /project-astitva/)
      const endpoint = window.location.pathname.startsWith('/project-astitva')
        ? '/project-astitva/api/community-signup'
        : '/api/community-signup';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          city: formData.city.trim(),
          consent: formData.consent,
          website_url: formData.website_url,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
      } else {
        setServerError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setServerError('Something went wrong. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <div className={styles.eyebrowWrapper}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          <span className={styles.eyebrow}>JOIN THE COMMUNITY</span>
        </div>
        <h2 id="community-modal-title" className={styles.title}>
          Join Our Community
        </h2>
        <p className={styles.subtitle}>
          Be part of a space that truly sees you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {/* Full Name */}
        <div className={styles.fieldGroup}>
          <label htmlFor="community-name" className={styles.label}>
            Full Name <span className={styles.requiredMark} aria-hidden="true">*</span>
          </label>
          <input
            id="community-name"
            name="name"
            type="text"
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            disabled={isSubmitting}
            autoFocus
          />
          {errors.name && (
            <span className={styles.errorText} role="alert">
              {errors.name}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div className={styles.fieldGroup}>
          <label htmlFor="community-phone" className={styles.label}>
            Phone Number <span className={styles.requiredMark} aria-hidden="true">*</span>
          </label>
          <input
            id="community-phone"
            name="phone"
            type="tel"
            className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            autoComplete="tel"
            disabled={isSubmitting}
          />
          {errors.phone && (
            <span className={styles.errorText} role="alert">
              {errors.phone}
            </span>
          )}
        </div>

        {/* City */}
        <div className={styles.fieldGroup}>
          <label htmlFor="community-city" className={styles.label}>
            City <span className={styles.requiredMark} aria-hidden="true">*</span>
          </label>
          <input
            id="community-city"
            name="city"
            type="text"
            className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
            autoComplete="address-level2"
            disabled={isSubmitting}
          />
          {errors.city && (
            <span className={styles.errorText} role="alert">
              {errors.city}
            </span>
          )}
        </div>

        {/* Anti-spam Honeypot (Hidden) */}
        <div className={styles.honeypotField} aria-hidden="true">
          <label htmlFor="community-website">Leave blank</label>
          <input
            id="community-website"
            name="website_url"
            type="text"
            value={formData.website_url}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Consent Checkbox */}
        <label className={styles.consentRow}>
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className={styles.checkboxInput}
            disabled={isSubmitting}
          />
          <span className={styles.consentLabel}>
            I agree to be contacted by Project Astitva regarding community updates.
          </span>
        </label>

        {/* Server Error Message */}
        {serverError && (
          <div className={styles.generalError} role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>SUBMITTING...</span>
            </>
          ) : (
            <>
              <span>JOIN THE COMMUNITY</span>
              <ArrowRight size={17} className={styles.arrowIcon} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
