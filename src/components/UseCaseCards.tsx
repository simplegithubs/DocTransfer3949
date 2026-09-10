import React from 'react';
import { Link } from 'react-router-dom';
import './UseCaseCards.css';

interface UseCase {
    title: string;
    description: string;
    image: string;
    tag?: string;
    link?: string;
}

const useCases: UseCase[] = [
    {
        title: 'Mergers & Acquisitions',
        description: 'Close deals faster. Total control, zero leaks. The ultimate M&A cheat code.',
        image: '/mergers_acquisitions_use_case_1773070664663.png',
        link: '/solutions/mergers-acquisitions'
    },
    {
        title: 'Due Diligence',
        description: 'Accelerate due diligence by 10x. Smart VDRs that do the heavy lifting for you.',
        image: '/due_diligence_use_case_1773070715421.png',
        link: '/solutions/mergers-acquisitions'
    },
    {
        title: 'Fundraising',
        description: 'Pitch like a pro. Update live decks instantly and track investor engagement.',
        image: '/fundraising_use_case_1773070739819.png',
        link: '/solutions/fundraising'
    },
    {
        title: 'Board Meetings',
        description: 'Run flawless board meetings. One-click access to everything your directors need to see.',
        image: '/board_meetings_use_case_1773070761900.png',
        link: '/solutions/board-management'
    },
    {
        title: 'Investor Relations',
        description: 'Wow your investors. Bank-grade security meets real-time engagement analytics.',
        image: '/investor_relations_use_case_1773070845969.png',
        link: '/solutions/investor-relations'
    },
    {
        title: 'Real Estate & PropTech',
        description: 'Stop rate leaks, track WhatsApp brochures, and run RERA-compliant title diligence rooms.',
        image: '/real_estate_card.png',
        tag: '🇮🇳 India PropTech',
        link: '/solutions/indian-real-estate'
    },
    {
        title: 'Finance',
        description: 'Fort Knox for your financials. Share sensitive data with absolute peace of mind.',
        image: '/finance_card.png',
        link: '/solutions/finance'
    },
    {
        title: 'Venture Capital',
        description: 'Supercharge your VC portfolio. Effortless capital calls and secure LP updates.',
        image: '/vc_card.png',
        link: '/solutions/fundraising'
    },
    {
        title: 'Startup',
        description: 'Scale fearlessly. Protect your startup\'s IP while moving at the speed of light.',
        image: '/startup_card.png',
        link: '/solutions/startups'
    }
];

const UseCaseCards: React.FC = () => {
    return (
        <div className="use-case-section">
            <div className="use-case-marquee-wrapper">
                <div className="use-case-container marquee-content">
                    {[...useCases, ...useCases].map((useCase, index) => {
                        const CardContent = (
                            <div className="use-case-card" style={{ position: 'relative' }}>
                                {useCase.tag && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: '#ecfdf5',
                                        color: '#047857',
                                        border: '1px solid #a7f3d0',
                                        padding: '0.2rem 0.55rem',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        zIndex: 3
                                    }}>
                                        {useCase.tag}
                                    </span>
                                )}
                                <div className="use-case-image-wrapper">
                                    <img src={useCase.image} alt={useCase.title} className="use-case-image" />
                                </div>
                                <div className="use-case-content">
                                    <h3>{useCase.title}</h3>
                                    <p>{useCase.description}</p>
                                </div>
                            </div>
                        );

                        if (useCase.link) {
                            return (
                                <Link key={index} to={useCase.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {CardContent}
                                </Link>
                            );
                        }

                        return <div key={index}>{CardContent}</div>;
                    })}
                </div>
            </div>
        </div>
    );
};

export default UseCaseCards;
