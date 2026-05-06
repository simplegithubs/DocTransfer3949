import React from 'react';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    variant?: 'rectangle' | 'circle' | 'text';
    style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({
    width,
    height,
    borderRadius,
    className = '',
    variant = 'rectangle',
    style = {}
}) => {
    const baseStyle: React.CSSProperties = {
        width: width || (variant === 'text' ? '100%' : 'auto'),
        height: height || (variant === 'text' ? '1rem' : 'auto'),
        borderRadius: borderRadius || (variant === 'circle' ? '50%' : variant === 'text' ? '4px' : '8px'),
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden',
        ...style
    };

    return (
        <div 
            className={`skeleton-shimmer ${className}`}
            style={baseStyle}
        />
    );
};

export default Skeleton;
