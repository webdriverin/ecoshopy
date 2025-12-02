import React, { useState, useEffect } from 'react';
import FirebaseService from '../services/FirebaseService';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const result = await FirebaseService.getFAQs();
                setFaqs(result);
            } catch (error) {
                console.error("Error fetching FAQs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, []);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h1>

            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div key={faq.id} style={{
                        borderBottom: '1px solid var(--color-border)',
                        marginBottom: '1rem',
                        paddingBottom: '1rem'
                    }}>
                        <div
                            onClick={() => toggleFAQ(index)}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '1.1rem'
                            }}
                        >
                            <span>{faq.question}</span>
                            {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                        {openIndex === index && (
                            <div style={{ marginTop: '1rem', color: 'var(--color-text-light)', lineHeight: '1.6' }}>
                                {faq.answer || "No answer provided yet."}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
