export const statusOptions = {
  user: ['active', 'inactive'],
  branch: ['active', 'inactive'],
  asset: ['active', 'draft', 'archived'],
  campaign: ['draft', 'scheduled', 'active', 'completed', 'cancelled'],
  guideline: ['draft', 'published', 'archived'],
  request: ['pending', 'in_review', 'approved', 'rejected', 'needs_revision']
};

export const requestCategories = [
  'Poster',
  'Local Marketing Material',
  'Branch-Specific Promotion',
  'Local Event Branding',
  'Modified Campaign Material',
  'Other'
];

export const assetCategories = [
  'Logo',
  'Social',
  'Poster',
  'Banner',
  'Template',
  'Guideline',
  'Flyer',
  'Print',
  'Outdoor',
  'Photography',
  'Operations',
  'Video',
  'Email',
  'Presentation',
  'Document',
  'Campaign',
  'Event'
];

export const assetTypes = ['image', 'document', 'video', 'template', 'logo', 'other'];

export const requestPriorities = ['low', 'medium', 'high', 'urgent'];
