'use client';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function Loading({
  size = 'medium',
  text = 'Cargando...',
  fullScreen = false,
  className = '',
}: LoadingProps) {
  // Size mappings
  const sizeClasses = {
    small: 'h-4 w-4 border-t-1 border-b-1',
    medium: 'h-8 w-8 border-t-2 border-b-2',
    large: 'h-12 w-12 border-t-2 border-b-2',
  };

  // Container classes based on fullScreen prop
  const containerClasses = fullScreen
    ? 'flex min-h-screen items-center justify-center'
    : 'flex items-center justify-center py-4';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-primary mx-auto`}></div>
        {text && <p className="mt-2 text-foreground text-sm">{text}</p>}
      </div>
    </div>
  );
}