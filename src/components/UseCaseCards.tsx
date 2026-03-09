import React from 'react';
import './UseCaseCards.css';

interface UseCase {
    title: string;
    description: string;
    image: string;
    tag?: string;
}

const useCases: UseCase[] = [
    {
        title: 'Mergers & Acquisitions',
        description: 'Close deals faster. Total control, zero leaks. The ultimate M&A cheat code.',
        image: '/mergers_acquisitions_use_case_1773070664663.png',
    },
    {
        title: 'Due Diligence',
        description: 'Accelerate due diligence by 10x. Smart VDRs that do the heavy lifting for you.',
        image: '/due_diligence_use_case_1773070715421.png',
    },
    {
        title: 'Fundraising',
        description: 'Pitch like a pro. Update live decks instantly and track investor engagement.',
        image: '/fundraising_use_case_1773070739819.png',
    },
    {
        title: 'Board Meetings',
        description: 'Run flawless board meetings. One-click access to everything your directors need to see.',
        image: '/board_meetings_use_case_1773070761900.png',
    },
    {
        title: 'Investor Relations',
        description: 'Wow your investors. Bank-grade security meets real-time engagement analytics.',
        image: '/investor_relations_use_case_1773070845969.png',
    },
    {
        title: 'Real Estate',
        description: 'Close properties in record time. Bulletproof disclosures and seamless digital signings.',
        image: '/real_estate_card.png',
    },
    {
        title: 'Finance',
        description: 'Fort Knox for your financials. Share sensitive data with absolute peace of mind.',
        image: '/finance_card.png',
    },
    {
        title: 'Venture Capital',
        description: 'Supercharge your VC portfolio. Effortless capital calls and secure LP updates.',
        image: '/vc_card.png',
    },
    {
        title: 'Startup',
        description: 'Scale fearlessly. Protect your startup\'s IP while moving at the speed of light.',
        image: '/startup_card.png',
    }
];

const UseCaseCards: React.FC = () => {
    return (
        <div className="use-case-section">
            <div className="use-case-marquee-wrapper">
                <div className="use-case-container marquee-content">
                    {[...useCases, ...useCases].map((useCase, index) => (
                        <div key={index} className="use-case-card">
                            <div className="use-case-image-wrapper">
                                <img src={useCase.image} alt={useCase.title} className="use-case-image" />
                            </div>
                            <div className="use-case-content">
                                <h3>{useCase.title}</h3>
                                <p>{useCase.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UseCaseCards;
