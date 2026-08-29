const { query } = require('../config/db');

const findByCampaignId = async (campaignId) => {
       return query(
              `SELECT id, campaign_id, platform, title, post_url, insights_url,
      published_at, created_at, updated_at
     FROM social_media_publications
     WHERE campaign_id = ?
     ORDER BY published_at DESC, id DESC`,
              [campaignId]
       );
};

const findById = async (id) => {
       const rows = await query(
              `SELECT id, campaign_id, platform, title, post_url, insights_url,
      published_at, created_at, updated_at
     FROM social_media_publications
     WHERE id = ?
     LIMIT 1`,
              [id]
       );

       return rows[0] || null;
};

const create = async (data) => {
       const result = await query(
              `INSERT INTO social_media_publications
      (campaign_id, platform, title, post_url, insights_url, published_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
              [
                     data.campaign_id,
                     data.platform,
                     data.title,
                     data.post_url,
                     data.insights_url,
                     data.published_at
              ]
       );

       return findById(result.insertId);
};

const update = async (id, data) => {
       await query(
              `UPDATE social_media_publications
     SET platform = ?,
         title = ?,
         post_url = ?,
         insights_url = ?,
         published_at = ?
     WHERE id = ?`,
              [
                     data.platform,
                     data.title,
                     data.post_url,
                     data.insights_url,
                     data.published_at,
                     id
              ]
       );

       return findById(id);
};

const remove = async (id) => {
       await query(
              'DELETE FROM social_media_publications WHERE id = ?',
              [id]
       );
};

module.exports = {
       findByCampaignId,
       findById,
       create,
       update,
       remove
};
