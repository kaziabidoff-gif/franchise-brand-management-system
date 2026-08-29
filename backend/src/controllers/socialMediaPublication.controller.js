const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const campaignModel = require('../models/campaign.model');
const socialMediaPublicationModel = require('../models/socialMediaPublication.model');
const { logActivity } = require('../models/activity.model');

const listPublications = asyncHandler(async (req, res) => {
       const campaign = await campaignModel.findById(req.params.id);

       if (!campaign) {
              throw new ApiError(404, 'Campaign not found.');
       }

       const publications = await socialMediaPublicationModel.findByCampaignId(
              req.params.id
       );

       res.json({
              data: publications
       });
});

const createPublication = asyncHandler(async (req, res) => {
       const campaign = await campaignModel.findById(req.params.id);

       if (!campaign) {
              throw new ApiError(404, 'Campaign not found.');
       }

       const publication = await socialMediaPublicationModel.create({
              ...req.body,
              campaign_id: req.params.id
       });

       await logActivity({
              actorId: req.user.id,
              entityType: 'campaign',
              entityId: campaign.id,
              action: 'social_media_publication_create',
              description: `${req.user.name} added a ${publication.platform} publication to campaign ${campaign.name}`
       });

       res.status(201).json({
              data: publication
       });
});

const updatePublication = asyncHandler(async (req, res) => {
       const campaign = await campaignModel.findById(req.params.id);

       if (!campaign) {
              throw new ApiError(404, 'Campaign not found.');
       }

       const existing = await socialMediaPublicationModel.findById(
              req.params.publicationId
       );

       if (!existing || existing.campaign_id !== Number(req.params.id)) {
              throw new ApiError(404, 'Social media publication not found.');
       }

       const publication = await socialMediaPublicationModel.update(
              req.params.publicationId,
              req.body
       );

       await logActivity({
              actorId: req.user.id,
              entityType: 'campaign',
              entityId: campaign.id,
              action: 'social_media_publication_update',
              description: `${req.user.name} updated a ${publication.platform} publication for campaign ${campaign.name}`
       });

       res.json({
              data: publication
       });
});

const deletePublication = asyncHandler(async (req, res) => {
       const campaign = await campaignModel.findById(req.params.id);

       if (!campaign) {
              throw new ApiError(404, 'Campaign not found.');
       }

       const existing = await socialMediaPublicationModel.findById(
              req.params.publicationId
       );

       if (!existing || existing.campaign_id !== Number(req.params.id)) {
              throw new ApiError(404, 'Social media publication not found.');
       }

       await socialMediaPublicationModel.remove(req.params.publicationId);

       await logActivity({
              actorId: req.user.id,
              entityType: 'campaign',
              entityId: campaign.id,
              action: 'social_media_publication_delete',
              description: `${req.user.name} removed a ${existing.platform} publication from campaign ${campaign.name}`
       });

       res.status(204).send();
});

module.exports = {
       listPublications,
       createPublication,
       updatePublication,
       deletePublication
};