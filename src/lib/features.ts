// Feature availability by subscription plan
export type Plan = 'free' | 'starter' | 'pro' | 'enterprise';

export const FEATURES = {
  // AI Agents
  CREATE_AGENTS: {
    free: 1,
    starter: 5,
    pro: 100,
    enterprise: 'unlimited',
  },
  AGENT_MEMORY: {
    free: false,
    starter: false,
    pro: true,
    enterprise: true,
  },
  CUSTOM_ACTIONS: {
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },

  // Automations
  CREATE_AUTOMATIONS: {
    free: 1,
    starter: 20,
    pro: 'unlimited',
    enterprise: 'unlimited',
  },
  WORKFLOW_STEPS: {
    free: 5,
    starter: 50,
    pro: 'unlimited',
    enterprise: 'unlimited',
  },

  // Websites
  CREATE_WEBSITES: {
    free: 0,
    starter: 1,
    pro: 5,
    enterprise: 'unlimited',
  },
  CUSTOM_DOMAIN: {
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },
  ECOMMERCE: {
    free: false,
    starter: false,
    pro: true,
    enterprise: true,
  },

  // General
  TEAM_MEMBERS: {
    free: 0,
    starter: 1,
    pro: 5,
    enterprise: 'unlimited',
  },
  API_ACCESS: {
    free: false,
    starter: true,
    pro: true,
    enterprise: true,
  },
  PRIORITY_SUPPORT: {
    free: false,
    starter: false,
    pro: true,
    enterprise: true,
  },
  WHITE_LABEL: {
    free: false,
    starter: false,
    pro: false,
    enterprise: true,
  },
};

/**
 * Check if a feature is available for a plan
 */
export function canAccessFeature(
  feature: keyof typeof FEATURES,
  plan: Plan
): boolean {
  const featureLimits = FEATURES[feature];
  if (!featureLimits) return false;

  const limit = featureLimits[plan];

  // If limit is 0 or false, feature is not available
  if (limit === 0 || limit === false) {
    return false;
  }

  // If limit is 'unlimited' or true, feature is available
  return true;
}

/**
 * Get the limit for a feature
 */
export function getFeatureLimit(
  feature: keyof typeof FEATURES,
  plan: Plan
): number | string | boolean {
  const featureLimits = FEATURES[feature];
  if (!featureLimits) return false;

  return featureLimits[plan];
}

/**
 * Get all features available for a plan
 */
export function getPlanFeatures(plan: Plan) {
  const features: Record<string, any> = {};

  for (const [feature, limits] of Object.entries(FEATURES)) {
    features[feature] = limits[plan];
  }

  return features;
}

/**
 * Check if user can upgrade to a plan
 */
export function canUpgradeToPlan(currentPlan: Plan, targetPlan: Plan): boolean {
  const planHierarchy: Record<Plan, number> = {
    free: 0,
    starter: 1,
    pro: 2,
    enterprise: 3,
  };

  return planHierarchy[targetPlan] > planHierarchy[currentPlan];
}
