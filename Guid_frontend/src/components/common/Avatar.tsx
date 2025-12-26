import React from 'react';

interface AvatarProps {
    src?: string;
    name?: string;
    size?: 'xsm' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name = 'User', size = 'md', className = '' }) => {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const sizeClasses = {
        xsm: 'w-8 h-8 text-xs',
        sm: 'w-10 h-10 text-sm',
        md: 'w-11 h-11 text-base',
        lg: 'w-12 h-12 text-lg',
        xl: 'w-20 h-20 text-2xl',
        '2xl': 'w-24 h-24 text-3xl',
    };

    const selectedSizeClass = sizeClasses[size] || sizeClasses.md;

    if (src) {
        return (
            <div className={`relative overflow-hidden rounded-full border border-gray-200 dark:border-gray-800 ${selectedSizeClass} ${className}`}>
                <img
                    src={src}
                    alt={name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                        // Fallback if image fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.classList.add('flex', 'items-center', 'justify-center', 'bg-brand-500', 'text-white');
                        (e.target as HTMLImageElement).parentElement!.innerHTML = `<span>${getInitials(name)}</span>`;
                    }}
                />
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center rounded-full bg-brand-500 text-white font-semibold uppercase ${selectedSizeClass} ${className}`}>
            <span>{getInitials(name)}</span>
        </div>
    );
};

export default Avatar;
