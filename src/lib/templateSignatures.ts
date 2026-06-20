import { setupDocumentESignature } from './esignature';
import { type Signer } from '../components/SignerManagement';
import { type SignatureField } from '../components/SignatureFieldEditor';

export interface PlacedField {
    type: string;
    x: number;       // percentage 0-100
    y: number;       // percentage 0-100
    width: number;   // percentage
    height: number;  // percentage
    signerId: string; // 'party_a' or 'party_b'
    page?: number;   // page number (1-indexed)
    value?: string;
    stampType?: string;
}

export interface TemplateSignersInput {
    documentId: string;
    pageCount: number;
    signatureY: number;
    partyAName?: string;
    partyAEmail?: string;
    partyBName?: string;
    partyBEmail?: string;
    customFields?: PlacedField[];
    // Template Engine 2.0 Dynamic Parameters
    signersList?: {
        id: string; // local ID or role ID
        name: string;
        email: string;
        order: number;
        color: string;
    }[];
    dynamicFields?: {
        type: string;
        x: number;       // percentage 0-100
        y: number;       // percentage 0-100
        width: number;   // percentage
        height: number;  // percentage
        signerId: string; // matching one of the IDs in signersList
        page?: number;   // page number (1-indexed)
        value?: string;
        stampType?: string;
    }[];
    workflowType?: 'sequential' | 'parallel';
}

export async function setupTemplateSignatures({
    documentId,
    pageCount,
    signatureY,
    partyAName,
    partyAEmail,
    partyBName,
    partyBEmail,
    customFields,
    signersList,
    dynamicFields,
    workflowType = 'parallel'
}: TemplateSignersInput) {
    let signers: Signer[];
    let fields: SignatureField[];

    // If dynamic signers list is supplied (Template Engine 2.0 path)
    if (signersList && signersList.length > 0) {
        signers = signersList.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            order: s.order,
            color: s.color
        }));

        if (dynamicFields && dynamicFields.length > 0) {
            fields = dynamicFields.map((df, idx) => ({
                id: `field_${df.type}_${idx}`,
                type: df.type as SignatureField['type'],
                page: df.page || pageCount,
                x: df.x,
                y: df.y,
                width: df.width,
                height: df.height,
                signerId: df.signerId,
                required: true,
                value: df.value,
                stampType: df.stampType
            }));
        } else {
            fields = [];
        }
    } else {
        // Fallback: Default 2-party signing logic (Template Engine 1.0 path)
        signers = [
            {
                id: 'party_a',
                name: partyAName || 'Initiator',
                email: partyAEmail || '',
                order: 1,
                color: '#4f46e5'
            },
            {
                id: 'party_b',
                name: partyBName || 'Recipient',
                email: partyBEmail || '',
                order: 2,
                color: '#ec4899'
            }
        ];

        if (customFields && customFields.length > 0) {
            // Use custom field placements from the drag-and-drop canvas
            fields = customFields.map((cf, idx) => ({
                id: `field_${cf.type}_${idx}`,
                type: cf.type as SignatureField['type'],
                page: cf.page || pageCount,
                x: cf.x,
                y: cf.y,
                width: cf.width,
                height: cf.height,
                signerId: cf.signerId,
                required: true,
                value: cf.value,
                stampType: cf.stampType
            }));
        } else {
            // Fallback: auto-calculate signature positions from PDF coordinates
            const a4Height = 841.89;
            const topPercent = Math.max(10, Math.min(90, ((a4Height - signatureY) / a4Height) * 100));
            const sigY = topPercent - 5.5;
            const dateY = topPercent + 1.5;

            fields = [
                // Party A Fields
                {
                    id: 'sig_a',
                    type: 'signature',
                    page: pageCount,
                    x: 8.4,
                    y: sigY,
                    width: 25,
                    height: 5,
                    signerId: 'party_a',
                    required: true
                },
                {
                    id: 'date_a',
                    type: 'date',
                    page: pageCount,
                    x: 8.4,
                    y: dateY,
                    width: 20,
                    height: 4,
                    signerId: 'party_a',
                    required: true
                },
                // Party B Fields
                {
                    id: 'sig_b',
                    type: 'signature',
                    page: pageCount,
                    x: 50.4,
                    y: sigY,
                    width: 25,
                    height: 5,
                    signerId: 'party_b',
                    required: true
                },
                {
                    id: 'date_b',
                    type: 'date',
                    page: pageCount,
                    x: 50.4,
                    y: dateY,
                    width: 20,
                    height: 4,
                    signerId: 'party_b',
                    required: true
                }
            ];
        }
    }

    // Setup e-signature workflow (parallel or sequential)
    return await setupDocumentESignature(documentId, signers, fields, workflowType);
}

