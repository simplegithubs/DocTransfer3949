import { PDFDocument, rgb, StandardFonts, PageSizes } from 'pdf-lib';
import type { DocumentSection } from '../components/templates/templateData';

function sanitizeText(str: string): string {
    if (!str) return '';
    return str
        .replace(/[\u201c\u201d]/g, '"') // Curly double quotes
        .replace(/[\u2018\u2019]/g, "'") // Curly single quotes
        .replace(/[\u2013\u2014]/g, '-') // En/em dashes
        .replace(/\u2026/g, '...')       // Ellipsis
        .replace(/\xa0/g, ' ')           // Non-breaking space
        .replace(/[^\x00-\x7F]/g, (char) => {
            const accents = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ';
            const ascii   = 'AAAAAAACEEEEIIIIDNOOOOOOUUUUYbsaaaaaaaceeeeiiiidnoooooouuuuyby';
            const index = accents.indexOf(char);
            return index !== -1 ? ascii[index] : '';
        });
}

// Helper to wrap text according to width
function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    const sanitized = sanitizeText(text);
    const rawLines = sanitized.replace(/\r/g, '').split('\n');
    const wrappedLines: string[] = [];

    for (const rawLine of rawLines) {
        const words = rawLine.split(' ');
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);

            if (testWidth > maxWidth) {
                wrappedLines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            wrappedLines.push(currentLine);
        } else if (rawLines.length > 1) {
            // Preserve blank lines
            wrappedLines.push('');
        }
    }
    return wrappedLines;
}

