import React from 'react';

interface TemplateCoverProps {
    template: {
        id: string;
        name: string;
        category: string;
        categoryLabel: string;
    };
}

// Simple hash function to generate consistent styling for custom templates
const getHashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
};

export const TemplateCover: React.FC<TemplateCoverProps> = ({ template }) => {
    const { id, name, category } = template;

    // Helper for rendering custom/user-created templates dynamically
    const renderCustomCover = () => {
        const hash = getHashCode(id || name || 'custom');
        const themeIndex = hash % 5;

        // Theme definitions for custom templates
        const themes = [
            {
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#ffffff',
                titleColor: '#ffffff',
                subtextColor: 'rgba(255, 255, 255, 0.8)',
                decor: (
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        right: '-10%',
                        width: '140px',
                        height: '140px',
                        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(10px)'
                    }} />
                )
            },
            {
                background: '#0f172a',
                color: '#38bdf8',
                titleColor: '#ffffff',
                subtextColor: '#94a3b8',
                decor: (
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '80px',
                        background: 'repeating-linear-gradient(45deg, #1e293b, #1e293b 10px, #0f172a 10px, #0f172a 20px)',
                        borderTop: '2px solid #38bdf8'
                    }} />
                )
            },
            {
                background: '#f5efe6',
                color: '#be5a38',
                titleColor: '#2c1810',
                subtextColor: '#7c6a5c',
                decor: (
                    <div style={{
                        position: 'absolute',
                        bottom: '-20px',
                        right: '-20px',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: '#e4d3c2',
                        border: '2px dashed #be5a38'
                    }} />
                )
            },
            {
                background: '#4a5d4e',
                color: '#e2e8f0',
                titleColor: '#ffffff',
                subtextColor: '#c7d2fe',
                decor: (
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        right: '20px',
                        bottom: '20px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        pointerEvents: 'none'
                    }} />
                )
            },
            {
                background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
                color: '#ffffff',
                titleColor: '#ffffff',
                subtextColor: 'rgba(255, 255, 255, 0.85)',
                decor: (
                    <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '-30px',
                        width: '130px',
                        height: '130px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '50%'
                    }} />
                )
            }
        ];

        const activeTheme = themes[themeIndex];

        return (
            <div style={{
                position: 'relative',
                width: '100%',
                height: '180px',
                background: activeTheme.background,
                padding: '1.25rem',
                color: activeTheme.color,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                userSelect: 'none'
            }}>
                {activeTheme.decor}
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, marginBottom: '0.25rem' }}>
                        Custom Document Template
                    </div>
                    <h4 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: '800',
                        color: activeTheme.titleColor,
                        lineHeight: '1.2',
                        letterSpacing: '-0.02em',
                        fontFamily: 'system-ui, sans-serif'
                    }}>
                        {name}
                    </h4>
                </div>
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: activeTheme.subtextColor, borderTop: `1px solid ${activeTheme.color}30`, paddingTop: '0.5rem' }}>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>Created by:</div>
                        <div>[Sender.FirstName]</div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>Prepared for:</div>
                        <div>[Recipient.FirstName]</div>
                    </div>
                </div>
            </div>
        );
    };

    // Render design based on known Template IDs
    switch (id) {
        // -------------------------------------------------
        // 1. Job Offer Letter (HR) - Neon circles on grey
        // -------------------------------------------------
        case 'offer-letter':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#b5b7b9',
                    padding: '1.25rem',
                    color: '#000000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                }}>
                    {/* Neon yellow overlapping circles */}
                    <div style={{
                        position: 'absolute',
                        top: '-40px',
                        left: '10px',
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        background: '#d4fc02',
                        zIndex: 1
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-40px',
                        right: '-20px',
                        width: '160px',
                        height: '160px',
                        borderRadius: '50%',
                        background: '#d4fc02',
                        zIndex: 1
                    }} />
                    
                    {/* Modern geometric arrow outline */}
                    <div style={{
                        position: 'absolute',
                        right: '35px',
                        bottom: '45px',
                        zIndex: 2,
                        opacity: 0.8
                    }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 25L20 10L35 25" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20 10V35" stroke="#000000" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </div>

                    <div style={{ position: 'relative', zIndex: 3 }}>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.35rem',
                            fontWeight: '800',
                            color: '#000000',
                            lineHeight: '1.1',
                            letterSpacing: '-0.03em',
                            maxWidth: '180px'
                        }}>
                            Company Job Offer Letter
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', fontWeight: 600, color: 'rgba(0,0,0,0.6)' }}>
                        <div>
                            <div>Created by:</div>
                            <div style={{ color: '#000000' }}>[Sender.Company]</div>
                        </div>
                        <div>
                            <div>Prepared for:</div>
                            <div style={{ color: '#000000' }}>[Candidate.Name]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 2. Mutual NDA (HR) - Cyberpunk Neon Teal / Black
        // -------------------------------------------------
        case 'nda':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#0d0d12',
                    padding: '1.25rem',
                    color: '#0d9488',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'monospace'
                }}>
                    {/* Glowing Grid Background Lines */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(rgba(13,148,136,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,0.08) 1px, transparent 1px)',
                        backgroundSize: '15px 15px'
                    }} />
                    
                    {/* Tech Neon border accent */}
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        right: '10px',
                        bottom: '10px',
                        border: '1px solid rgba(13,148,136,0.25)',
                        pointerEvents: 'none'
                    }} />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ fontSize: '0.6rem', color: '#14b8a6', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                            SECURE CONTRACT
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.2rem',
                            fontWeight: '800',
                            color: '#ffffff',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em'
                        }}>
                            MUTUAL NDA AGREEMENT
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#94a3b8', borderTop: '1px solid rgba(13,148,136,0.3)', paddingTop: '0.4rem' }}>
                        <div>
                            <div>[PARTY_A_DISCLOSER]</div>
                        </div>
                        <div>
                            <div>[PARTY_B_RECIPIENT]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 3. W-4 Certificate (HR) - Forest green / Grid
        // -------------------------------------------------
        case 'w4-form':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#0f382a',
                    padding: '1.25rem',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'serif'
                }}>
                    {/* Double white border line representing formal certificate */}
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        right: '8px',
                        bottom: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '2px'
                    }}>
                        <div style={{ border: '1px solid rgba(255, 255, 255, 0.1)', height: '100%' }} />
                    </div>

                    {/* Government badge icon outline */}
                    <div style={{
                        position: 'absolute',
                        right: '15px',
                        top: '15px',
                        opacity: 0.15
                    }}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            <path d="M2 12h20" />
                        </svg>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, padding: '5px' }}>
                        <div style={{ fontSize: '0.6rem', color: '#c7d2fe', letterSpacing: '0.1em', fontFamily: 'sans-serif' }}>
                            INTERNAL REVENUE SERVICE
                        </div>
                        <h4 style={{
                            margin: '0.2rem 0 0 0',
                            fontSize: '1.4rem',
                            fontWeight: 'bold',
                            color: '#fef3c7',
                            lineHeight: '1.2'
                        }}>
                            Form W-4
                        </h4>
                        <div style={{ fontSize: '0.7rem', color: '#ffffff', opacity: 0.9, marginTop: '2px', fontFamily: 'sans-serif' }}>
                            Employee Withholding Certificate
                        </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#c7d2fe', padding: '5px' }}>
                        <div>
                            <div>Prepared for:</div>
                            <div style={{ color: '#ffffff' }}>[Employee.FullName]</div>
                        </div>
                        <div>
                            <div>IRS Status:</div>
                            <div style={{ color: '#ffffff' }}>Pending Sign</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 4. I-9 Eligibility Verification (HR) - Federal Navy / Red Banner
        // -------------------------------------------------
        case 'i9-form':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#f7f6f2',
                    padding: '1.25rem',
                    color: '#1e3a8a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'sans-serif'
                }}>
                    {/* Deep navy outline and thick borders */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        bottom: '0',
                        width: '8px',
                        background: '#1e3a8a'
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        bottom: '0',
                        width: '8px',
                        background: '#991b1b' // Red banner
                    }} />

                    <div style={{ position: 'relative', zIndex: 2, paddingLeft: '8px' }}>
                        <div style={{ display: 'inline-block', background: '#991b1b', color: 'white', fontSize: '0.5rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '3px', marginBottom: '0.35rem' }}>
                            U.S. CITIZENSHIP
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.3rem',
                            fontWeight: '900',
                            color: '#1e3a8a',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em'
                        }}>
                            Form I-9 Verification
                        </h4>
                        <div style={{ fontSize: '0.65rem', color: '#4b5563', marginTop: '2px' }}>
                            Employment Eligibility Certificate
                        </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#6b7280', paddingLeft: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '0.4rem' }}>
                        <div>
                            <div>Applicant:</div>
                            <div style={{ color: '#1e3a8a', fontWeight: 'bold' }}>[Employee.Name]</div>
                        </div>
                        <div>
                            <div>Authority:</div>
                            <div style={{ color: '#991b1b', fontWeight: 'bold' }}>USCIS Approved</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 5. LLC Operating Agreement (Legal) - Gold / Charcoal Black
        // -------------------------------------------------
        case 'llc-operating':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#151515',
                    padding: '1.25rem',
                    color: '#d97706', // gold
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: '"Georgia", serif'
                }}>
                    {/* Gold border strip */}
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        right: '12px',
                        bottom: '12px',
                        border: '1px solid #d97706',
                        opacity: 0.35
                    }} />

                    {/* Gold separator block */}
                    <div style={{
                        position: 'absolute',
                        right: '25px',
                        top: '0',
                        width: '3px',
                        height: '70px',
                        background: '#d97706'
                    }} />

                    <div style={{ position: 'relative', zIndex: 2, padding: '4px' }}>
                        <div style={{ fontSize: '0.55rem', color: '#d97706', letterSpacing: '0.15rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                            Operating Covenant
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.15rem',
                            fontWeight: 'normal',
                            color: '#ffffff',
                            lineHeight: '1.2',
                            letterSpacing: '0.02em'
                        }}>
                            LLC OPERATING AGREEMENT
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#a3a3a3', padding: '4px' }}>
                        <div>
                            <div>Entity:</div>
                            <div style={{ color: '#d97706', fontWeight: 'bold' }}>[LLC.Name]</div>
                        </div>
                        <div>
                            <div>Jurisdiction:</div>
                            <div style={{ color: '#ffffff' }}>[State of LLC]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 6. Sublease Agreement (Legal) - Terracotta / Arches
        // -------------------------------------------------
        case 'sublease':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#be5a38', // Terracotta
                    padding: '1.25rem',
                    color: '#f7eae2',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    {/* Modern arch design outline */}
                    <div style={{
                        position: 'absolute',
                        right: '-20px',
                        bottom: '-10px',
                        width: '130px',
                        height: '180px',
                        borderRadius: '65px 65px 0 0',
                        background: '#a74323',
                        opacity: 0.6,
                        zIndex: 1
                    }} />
                    <div style={{
                        position: 'absolute',
                        right: '10px',
                        bottom: '-10px',
                        width: '80px',
                        height: '120px',
                        borderRadius: '40px 40px 0 0',
                        background: '#d66e4a',
                        opacity: 0.5,
                        zIndex: 2
                    }} />

                    <div style={{ position: 'relative', zIndex: 3 }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.05em', opacity: 0.9, marginBottom: '0.2rem' }}>
                            RESIDENTIAL COVENANT
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.3rem',
                            fontWeight: '800',
                            color: '#ffffff',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em',
                            maxWidth: '180px'
                        }}>
                            Sublease Tenancy Agreement
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 3, display: 'flex', gap: '1.5rem', fontSize: '0.55rem', opacity: 0.85 }}>
                        <div>
                            <div>Primary Tenant:</div>
                            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>[Tenant.Name]</div>
                        </div>
                        <div>
                            <div>Subtenant:</div>
                            <div style={{ color: '#ffffff', fontWeight: 'bold' }}>[Subtenant.Name]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 7. Release of Liability (Legal) - Cautionary Orange / Stripes
        // -------------------------------------------------
        case 'liability-release':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#e08a1d', // caution orange
                    padding: '1.25rem',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'sans-serif'
                }}>
                    {/* Diagonal cautionary stripe overlay */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '120px',
                        height: '180px',
                        background: '#2d3748',
                        clipPath: 'polygon(100% 0, 40% 0, 0 100%, 100% 100%)',
                        opacity: 0.15,
                        zIndex: 1
                    }} />
                    
                    {/* Dark slate warning banner stripe at top */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        height: '14px',
                        background: '#1a202c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.45rem',
                        fontWeight: 900,
                        letterSpacing: '0.2rem',
                        color: '#e08a1d'
                    }}>
                        DISCLAIMER COVENANT
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, marginTop: '10px' }}>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.3rem',
                            fontWeight: '900',
                            color: '#1a202c',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em'
                        }}>
                            RELEASE OF LIABILITY
                        </h4>
                        <div style={{ fontSize: '0.65rem', color: '#1a202c', opacity: 0.8, marginTop: '2px', fontWeight: 600 }}>
                            Assumption of Risk Waiver
                        </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#ffffff', borderTop: '1px solid rgba(26,32,44,0.2)', paddingTop: '0.4rem' }}>
                        <div>
                            <span style={{ color: '#1a202c', fontWeight: 'bold' }}>Activity:</span> [Waiver.Activity]
                        </div>
                        <div>
                            <span style={{ color: '#1a202c', fontWeight: 'bold' }}>Releasor:</span> [Customer.Name]
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 8. Statement of Work (SOW) (Sales) - Blue Gradient & Peach Orb
        // -------------------------------------------------
        case 'sow':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(135deg, #7ba0ea 0%, #ab8fed 100%)',
                    padding: '1.25rem',
                    color: '#2a2254',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: '"Georgia", serif'
                }}>
                    {/* Glowing peach radial orb in center */}
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '25%',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(254, 215, 170, 0.95) 0%, rgba(254, 215, 170, 0) 70%)',
                        zIndex: 1
                    }} />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.35rem',
                            fontWeight: 'bold',
                            color: '#1a104c',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em',
                            maxWidth: '190px'
                        }}>
                            Statement of Work SOW
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', fontWeight: 600, color: 'rgba(26, 16, 76, 0.7)', fontFamily: 'sans-serif' }}>
                        <div>
                            <div>Prepared for:</div>
                            <div style={{ color: '#1a104c' }}>[Client.Company]</div>
                        </div>
                        <div>
                            <div>Created by:</div>
                            <div style={{ color: '#1a104c' }}>[Provider.Company]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 9. Purchase Order (Sales) - Blueprint Blueprint Grid
        // -------------------------------------------------
        case 'purchase-order':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#0b3ba7',
                    padding: '1.25rem',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'Courier New, monospace'
                }}>
                    {/* Grid lines */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                        backgroundSize: '12px 12px'
                    }} />

                    {/* Blueprint border */}
                    <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        right: '8px',
                        bottom: '8px',
                        border: '1px dashed rgba(255,255,255,0.3)',
                        pointerEvents: 'none'
                    }} />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ fontSize: '0.55rem', opacity: 0.7, letterSpacing: '0.1rem', marginBottom: '0.2rem' }}>
                            ORDER SCHEMATIC
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            lineHeight: '1.1'
                        }}>
                            PURCHASE ORDER
                        </h4>
                        <div style={{ fontSize: '0.6rem', color: '#93c5fd', marginTop: '2px' }}>
                            Ref: #[PO_NUMBER_STAMP]
                        </div>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, fontSize: '0.55rem', color: '#93c5fd', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                            <div>VENDOR:</div>
                            <div style={{ color: '#ffffff' }}>[Vendor.Company]</div>
                        </div>
                        <div>
                            <div>BILL TO:</div>
                            <div style={{ color: '#ffffff' }}>[Billing.Address]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 10. Sales Contract (Sales) - Emerald Green / Silver
        // -------------------------------------------------
        case 'sales-contract':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                    padding: '1.25rem',
                    color: '#a7f3d0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    {/* Metallic Silver accents */}
                    <div style={{
                        position: 'absolute',
                        top: '-30px',
                        left: '-20px',
                        width: '60px',
                        height: '240px',
                        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)',
                        transform: 'rotate(25deg)',
                        zIndex: 1
                    }} />

                    <div style={{
                        position: 'absolute',
                        right: '15px',
                        top: '15px',
                        width: '35px',
                        height: '35px',
                        borderRadius: '50%',
                        border: '2px solid rgba(167, 243, 208, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(167, 243, 208, 0.4)',
                        fontSize: '0.5rem',
                        fontWeight: 'bold',
                        zIndex: 2
                    }}>
                        $
                    </div>

                    <div style={{ position: 'relative', zIndex: 3 }}>
                        <div style={{ fontSize: '0.6rem', color: '#34d399', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                            COMMERCIAL TRANSACTION
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.3rem',
                            fontWeight: '800',
                            color: '#ffffff',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em'
                        }}>
                            Contract for Sale of Goods
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#a7f3d0' }}>
                        <div>
                            <div>Seller: [Seller.Name]</div>
                        </div>
                        <div>
                            <div>Buyer: [Buyer.Name]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 11. Independent Contractor Agreement (HR) - Sunset Mesh
        // -------------------------------------------------
        case 'contractor-agreement':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
                    padding: '1.25rem',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    {/* Floating SVGs waves / liquid blobs */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '-20px',
                        width: '140px',
                        height: '100px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '40% 60% 50% 50% / 40% 40% 60% 60%',
                        transform: 'rotate(-10deg)',
                        zIndex: 1
                    }} />

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.85, marginBottom: '0.25rem' }}>
                            FREELANCE COVENANT
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: '800',
                            color: '#ffffff',
                            lineHeight: '1.2',
                            letterSpacing: '-0.02em'
                        }}>
                            Independent Contractor Agreement
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: 'rgba(255,255,255,0.85)', borderTop: '1px solid rgba(255,255,255,0.25)', paddingTop: '0.4rem' }}>
                        <div>
                            <div>Client: [Company.Name]</div>
                        </div>
                        <div>
                            <div>Contractor: [Contractor.Name]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 12. Consulting / Service Agreement (Sales) - Glassmorphism
        // -------------------------------------------------
        case 'consulting-agreement':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                    padding: '1.25rem',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    {/* Bright neon background glows */}
                    <div style={{
                        position: 'absolute',
                        top: '10%',
                        left: '40%',
                        width: '100px',
                        height: '100px',
                        background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
                        opacity: 0.35,
                        zIndex: 1
                    }} />

                    {/* Floating frosted card */}
                    <div style={{
                        position: 'absolute',
                        inset: '20px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(6px)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '12px',
                        zIndex: 2,
                        pointerEvents: 'none'
                    }} />

                    <div style={{ position: 'relative', zIndex: 3, padding: '0.5rem' }}>
                        <div style={{ fontSize: '0.55rem', color: '#c7d2fe', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                            Services Compact
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.15rem',
                            fontWeight: '800',
                            color: '#ffffff',
                            lineHeight: '1.2',
                            letterSpacing: '-0.01em'
                        }}>
                            Consulting Agreement
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#a5b4fc', padding: '0 0.5rem 0.25rem 0.5rem' }}>
                        <div>
                            <div>Client: [Client.Company]</div>
                        </div>
                        <div>
                            <div>Consultant: [Agency.Name]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 13. Residential Lease Agreement (Legal) - Olive Scandinavian
        // -------------------------------------------------
        case 'residential-lease':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#606c5a', // Olive Sage Green
                    padding: '1.25rem',
                    color: '#f4f1ea',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'system-ui, sans-serif'
                }}>
                    {/* Minimalist house outline drawing in background */}
                    <div style={{
                        position: 'absolute',
                        right: '20px',
                        bottom: '25px',
                        opacity: 0.15,
                        zIndex: 1
                    }}>
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#f4f1ea" strokeWidth="2">
                            <path d="M10 50L50 15L90 50V90H10V50Z" />
                            <path d="M40 90V60H60V90" />
                        </svg>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.1rem', opacity: 0.8, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                            LANDLORD & TENANT COVENANT
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            lineHeight: '1.1',
                            letterSpacing: '-0.02em',
                            maxWidth: '180px'
                        }}>
                            Residential Lease Agreement
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', opacity: 0.8 }}>
                        <div>
                            <div>Landlord: [Lessor.Name]</div>
                        </div>
                        <div>
                            <div>Tenant: [Lessee.Name]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 14. Professional Invoice (Sales) - Monochrome Checkerboard / Cyan
        // -------------------------------------------------
        case 'invoice':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#ffffff',
                    padding: '1.25rem',
                    color: '#000000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: 'system-ui, sans-serif',
                    borderBottom: '4px solid #06b6d4' // Cyan accent line
                }}>
                    {/* Checkerboard strip at top */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '10px',
                        backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)',
                        backgroundSize: '10px 10px',
                        backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
                        opacity: 0.75
                    }} />

                    <div style={{ position: 'relative', zIndex: 2, marginTop: '10px' }}>
                        <div style={{ fontSize: '0.55rem', color: '#06b6d4', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                            BILLING ACCOUNT
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.4rem',
                            fontWeight: '900',
                            color: '#111827',
                            lineHeight: '1.1',
                            letterSpacing: '-0.03em'
                        }}>
                            PROFESSIONAL INVOICE
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#4b5563', borderTop: '1px solid #e5e7eb', paddingTop: '0.4rem' }}>
                        <div>
                            <div>Billed to:</div>
                            <div style={{ color: '#111827', fontWeight: 'bold' }}>[Client.Name]</div>
                        </div>
                        <div>
                            <div>Invoice ID:</div>
                            <div style={{ color: '#06b6d4', fontWeight: 'bold' }}>#INV-2026-001</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // 15. Employment Contract (Full-Time) (HR) - Royal Blue / Ivory
        // -------------------------------------------------
        case 'employment-contract':
            return (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '180px',
                    background: '#fcfbf7', // Ivory
                    padding: '1.25rem',
                    color: '#1e3a8a',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    userSelect: 'none',
                    fontFamily: '"Georgia", serif',
                    borderLeft: '5px solid #1e3a8a' // Royal blue accent vertical bar
                }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ fontSize: '0.55rem', color: '#1e3a8a', letterSpacing: '0.1em', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '0.25rem', fontFamily: 'sans-serif' }}>
                            FULL-TIME AGREEMENT
                        </div>
                        <h4 style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: '#111827',
                            lineHeight: '1.2',
                            letterSpacing: '-0.01em'
                        }}>
                            Employment Agreement Contract
                        </h4>
                    </div>

                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: '#4b5563', borderTop: '2px double #e5e7eb', paddingTop: '0.4rem', fontFamily: 'sans-serif' }}>
                        <div>
                            <div>Employer:</div>
                            <div style={{ color: '#111827', fontWeight: 'bold' }}>[Company.Name]</div>
                        </div>
                        <div>
                            <div>Employee:</div>
                            <div style={{ color: '#111827', fontWeight: 'bold' }}>[Employee.Name]</div>
                        </div>
                    </div>
                </div>
            );

        // -------------------------------------------------
        // Default / Custom User-Defined templates
        // -------------------------------------------------
        default:
            return renderCustomCover();
    }
};

export default TemplateCover;
