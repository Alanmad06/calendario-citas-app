'use client';

import { Button } from '@/components/ui/button';

export default function TestButtonPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
      <h1 className="text-2xl font-bold mb-6">Button Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold">Default Button</h2>
          <Button>Default Button</Button>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold">Secondary Button</h2>
          <Button variant="secondary">Secondary Button</Button>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold">Outline Button</h2>
          <Button variant="outline">Outline Button</Button>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-lg font-semibold">Ghost Button</h2>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </div>
      
      <div className="mt-8">
        <p className="text-sm text-foreground">The default button should have the primary background color (#0070f3)</p>
      </div>
    </div>
  );
}