import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

/**
 * Dynamic Watermark Generator
 * Creates and applies watermarks to protected documents
 */

export interface WatermarkConfig {
    text: string;
    opacity: number;
    fontSize: number;
    color: string;
    rotation: number;
    layout: 'single' | 'tiled';
}

/**
 * Helper to convert hex color to RGB (0-1)
 */
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
}

/**
 * Replace placeholders in watermark text
 */
function getDynamicText(text: string, viewerInfo: { email?: string; ip?: string; date?: string }) {
    let dynamicText = text;
    dynamicText = dynamicText.replace('{{email}}', viewerInfo.email || 'Anonymous');
    dynamicText = dynamicText.replace('{{ip}}', viewerInfo.ip || 'Unknown IP');
    dynamicText = dynamicText.replace('{{date}}', viewerInfo.date || new Date().toLocaleString());
    return dynamicText;
}

/**
 * Apply a dynamic watermark to a PDF document using pdf-lib
 */
export async function applyPdfWatermark(
    pdfBuffer: ArrayBuffer,
    config: WatermarkConfig,
    viewerInfo: { email?: string; ip?: string; date?: string }
): Promise<Uint8Array> {
    try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const pages = pdfDoc.getPages();
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const dynamicText = getDynamicText(config.text, viewerInfo);
        const color = hexToRgb(config.color);

        for (const page of pages) {
            const { width, height } = page.getSize();
            
            if (config.layout === 'single') {
                page.drawText(dynamicText, {
                    x: width / 2 - (dynamicText.length * config.fontSize * 0.3),
                    y: height / 2,
                    size: config.fontSize,
                    font: font,
                    color: rgb(color.r, color.g, color.b),
                    opacity: config.opacity,
                    rotate: degrees(config.rotation),
                });
            } else {
                // Tiled layout
                const spacingX = 250;
                const spacingY = 200;
                
                for (let x = 50; x < width + spacingX; x += spacingX) {
                    for (let y = 50; y < height + spacingY; y += spacingY) {
                        page.drawText(dynamicText, {
                            x: x,
                            y: y,
                            size: config.fontSize,
                            font: font,
                            color: rgb(color.r, color.g, color.b),
                            opacity: config.opacity,
                            rotate: degrees(config.rotation),
                        });
                    }
                }
            }
        }

        return await pdfDoc.save();
    } catch (error) {
        console.error('Error applying PDF watermark:', error);
        return new Uint8Array(pdfBuffer);
    }
}

/**
 * Apply a dynamic watermark to an image using Canvas
 */
export async function applyImageWatermark(
    imageBlob: Blob,
    config: WatermarkConfig,
    viewerInfo: { email?: string; ip?: string; date?: string }
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(imageBlob);
        
        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Setup watermark
            const dynamicText = getDynamicText(config.text, viewerInfo);
            ctx.font = `${config.fontSize}px Arial`;
            ctx.fillStyle = config.color;
            ctx.globalAlpha = config.opacity;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (config.layout === 'single') {
                ctx.save();
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((config.rotation * Math.PI) / 180);
                ctx.fillText(dynamicText, 0, 0);
                ctx.restore();
            } else {
                // Tiled layout
                const spacingX = 300;
                const spacingY = 200;
                
                for (let x = -spacingX; x < canvas.width + spacingX; x += spacingX) {
                    for (let y = -spacingY; y < canvas.height + spacingY; y += spacingY) {
                        ctx.save();
                        ctx.translate(x, y);
                        ctx.rotate((config.rotation * Math.PI) / 180);
                        ctx.fillText(dynamicText, 0, 0);
                        ctx.restore();
                    }
                }
            }

            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas toBlob failed'));
            }, imageBlob.type);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

/**
 * Apply a dynamic watermark to a container element
 */
export function applyWatermark(
    containerId: string,
    config: any // Reverting to any to avoid breakage if other parts of the app use old config
): void {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Watermark container not found:', containerId);
        return;
    }

    // Remove existing watermark if any
    const existing = container.querySelector('.drm-watermark');
    if (existing) {
        existing.remove();
    }

    // Create watermark overlay
    const watermarkDiv = document.createElement('div');
    watermarkDiv.className = 'drm-watermark';

    const opacity = config.opacity ?? 0.3;
    const fontSize = config.fontSize ?? 20;
    const color = config.color ?? '#000000';
    const rotation = config.rotation ?? -45;

    // Base styles
    watermarkDiv.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        overflow: hidden;
        user-select: none;
        -webkit-user-select: none;
    `;

    // Create watermark pattern based on position
    const text = config.text || 'CONFIDENTIAL';
    createDiagonalWatermark(watermarkDiv, text, opacity, fontSize, color, rotation);

    container.style.position = 'relative';
    container.appendChild(watermarkDiv);
}

/**
 * Create diagonal repeating watermark
 */
function createDiagonalWatermark(
    element: HTMLElement,
    text: string,
    opacity: number,
    fontSize: number,
    color: string,
    rotation: number
): void {
    // Create canvas for pattern
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Rotate and draw text
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.fillText(text, 0, 0);

    // Apply as repeating background
    element.style.backgroundImage = `url(${canvas.toDataURL()})`;
    element.style.backgroundRepeat = 'repeat';
}

/**
 * Remove watermark from container
 */
export function removeWatermark(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const watermark = container.querySelector('.drm-watermark');
    if (watermark) {
        watermark.remove();
    }
}

/**
 * Generate watermark text with session info
 */
export function generateWatermarkText(options: {
    ip?: string;
    timestamp?: Date;
    sessionId?: string;
    customText?: string;
}): string {
    if (options.customText) {
        return options.customText;
    }

    const parts: string[] = [];

    if (options.ip) {
        parts.push(`IP: ${options.ip}`);
    }

    if (options.timestamp) {
        parts.push(options.timestamp.toLocaleString());
    }

    if (options.sessionId) {
        // Truncate session ID for brevity
        const shortId = options.sessionId.substring(0, 8);
        parts.push(`ID: ${shortId}`);
    }

    return parts.join(' | ') || 'CONFIDENTIAL';
}

/**
 * Create forensic watermark with embedded user/session data
 * Useful for tracking document leaks
 */
export function createForensicWatermark(
    containerId: string,
    sessionToken: string,
    ipAddress: string
): void {
    // Create visible watermark
    const visibleText = generateWatermarkText({
        ip: ipAddress,
        timestamp: new Date()
    });

    applyWatermark(containerId, {
        text: visibleText,
        opacity: 0.15,
        position: 'diagonal'
    });

    // Create invisible metadata watermark (steganography-like)
    const container = document.getElementById(containerId);
    if (container) {
        // Store forensic data in data attributes (hidden but retrievable)
        container.setAttribute('data-session', sessionToken);
        container.setAttribute('data-timestamp', new Date().toISOString());
        container.setAttribute('data-ip', ipAddress);
    }
}

