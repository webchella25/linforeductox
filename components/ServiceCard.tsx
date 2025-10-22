"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Zap } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description: string;
  iconName: "sparkles" | "heart" | "zap";
  href: string;
  delay?: number;
};

export default function ServiceCard({
  title,
  description,
  iconName,
  href,
  delay = 0,
}: ServiceCardProps) {
  const iconMap = {
    sparkles: Sparkles,
    heart: Heart,
    zap: Zap,
  };

  const Icon = iconMap[iconName];

  return (
    <div className="group">
      <Link href={href}>
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 group-hover:border-secondary">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
            <Icon size={32} className="text-primary group-hover:text-secondary transition-colors" />
          </div>
          
          <h3 className="font-heading text-2xl font-semibold mb-4 text-primary">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center text-primary group-hover:text-secondary font-medium transition-colors">
            <span>Conocer más</span>
            <ArrowRight
              size={20}
              className="ml-2 group-hover:translate-x-2 transition-transform"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}