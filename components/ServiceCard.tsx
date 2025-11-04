// components/ServiceCard.tsx
import Link from 'next/link';
import { Sparkles, Heart, Zap, LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  iconName: 'sparkles' | 'heart' | 'zap';
  href: string;
  delay?: number;
}

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  heart: Heart,
  zap: Zap,
};

export default function ServiceCard({ 
  title, 
  description, 
  iconName, 
  href,
  delay = 0 
}: ServiceCardProps) {
  const Icon = iconMap[iconName] || Sparkles;

  return (
    <div className="group">
      <Link href={href}>
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 group-hover:border-secondary">
          {/* Icon */}
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
            <Icon size={32} className="text-primary group-hover:text-secondary transition-colors" />
          </div>

          {/* Content */}
          <h3 className="font-heading text-2xl font-semibold mb-4 text-primary">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center text-primary group-hover:text-secondary font-medium transition-colors">
            <span>Conocer más</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="ml-2 group-hover:translate-x-2 transition-transform"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </Link>
    </div>
  );
}