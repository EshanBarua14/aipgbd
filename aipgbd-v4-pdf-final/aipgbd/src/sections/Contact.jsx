import React from 'react';
import { useForm, useInView } from '../hooks';
import { SITE } from '../data/content';
import './Contact.css';

const BUDGETS = ['৳8,000 — The Spark', '৳25,000 — Brand Engine', '৳40,000 — Retainer', 'Custom budget'];
const NICHES_OPT = ['Real Estate', 'Fintech / Startup', 'Luxury E-commerce', 'F&B / Restaurant', 'SME Brand Launch', 'Other'];

export default function Contact() {
  const [ref, inView] = useInView();
  const { values, errors, status, setStatus, handleChange, validate } = useForm({
    name: '', email: '', phone: '', niche: '', budget: '', message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');

    // Simulated submission — replace with EmailJS or your backend
    // import emailjs from '@emailjs/browser';
    // await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', values, 'PUBLIC_KEY');
    setTimeout(() => setStatus('success'), 1500);
  };

  if (status === 'success') {
    return (
      <section className="contact section-pad" id="contact">
        <div className="container">
          <div className="contact__success">
            <div className="contact__success-icon">✓</div>
            <h3>Message received.</h3>
            <p>We'll review your brief and be in touch within 4 hours. Check your Facebook DMs too — we'll reach out there as well.</p>
            <a href={SITE.facebook} target="_blank" rel="noreferrer" className="btn-primary" style={{display:'inline-block',marginTop:'1.5rem'}}>
              Message us on Facebook
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="contact section-pad" id="contact">
      <div className="container">
        <div className={`reveal ${inView ? 'reveal--visible' : ''}`} ref={ref}>
          <div className="section-label">Start a Project</div>
          <h2 className="section-title">
            Your Brand Deserves <span style={{color:'var(--gold)'}}>Cinema.</span>
          </h2>
          <p className="contact__sub">
            Tell us about your brand. First 3 businesses this month get a complimentary cinematic product demo — no commitment required.
          </p>
        </div>

        <div className="contact__layout">
          <div className="contact__info">
            <div className="contact__info-item">
              <span className="contact__info-label">Response time</span>
              <span className="contact__info-val">Within 4 hours</span>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-label">Delivery</span>
              <span className="contact__info-val">48–72 hours</span>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-label">Payment</span>
              <span className="contact__info-val">bKash · Nagad · Bank</span>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-label">Facebook</span>
              <a href={SITE.facebook} target="_blank" rel="noreferrer" className="contact__info-link">
                @aipgbd ↗
              </a>
            </div>
            <div className="contact__info-item">
              <span className="contact__info-label">YouTube</span>
              <a href={SITE.youtube} target="_blank" rel="noreferrer" className="contact__info-link">
                @aipgbd ↗
              </a>
            </div>
            <div className="contact__guarantee">
              <div className="contact__guarantee-icon">⟳</div>
              <p>One free revision included in every package. 50% deposit to start, 50% on delivery.</p>
            </div>
          </div>

          <form className="contact__form" onSubmit={handleSubmit} noValidate>
            <div className="form-row form-row--2">
              <div className="form-group">
                <label className="form-label">Your name *</label>
                <input
                  className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                  type="text" name="name" placeholder="Rahim Chowdhury"
                  value={values.name} onChange={handleChange}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email address *</label>
                <input
                  className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                  type="email" name="email" placeholder="rahim@brand.com"
                  value={values.email} onChange={handleChange}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row form-row--2">
              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input
                  className="form-input" type="tel" name="phone"
                  placeholder="+880 1XXX XXXXXX"
                  value={values.phone} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Your sector</label>
                <select className="form-input" name="niche" value={values.niche} onChange={handleChange}>
                  <option value="">Select sector...</option>
                  {NICHES_OPT.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Package interest</label>
              <div className="form-radio-group">
                {BUDGETS.map(b => (
                  <label key={b} className={`form-radio ${values.budget === b ? 'form-radio--selected' : ''}`}>
                    <input type="radio" name="budget" value={b} checked={values.budget === b} onChange={handleChange} style={{display:'none'}} />
                    {b}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tell us about your project *</label>
              <textarea
                className={`form-input form-textarea ${errors.message ? 'form-input--error' : ''}`}
                name="message"
                placeholder="Describe your brand, what you're trying to achieve, and any specific ideas you have..."
                value={values.message} onChange={handleChange}
                rows={5}
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </div>

            <button type="submit" className="contact__submit" disabled={status === 'loading'}>
              {status === 'loading' ? (
                <span className="contact__spinner" />
              ) : 'Send Brief →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
