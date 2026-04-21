'use client';

import { canAccessFeature, getFeatureLimit, Plan } from '@/lib/features';
import Link from 'next/link';

interface FeatureGateProps {
  feature: string;
  plan: Plan;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export default function FeatureGate({
  feature,
  plan,
  children,
  fallback,
  showUpgrade = true,
}: FeatureGateProps) {
  const hasAccess = canAccessFeature(feature as any, plan);
  const limit = getFeatureLimit(feature as any, plan);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgrade) {
    return null;
  }

  return (
    <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-6 text-center">
      <h3 className="text-lg font-semibold mb-2 text-yellow-200">
        {feature.replace(/_/g, ' ')} is not available on your plan
      </h3>
      <p className="text-yellow-100/80 mb-4">
        Upgrade to Pro or Enterprise to unlock this feature
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/dashboard/billing"
          className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold transition-all"
        >
          Upgrade Plan
        </Link>
        <Link
          href="/pricing"
          className="px-6 py-2 border border-yellow-600 rounded-lg hover:bg-yellow-900/30 transition-all"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}

/**
 * Hook to check feature access
 */
export function useFeature(feature: string, plan: Plan) {
  return {
    hasAccess: canAccessFeature(feature as any, plan),
    limit: getFeatureLimit(feature as any, plan),
  };
}
