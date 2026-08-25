// Mirrors the authorize(...) role lists in backend/src/routes/*.js exactly.
// If a backend route's allowed roles change, update the matching entry here too -
// this file has no way to detect drift automatically, so keep them in sync by hand.

const MATRIX = {
  branches: {
    create: ['super_admin', 'brand_manager'],
    edit: ['super_admin', 'brand_manager'],
    delete: ['super_admin']
  },
  assets: {
    create: ['super_admin', 'brand_manager', 'marketing_executive', 'graphic_designer'],
    edit: ['super_admin', 'brand_manager', 'marketing_executive', 'graphic_designer'],
    delete: ['super_admin', 'brand_manager']
  },
  campaigns: {
    create: ['super_admin', 'brand_manager', 'marketing_executive'],
    edit: ['super_admin', 'brand_manager', 'marketing_executive'],
    delete: ['super_admin', 'brand_manager']
  },
  guidelines: {
    create: ['super_admin', 'brand_manager'],
    edit: ['super_admin', 'brand_manager'],
    publish: ['super_admin', 'brand_manager'],
    delete: ['super_admin']
  },
  requests: {
    // create has no backend restriction - every authenticated role can submit one
    decide: ['super_admin', 'brand_manager', 'marketing_executive'], // approve / reject / request-revision
    delete: ['super_admin', 'brand_manager']
  },
  users: {
    create: ['super_admin', 'brand_manager'],
    edit: ['super_admin', 'brand_manager'],
    delete: ['super_admin']
  }
};

// can(user, 'assets', 'create') -> true/false
export const can = (user, resource, action) => {
  const allowedRoles = MATRIX[resource]?.[action];

  if (!allowedRoles) {
    return false;
  }

  return allowedRoles.includes(user?.role_slug);
};