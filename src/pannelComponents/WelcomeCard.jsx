import { useEffect, useState } from 'react';
import { RiCloseLine, RiExternalLinkLine } from '@remixicon/react';
import { Card } from '@tremor/react';

export default function WelcomeCard() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    let timeoutId;
    if (!isOpen) {
      timeoutId = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  return isOpen ? (
    <Card className="relative">
      <button
        type="button"
        className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded"
        onClick={() => setIsOpen(false)}
        aria-label="Close"
      >
        <RiCloseLine className="size-5" />
      </button>
      
      <h3 className="text-lg font-semibold text-gray-900">
        Welcome to your workspace
      </h3>
      
      <p className="mt-2 text-sm leading-6 text-gray-600">
        Start with our step-by-step guide to configure the workspace to your needs. 
        For further resources, our video tutorials and audience-specific documentations 
        are designed to provide you with an in-depth understanding of our platform.
      </p>
      
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Get started
        </button>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View tutorials
          <RiExternalLinkLine className="size-4" />
        </a>
      </div>
    </Card>
  ) : null;
}