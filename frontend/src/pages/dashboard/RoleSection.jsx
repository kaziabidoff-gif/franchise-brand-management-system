import CampaignSpotlight from './CampaignSpotlight';
import DesignTasks from './DesignTasks';
import BranchOverview from './BranchOverview';

export default function RoleSection({ section }) {
  if (!section) {
    return null;
  }

  if (section.type === 'campaign_spotlight') {
    return <CampaignSpotlight section={section} />;
  }
  if (section.type === 'design_tasks') {
    return <DesignTasks section={section} />;
  }
  if (section.type === 'branch_overview') {
    return <BranchOverview section={section} />;
  }
  return null;
}
