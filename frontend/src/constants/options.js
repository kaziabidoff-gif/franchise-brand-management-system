export const statusOptions = {
  user: ['active', 'inactive'],
  branch: ['active', 'inactive'],
  asset: ['active', 'draft', 'archived'],
  campaign: ['draft', 'scheduled', 'active', 'completed', 'cancelled'],
  guideline: ['draft', 'published', 'archived'],
  request: ['pending', 'in_review', 'approved', 'rejected']
};

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