export async function generatePdfFromTemplate(
    title: string,
    sections: DocumentSection[]
): Promise<{ pdfBytes: Uint8Array; pageCount: number; signatureY: number }> {
    const pdfDoc = await PDFDocument.create();
    
    // Page setup properties
    const pageSize = PageSizes.A4;
    let page = pdfDoc.addPage(pageSize);
    let { width, height } = page.getSize();
    
    // Embed fonts
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    // Margins and layouts
    const margin = 50;
    const contentWidth = width - (margin * 2);
    let y = height - margin;
    let finalSignatureY = 150; // default fallback

    // Header/Footer helper
    const drawPageNumber = (pageObj: any, pageNum: number, totalPages: number) => {
        pageObj.drawText(`Page ${pageNum} of ${totalPages}`, {
            x: width - 100,
            y: 30,
            size: 8,
            font: helvetica,
            color: rgb(0.5, 0.5, 0.5)
        });
        pageObj.drawText('DocTransfer Secure Document', {
            x: margin,
            y: 30,
            size: 8,
            font: helvetica,
            color: rgb(0.5, 0.5, 0.5)
        });
    };

    const checkPageBreak = (neededHeight: number) => {
        if (y - neededHeight < margin + 40) {
            page = pdfDoc.addPage(pageSize);
            y = height - margin;
            return true;
        }
        return false;
    };

    // Main drawing loop
    for (const section of sections) {
        switch (section.type) {
            case 'title': {
                checkPageBreak(40);
                const titleText = sanitizeText((section.text || '').replace(/\r?\n/g, ' '));
                const titleSize = 20;
                const textWidth = helveticaBold.widthOfTextAtSize(titleText, titleSize);
                
                page.drawText(titleText, {
                    x: (width - textWidth) / 2,
                    y: y - 10,
                    size: titleSize,
                    font: helveticaBold,
                    color: rgb(0.05, 0.05, 0.05)
                });
                y -= 40;
                break;
            }
            case 'subtitle': {
                checkPageBreak(30);
                const subtitleText = sanitizeText((section.text || '').replace(/\r?\n/g, ' '));
                const subSize = 10;
                const textWidth = helvetica.widthOfTextAtSize(subtitleText, subSize);
                
                page.drawText(subtitleText, {
                    x: (width - textWidth) / 2,
                    y: y,
                    size: subSize,
                    font: helvetica,
                    color: rgb(0.4, 0.4, 0.4)
                });
                y -= 25;
                break;
            }
            case 'header': {
                checkPageBreak(30);
                const headerText = sanitizeText((section.text || '').replace(/\r?\n/g, ' '));
                page.drawText(headerText, {
                    x: margin,
                    y: y,
                    size: 11,
                    font: timesRomanBold,
                    color: rgb(0.1, 0.1, 0.1)
                });
                y -= 18;
                break;
            }
            case 'paragraph': {
                const text = section.text || '';
                const lines = wrapText(text, contentWidth, timesRoman, 10);
                
                for (const line of lines) {
                    checkPageBreak(15);
                    page.drawText(line, {
                        x: margin,
                        y: y,
                        size: 9.5,
                        font: timesRoman,
                        color: rgb(0.15, 0.15, 0.15)
                    });
                    y -= 14;
                }
                y -= 6; // Spacing after paragraph
                break;
            }
            case 'bullet': {
                const items = section.items || [];
                for (const item of items) {
                    const lines = wrapText(item, contentWidth - 15, timesRoman, 10);
                    let isFirstLine = true;
                    
                    for (const line of lines) {
                        checkPageBreak(15);
                        page.drawText(isFirstLine ? '• ' : '  ', {
                            x: margin,
                            y: y,
                            size: 9.5,
                            font: timesRomanBold,
                            color: rgb(0.15, 0.15, 0.15)
                        });
                        page.drawText(line, {
                            x: margin + 12,
                            y: y,
                            size: 9.5,
                            font: timesRoman,
                            color: rgb(0.15, 0.15, 0.15)
                        });
                        isFirstLine = false;
                        y -= 14;
                    }
                }
                y -= 6;
                break;
            }
            case 'table': {
                const headers = section.headers || [];
                const rows = section.rows || [];
                if (headers.length === 0) break;
                
                const colWidth = contentWidth / headers.length;
                const rowHeight = 22;
                
                // Draw headers
                checkPageBreak(rowHeight + 10);
                
                page.drawRectangle({
                    x: margin,
                    y: y - 16,
                    width: contentWidth,
                    height: rowHeight,
                    color: rgb(0.96, 0.96, 0.98),
                    borderColor: rgb(0.85, 0.85, 0.88),
                    borderWidth: 0.5
                });
                
                 headers.forEach((hdr, idx) => {
                    page.drawText(sanitizeText((hdr || '').replace(/\r?\n/g, ' ')), {
                        x: margin + (idx * colWidth) + 8,
                        y: y - 10,
                        size: 9,
                        font: helveticaBold,
                        color: rgb(0.2, 0.2, 0.25)
                    });
                });
                y -= rowHeight;
                
                // Draw rows
                for (const row of rows) {
                    checkPageBreak(rowHeight);
                    
                    const isTotalRow = row[0] === 'Total Balance' || row[0] === 'Total Project Cost';
                    
                    page.drawRectangle({
                        x: margin,
                        y: y - 16,
                        width: contentWidth,
                        height: rowHeight,
                        color: isTotalRow ? rgb(0.95, 0.95, 1.0) : rgb(1, 1, 1),
                        borderColor: rgb(0.88, 0.88, 0.9),
                        borderWidth: 0.5
                    });
                    
                    row.forEach((cell, idx) => {
                        page.drawText(sanitizeText((cell || '').replace(/\r?\n/g, ' ')), {
                            x: margin + (idx * colWidth) + 8,
                            y: y - 10,
                            size: 9,
                            font: isTotalRow ? helveticaBold : helvetica,
                            color: isTotalRow ? rgb(0.1, 0.1, 0.3) : rgb(0.2, 0.2, 0.2)
                        });
                    });
                    y -= rowHeight;
                }
                y -= 10; // Extra spacing after table
                break;
            }
            case 'signature-block': {
                // Keep signature blocks on same page if possible
                checkPageBreak(120);
                
                y -= 20;
                finalSignatureY = y - 35; // This is the level of signature line
                
                // Draw Signature Line 1
                page.drawText('Party A / Initiator Signature:', {
                    x: margin,
                    y: y,
                    size: 9,
                    font: helveticaBold,
                    color: rgb(0.3, 0.3, 0.3)
                });
                page.drawLine({
                    start: { x: margin, y: y - 35 },
                    end: { x: margin + 200, y: y - 35 },
                    thickness: 0.5,
                    color: rgb(0.6, 0.6, 0.6)
                });
                page.drawText('Date:', {
                    x: margin,
                    y: y - 50,
                    size: 9,
                    font: helvetica,
                    color: rgb(0.4, 0.4, 0.4)
                });
                
                // Draw Signature Line 2
                page.drawText('Party B / Recipient Signature:', {
                    x: margin + 250,
                    y: y,
                    size: 9,
                    font: helveticaBold,
                    color: rgb(0.3, 0.3, 0.3)
                });
                page.drawLine({
                    start: { x: margin + 250, y: y - 35 },
                    end: { x: margin + 450, y: y - 35 },
                    thickness: 0.5,
                    color: rgb(0.6, 0.6, 0.6)
                });
                page.drawText('Date:', {
                    x: margin + 250,
                    y: y - 50,
                    size: 9,
                    font: helvetica,
                    color: rgb(0.4, 0.4, 0.4)
                });
                
                y -= 70;
                break;
            }
        }
    }

    // Apply page numbers to all pages
    const pages = pdfDoc.getPages();
    pages.forEach((p, idx) => {
        drawPageNumber(p, idx + 1, pages.length);
    });

    const pdfBytes = await pdfDoc.save();
    return {
        pdfBytes,
        pageCount: pages.length,
        signatureY: finalSignatureY
    };
}
