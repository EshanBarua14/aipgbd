import React, { useState } from 'react';
import { FAQS } from '../data/content';
import { useInView } from '../hooks';
import './FAQ.css';

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  const [ref, inView] = useInView();

  return (
    <div
      ref={ref}
      className={`faq__item ${open ? 'faq__item--open' : ''} ${inView ? 'faq__item--visible' : ''}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
    >
      <button className="faq__q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="faq__icon">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="faq__a"><p>{a}</p></div>}
    </div>
  );
}

export default function FAQ() {
  const [ref, inView] = useInView();
  return (
    <section className="faq section-pad" id="faq">
      <div className="container">
        <div className={`reveal ${inView ? 'reveal--visible' : ''}`} ref={ref}>
          <div className="section-label">FAQ</div>
          <h2 className="section-title">Questions Answered.</h2>
        </div>
        <div className="faq__list">
          {FAQS.map((item, i) => (
            <FAQItem key={i} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
