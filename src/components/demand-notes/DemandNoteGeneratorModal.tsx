import React, { useState } from 'react';
import {
    STANDARD_RERA_MILESTONES,
    calculateDemandNoteAmounts,
    generateDemandNotePdf
} from '../../lib/demandNoteGenerator';
import type {
    MilestoneDemandConfig,
    DemandNoteParams
} from '../../lib/demandNoteGenerator';
import { X, Building2, Download, CheckCircle2, ShieldCheck, FileText, Calendar, QrCode } from 'lucide-react';

interface DemandNoteGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectName?: string;
    unitNumber?: string;
    allotteeName?: string;
    reraNumber?: string;
    totalConsideration?: number;
    developerName?: string;
    escrowAccount?: string;
}

export const DemandNoteGeneratorModal: React.FC<DemandNoteGeneratorModalProps> = ({
    isOpen,
    onClose,
    projectName = 'Prestige Falcon City - Phase 2',
    unitNumber = 'Tower B, Flat 1404 (3BHK)',
    allotteeName = 'Rahul & Priya Sharma',
    reraNumber = 'PRM/KA/RERA/1251/310/PR/170915/000234',
    totalConsideration = 16500000,
    developerName = 'Prestige Estates Projects Ltd',
    escrowAccount = 'SBI RERA Escrow A/C #39882100912 (IFSC: SBIN0004132)'
}) => {
    const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>(STANDARD_RERA_MILESTONES[2].milestoneId); // Default to Plinth Level
    const [dueDate, setDueDate] = useState<string>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 15);
        return d.toLocaleDateString('en-IN');
    });
    const [isExporting, setIsExporting] = useState(false);
    const [successToast, setSuccessToast] = useState(false);

    if (!isOpen) return null;

    const selectedMilestone: MilestoneDemandConfig = STANDARD_RERA_MILESTONES.find(m => m.milestoneId === selectedMilestoneId) || STANDARD_RERA_MILESTONES[0];
    const calc = calculateDemandNoteAmounts(totalConsideration, selectedMilestone.percentageOfCost, 5);

    const handleGeneratePdf = async () => {
        setIsExporting(true);
        try {
            const params: DemandNoteParams = {
                projectName,
                unitNumber,
                reraNumber,
                developerName,
                allotteeName,
                totalConsideration,
                milestone: selectedMilestone,
                dueDate,
                escrowAccount
            };

            const pdfBytes = await generateDemandNotePdf(params);
            const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `DemandNote_${selectedMilestone.milestoneId}_${unitNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setSuccessToast(true);
        } catch (err) {
            console.error('Failed to generate Demand Note:', err);
            alert('Error generating Demand Note PDF.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '700px',
                maxHeight: '92vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #e2e8f0'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                    color: 'white',
                    borderRadius: '20px 20px 0 0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px' }}>
                            <Building2 size={24} color="#a7f3d0" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                                RERA Construction Milestone Demand Note
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: '#a7f3d0', margin: '0.2rem 0 0 0' }}>
                                Architect Form 1 Certified Payment Dispatch Desk
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{ background: 'transparent', border: 'none', color: '#a7f3d0', cursor: 'pointer', padding: '4px' }}
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Form Body */}
                <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {successToast && (
                        <div style={{ padding: '0.75rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', color: '#065f46', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={16} color="#059669" /> Demand note PDF generated and ready for banking disbursement!
                        </div>
                    )}

                    {/* Milestone Selector */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                            Select Achieved Construction Milestone
                        </label>
                        <select
                            value={selectedMilestoneId}
                            onChange={(e) => setSelectedMilestoneId(e.target.value)}
                            style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', fontWeight: 700, color: '#0f172a' }}
                        >
                            {STANDARD_RERA_MILESTONES.map(m => (
                                <option key={m.milestoneId} value={m.milestoneId}>
                                    {m.milestoneName} ({m.percentageOfCost}% of Cost)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Milestone Audit Info Box */}
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Architect Certificate:</span>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedMilestone.architectCertRef}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#64748b' }}>Structural Engineer Cert:</span>
                            <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedMilestone.engineerCertRef}</span>
                        </div>
                    </div>

                    {/* Due Date & Escrow */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Payment Due Date
                            </label>
                            <input
                                type="text"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.9rem', outline: 'none', fontWeight: 600 }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                                Designated RERA Project Escrow
                            </label>
                            <input
                                type="text"
                                readOnly
                                value={escrowAccount}
                                style={{ width: '100%', padding: '0.65rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '0.78rem', outline: 'none', background: '#f1f5f9', fontWeight: 700, color: '#047857' }}
                            />
                        </div>
                    </div>

                    {/* Payment Dues Breakdown */}
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#065f46' }}>Milestone Base Due ({selectedMilestone.percentageOfCost}% of ₹{totalConsideration.toLocaleString('en-IN')})</span>
                            <span style={{ fontWeight: 700, color: '#065f46' }}>₹{calc.milestoneBaseAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#065f46' }}>Real Estate GST (5% Under RERA Rules)</span>
                            <span style={{ fontWeight: 700, color: '#065f46' }}>₹{calc.gstAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ borderTop: '1.5px dashed #a7f3d0', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#064e3b' }}>Total Payable Amount:</span>
                            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#047857' }}>₹{calc.totalPayable.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    {/* Action */}
                    <button
                        type="button"
                        onClick={handleGeneratePdf}
                        disabled={isExporting}
                        style={{
                            padding: '0.85rem',
                            background: '#047857',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(4, 120, 87, 0.25)'
                        }}
                    >
                        <FileText size={18} /> {isExporting ? 'Exporting Demand Note...' : 'Export Formal RERA Demand Note (PDF)'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DemandNoteGeneratorModal;
