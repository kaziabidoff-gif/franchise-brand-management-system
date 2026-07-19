USE fbms;

INSERT INTO roles (id, name, slug, description) VALUES
(1, 'Super Admin', 'super_admin', 'Full system access across all modules.'),
(2, 'Headquarters Brand Manager', 'brand_manager', 'Owns brand governance, users, branches, campaigns, and guidelines.'),
(3, 'Marketing Executive', 'marketing_executive', 'Plans campaigns and monitors brand asset usage.'),
(4, 'Graphic Designer', 'graphic_designer', 'Uploads assets and fulfills customization requests.'),
(5, 'Branch Manager', 'branch_manager', 'Submits requests and manages branch campaign execution.');

INSERT INTO branches (id, code, name, location, address, city, country, phone, email, status) VALUES
(1, 'HQ-DHK', 'Headquarters Dhaka', 'Gulshan', 'House 22, Road 11, Gulshan 1', 'Dhaka', 'Bangladesh', '+8801700001001', 'hq@fbms.com', 'active'),
(2, 'DHK-BAN', 'Banani Flagship', 'Banani', 'Plot 17, Road 6, Banani', 'Dhaka', 'Bangladesh', '+8801700001002', 'banani@fbms.com', 'active'),
(3, 'DHK-DHN', 'Dhanmondi Outlet', 'Dhanmondi', 'Satmasjid Road, Dhanmondi', 'Dhaka', 'Bangladesh', '+8801700001003', 'dhanmondi@fbms.com', 'active'),
(4, 'CTG-AGR', 'Agrabad Branch', 'Agrabad', 'Commercial Area, Agrabad', 'Chattogram', 'Bangladesh', '+8801700001004', 'agrabad@fbms.com', 'active'),
(5, 'SYL-ZIN', 'Zindabazar Branch', 'Zindabazar', 'Zindabazar Point', 'Sylhet', 'Bangladesh', '+8801700001005', 'sylhet@fbms.com', 'active'),
(6, 'RAJ-SHA', 'Shaheb Bazar Branch', 'Shaheb Bazar', 'Shaheb Bazar Main Road', 'Rajshahi', 'Bangladesh', '+8801700001006', 'rajshahi@fbms.com', 'active'),
(7, 'KHL-SON', 'Sonadanga Branch', 'Sonadanga', 'KDA Avenue, Sonadanga', 'Khulna', 'Bangladesh', '+8801700001007', 'khulna@fbms.com', 'active'),
(8, 'BAR-NAT', 'Nathullabad Branch', 'Nathullabad', 'Nathullabad Bus Stand', 'Barishal', 'Bangladesh', '+8801700001008', 'barishal@fbms.com', 'active'),
(9, 'RNG-CEN', 'Rangpur Central', 'Central Road', 'Central Road', 'Rangpur', 'Bangladesh', '+8801700001009', 'rangpur@fbms.com', 'active'),
(10, 'MYM-TWN', 'Mymensingh Town', 'Town Hall', 'Town Hall Road', 'Mymensingh', 'Bangladesh', '+8801700001010', 'mymensingh@fbms.com', 'inactive');

INSERT INTO users
(id, role_id, branch_id, name, email, password_hash, phone, avatar_url, status) VALUES
(1, 1, 1, 'Ariyan Rahman', 'admin@fbms.com', '$2b$10$0bCYkQFys5h1nB7kGiuN2ef1VTvU/IXYI5ou4HxkxOc86/2k/AEYC', '+8801711000001', 'https://i.pravatar.cc/160?img=12', 'active'),
(2, 2, 1, 'Nabila Karim', 'manager@fbms.com', '$2b$10$1i7sn5cILtiiMRu2Jc4JweRO6A7fIDKhHpXR1WoAfSHdxf1HvrCUS', '+8801711000002', 'https://i.pravatar.cc/160?img=21', 'active'),
(3, 3, 1, 'Tanvir Hasan', 'marketing@fbms.com', '$2b$10$ms0ZaP8yObxjd16FM9MFH.GsmCEA95P6Stc5ANpnjUbxIxU/RBQXa', '+8801711000003', 'https://i.pravatar.cc/160?img=33', 'active'),
(4, 4, 1, 'Maliha Islam', 'designer@fbms.com', '$2b$10$QAbX.OTlAN8S0RL.BybIje/OmtPDaoaVRHY4t4gZjDlEcSUuD15SO', '+8801711000004', 'https://i.pravatar.cc/160?img=47', 'active'),
(5, 5, 2, 'Shahriar Ahmed', 'branch@fbms.com', '$2b$10$vDpTfBPoQJ7v2RJPrltJZuQOpdtQZHcmltKyIyg0A5W4PfEkRQ4OG', '+8801711000005', 'https://i.pravatar.cc/160?img=51', 'active'),
(6, 5, 3, 'Farzana Chowdhury', 'farzana.branch@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000006', 'https://i.pravatar.cc/160?img=41', 'active'),
(7, 5, 4, 'Imran Hossain', 'imran.branch@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000007', 'https://i.pravatar.cc/160?img=5', 'active'),
(8, 5, 5, 'Sadia Akter', 'sadia.branch@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000008', 'https://i.pravatar.cc/160?img=25', 'active'),
(9, 5, 6, 'Mahmudul Alam', 'mahmud.branch@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000009', 'https://i.pravatar.cc/160?img=60', 'active'),
(10, 5, 7, 'Rumana Sultana', 'rumana.branch@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000010', 'https://i.pravatar.cc/160?img=44', 'active'),
(11, 3, 1, 'Rafiq Mahmud', 'rafiq.marketing@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000011', 'https://i.pravatar.cc/160?img=15', 'active'),
(12, 4, 1, 'Samira Noor', 'samira.design@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000012', 'https://i.pravatar.cc/160?img=36', 'active'),
(13, 2, 1, 'Hasib Uddin', 'hasib.manager@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000013', 'https://i.pravatar.cc/160?img=18', 'inactive'),
(14, 5, 8, 'Jannatul Ferdous', 'jannatul.branch@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000014', 'https://i.pravatar.cc/160?img=29', 'active'),
(15, 5, 9, 'Arif Chowdhury', 'arif.branch@fbms.com', '$2b$10$V.A02eAOfDj0tfoA65UYQeyXps7FXXOjGKBnO8OieG.oSp9qYx6ii', '+8801711000015', 'https://i.pravatar.cc/160?img=8', 'active');

UPDATE branches SET manager_id = 5 WHERE id = 2;
UPDATE branches SET manager_id = 6 WHERE id = 3;
UPDATE branches SET manager_id = 7 WHERE id = 4;
UPDATE branches SET manager_id = 8 WHERE id = 5;
UPDATE branches SET manager_id = 9 WHERE id = 6;
UPDATE branches SET manager_id = 10 WHERE id = 7;
UPDATE branches SET manager_id = 14 WHERE id = 8;
UPDATE branches SET manager_id = 15 WHERE id = 9;

INSERT INTO brand_assets
(id, title, description, category, asset_type, file_url, thumbnail_url, version, status, tags, branch_id, uploaded_by) VALUES
(1, 'Primary Logo Pack', 'Approved primary logo package for digital and print.', 'Logo', 'logo', 'https://placehold.co/1200x800?text=Primary+Logo+Pack', 'https://placehold.co/400x260?text=Logo', '3.1', 'active', JSON_ARRAY('logo','core','print'), NULL, 4),
(2, 'Monochrome Logo Pack', 'Single color logo versions for limited print use.', 'Logo', 'logo', 'https://placehold.co/1200x800?text=Monochrome+Logo', 'https://placehold.co/400x260?text=Mono+Logo', '2.4', 'active', JSON_ARRAY('logo','mono'), NULL, 4),
(3, 'Social Media Template Set', 'Editable templates for monthly social media posts.', 'Social', 'template', 'https://placehold.co/1200x800?text=Social+Templates', 'https://placehold.co/400x260?text=Social', '4.0', 'active', JSON_ARRAY('facebook','instagram','template'), NULL, 12),
(4, 'Eid Campaign Poster', 'Localized poster for Eid store promotions.', 'Poster', 'image', 'https://placehold.co/1200x800?text=Eid+Poster', 'https://placehold.co/400x260?text=Eid', '1.2', 'active', JSON_ARRAY('eid','poster'), 2, 4),
(5, 'Opening Ceremony Banner', 'Large format opening ceremony banner.', 'Banner', 'image', 'https://placehold.co/1200x800?text=Opening+Banner', 'https://placehold.co/400x260?text=Opening', '1.0', 'active', JSON_ARRAY('banner','launch'), 4, 12),
(6, 'Menu Board Template', 'In-store menu board editable file.', 'Template', 'template', 'https://placehold.co/1200x800?text=Menu+Board', 'https://placehold.co/400x260?text=Menu', '2.0', 'active', JSON_ARRAY('menu','store'), NULL, 4),
(7, 'Brand Color Palette', 'Reference image for approved color system.', 'Guideline', 'image', 'https://placehold.co/1200x800?text=Color+Palette', 'https://placehold.co/400x260?text=Palette', '1.5', 'active', JSON_ARRAY('color','guideline'), NULL, 2),
(8, 'Typography Spec Sheet', 'Approved headline and body typography usage.', 'Guideline', 'document', 'https://placehold.co/1200x800?text=Typography+Spec', 'https://placehold.co/400x260?text=Type', '1.1', 'active', JSON_ARRAY('typography','guideline'), NULL, 2),
(9, 'Ramadan Offer Flyer', 'Flyer design for Ramadan branch offers.', 'Flyer', 'image', 'https://placehold.co/1200x800?text=Ramadan+Flyer', 'https://placehold.co/400x260?text=Ramadan', '1.0', 'active', JSON_ARRAY('ramadan','flyer'), 3, 12),
(10, 'Recruitment Poster', 'Hiring poster for branch staff recruitment.', 'Poster', 'image', 'https://placehold.co/1200x800?text=Recruitment+Poster', 'https://placehold.co/400x260?text=Hiring', '1.0', 'draft', JSON_ARRAY('hr','poster'), NULL, 4),
(11, 'Window Sticker Artwork', 'Printable artwork for store windows.', 'Print', 'image', 'https://placehold.co/1200x800?text=Window+Sticker', 'https://placehold.co/400x260?text=Sticker', '1.3', 'active', JSON_ARRAY('window','print'), 5, 12),
(12, 'POS Counter Card', 'Counter display card artwork.', 'Print', 'image', 'https://placehold.co/1200x800?text=Counter+Card', 'https://placehold.co/400x260?text=Counter', '2.2', 'active', JSON_ARRAY('pos','counter'), NULL, 4),
(13, 'Outdoor Billboard Design', 'Main billboard design for premium locations.', 'Outdoor', 'image', 'https://placehold.co/1200x800?text=Billboard', 'https://placehold.co/400x260?text=Billboard', '1.0', 'active', JSON_ARRAY('outdoor','billboard'), 4, 12),
(14, 'Product Photography Set A', 'Lifestyle product imagery for digital ads.', 'Photography', 'image', 'https://placehold.co/1200x800?text=Photography+A', 'https://placehold.co/400x260?text=Photos+A', '1.0', 'active', JSON_ARRAY('photo','digital'), NULL, 4),
(15, 'Product Photography Set B', 'Clean product shots for ecommerce listings.', 'Photography', 'image', 'https://placehold.co/1200x800?text=Photography+B', 'https://placehold.co/400x260?text=Photos+B', '1.0', 'active', JSON_ARRAY('photo','ecommerce'), NULL, 4),
(16, 'Branch Launch Checklist', 'PDF checklist for new branch brand setup.', 'Operations', 'document', 'https://placehold.co/1200x800?text=Launch+Checklist', 'https://placehold.co/400x260?text=Checklist', '1.4', 'active', JSON_ARRAY('operations','launch'), NULL, 2),
(17, 'Digital Menu Animation', 'Short animation for in-store screens.', 'Video', 'video', 'https://placehold.co/1200x800?text=Menu+Animation', 'https://placehold.co/400x260?text=Video', '1.0', 'active', JSON_ARRAY('video','screen'), 2, 12),
(18, 'Festive Email Header', 'Email header artwork for festive campaigns.', 'Email', 'image', 'https://placehold.co/1200x800?text=Email+Header', 'https://placehold.co/400x260?text=Email', '1.1', 'active', JSON_ARRAY('email','campaign'), NULL, 4),
(19, 'Corporate Profile Deck', 'Presentation deck for franchise partners.', 'Presentation', 'document', 'https://placehold.co/1200x800?text=Corporate+Deck', 'https://placehold.co/400x260?text=Deck', '2.8', 'active', JSON_ARRAY('deck','partner'), NULL, 2),
(20, 'Storefront Signage Guide', 'Signage placement and sizing reference.', 'Guideline', 'document', 'https://placehold.co/1200x800?text=Signage+Guide', 'https://placehold.co/400x260?text=Signage', '3.0', 'active', JSON_ARRAY('signage','storefront'), NULL, 2),
(21, 'Chattogram Local Poster', 'Localized promotion for Chattogram market.', 'Poster', 'image', 'https://placehold.co/1200x800?text=Chattogram+Poster', 'https://placehold.co/400x260?text=CTG', '1.0', 'active', JSON_ARRAY('local','poster'), 4, 12),
(22, 'Sylhet Outdoor Banner', 'Outdoor banner for Sylhet branch.', 'Banner', 'image', 'https://placehold.co/1200x800?text=Sylhet+Banner', 'https://placehold.co/400x260?text=Sylhet', '1.0', 'active', JSON_ARRAY('local','banner'), 5, 4),
(23, 'Khulna Flyer', 'Localized flyer for Khulna customer offer.', 'Flyer', 'image', 'https://placehold.co/1200x800?text=Khulna+Flyer', 'https://placehold.co/400x260?text=Khulna', '1.0', 'archived', JSON_ARRAY('local','flyer'), 7, 12),
(24, 'Loyalty Card Artwork', 'Artwork for customer loyalty cards.', 'Print', 'image', 'https://placehold.co/1200x800?text=Loyalty+Card', 'https://placehold.co/400x260?text=Loyalty', '2.1', 'active', JSON_ARRAY('loyalty','print'), NULL, 4),
(25, 'Press Release Template', 'Editable press release template.', 'Document', 'document', 'https://placehold.co/1200x800?text=Press+Release', 'https://placehold.co/400x260?text=Press', '1.0', 'active', JSON_ARRAY('press','template'), NULL, 3),
(26, 'Influencer Brief Template', 'Brief template for influencer collaborations.', 'Document', 'document', 'https://placehold.co/1200x800?text=Influencer+Brief', 'https://placehold.co/400x260?text=Brief', '1.0', 'active', JSON_ARRAY('influencer','brief'), NULL, 3),
(27, 'Summer Promo Story Set', 'Story graphics for summer promotion.', 'Social', 'template', 'https://placehold.co/1200x800?text=Summer+Stories', 'https://placehold.co/400x260?text=Stories', '1.0', 'active', JSON_ARRAY('summer','social'), 2, 12),
(28, 'Monsoon Campaign Visual', 'Campaign master visual for monsoon season.', 'Campaign', 'image', 'https://placehold.co/1200x800?text=Monsoon+Visual', 'https://placehold.co/400x260?text=Monsoon', '1.0', 'active', JSON_ARRAY('monsoon','campaign'), NULL, 4),
(29, 'Franchise Expo Booth Backdrop', 'Backdrop artwork for franchise expo booth.', 'Event', 'image', 'https://placehold.co/1200x800?text=Expo+Backdrop', 'https://placehold.co/400x260?text=Expo', '1.0', 'active', JSON_ARRAY('event','expo'), NULL, 12),
(30, 'Customer Feedback QR Stand', 'Table stand artwork with feedback QR area.', 'Print', 'image', 'https://placehold.co/1200x800?text=QR+Stand', 'https://placehold.co/400x260?text=QR', '1.0', 'active', JSON_ARRAY('feedback','qr'), NULL, 4);

INSERT INTO campaigns
(id, name, description, start_date, end_date, budget, status, created_by) VALUES
(1, 'Summer Refresh Campaign', 'Nationwide summer beverage and refreshment campaign.', '2026-05-01', '2026-06-30', 650000.00, 'completed', 3),
(2, 'Monsoon Value Offers', 'Seasonal offers with localized rain-day messaging.', '2026-07-01', '2026-08-31', 420000.00, 'active', 3),
(3, 'Eid Celebration Deals', 'Holiday menu and branch activation campaign.', '2026-03-01', '2026-04-15', 900000.00, 'completed', 2),
(4, 'Back to Campus', 'Youth-focused campaign for university areas.', '2026-08-01', '2026-09-15', 350000.00, 'scheduled', 11),
(5, 'Franchise Partner Expo', 'Event campaign for franchise partner acquisition.', '2026-10-01', '2026-10-20', 780000.00, 'scheduled', 2),
(6, 'Loyalty Relaunch', 'Customer loyalty card and QR enrollment campaign.', '2026-06-15', '2026-08-15', 300000.00, 'active', 3),
(7, 'Branch Anniversary Week', 'Branch-specific anniversary offer week.', '2026-07-20', '2026-07-27', 180000.00, 'scheduled', 11),
(8, 'Digital Menu Rollout', 'Promote digital menus and in-store screen updates.', '2026-04-01', '2026-05-15', 240000.00, 'completed', 2),
(9, 'Winter Warmers Draft', 'Draft campaign for winter menu items.', '2026-11-10', '2026-12-31', 500000.00, 'draft', 3),
(10, 'Local Heroes Stories', 'Localized community storytelling campaign.', '2026-09-01', '2026-10-15', 260000.00, 'draft', 11);

INSERT INTO campaign_branches (campaign_id, branch_id) VALUES
(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),
(2,2),(2,3),(2,4),(2,5),(2,8),(2,9),
(3,2),(3,3),(3,4),(3,5),(3,6),(3,7),(3,8),(3,9),
(4,2),(4,3),(4,6),(4,9),
(5,1),(5,2),(5,4),
(6,2),(6,3),(6,4),(6,5),(6,7),(6,8),
(7,2),(7,4),(7,5),
(8,2),(8,3),(8,4),(8,5),(8,6),(8,7),
(9,2),(9,3),(9,4),(9,5),(9,6),
(10,4),(10,5),(10,7),(10,8),(10,9);

INSERT INTO campaign_assets (campaign_id, asset_id) VALUES
(1,3),(1,14),(1,15),(1,27),
(2,28),(2,11),(2,12),(2,18),
(3,4),(3,9),(3,18),(3,24),
(4,3),(4,14),(4,26),
(5,19),(5,25),(5,29),
(6,24),(6,30),(6,3),
(7,5),(7,12),(7,21),(7,22),
(8,6),(8,17),(8,20),
(9,3),(9,10),(9,15),
(10,25),(10,26),(10,29);

INSERT INTO brand_guidelines
(id, title, content, version, status, published_by, published_at) VALUES
(1, 'Core Brand Identity', 'Use the primary logo, color palette, typography, and approved spacing rules consistently across all branch and campaign materials.', '3.0', 'published', 2, '2026-01-15 10:00:00'),
(2, 'Social Media Publishing Rules', 'All branch social media posts must use approved templates, campaign hashtags, and locally reviewed captions before publishing.', '2.1', 'published', 2, '2026-04-20 11:30:00'),
(3, 'Storefront Signage Standards', 'Exterior signage must preserve logo clear space, approved color contrast, and minimum visibility requirements for day and night use.', '1.6', 'published', 2, '2026-05-01 09:15:00'),
(4, 'Local Campaign Customization Policy', 'Branches may request localized artwork, but changes to logo, brand colors, and campaign claims require headquarters approval.', '1.0', 'draft', NULL, NULL);

INSERT INTO customization_requests
(id, title, description, branch_id, requested_by, assigned_to, asset_id, status, priority, response) VALUES
(1, 'Banani Eid Poster Size Change', 'Need the Eid poster in vertical A2 size for front window display.', 2, 5, 4, 4, 'approved', 'high', 'Approved and exported in A2.'),
(2, 'Dhanmondi Menu Board Price Update', 'Update three combo prices on the menu board template.', 3, 6, 12, 6, 'in_review', 'urgent', NULL),
(3, 'Agrabad Local Poster Copy', 'Add Chattogram-specific Bangla copy to campaign poster.', 4, 7, 4, 21, 'pending', 'medium', NULL),
(4, 'Sylhet Banner Resize', 'Need outdoor banner at 12x4 feet for Zindabazar frontage.', 5, 8, 12, 22, 'approved', 'medium', 'Design resized and uploaded.'),
(5, 'Rajshahi Flyer Translation', 'Translate flyer headline to Bangla while preserving campaign tone.', 6, 9, 4, 9, 'rejected', 'low', 'Rejected because campaign copy is locked.'),
(6, 'Khulna Loyalty Card QR', 'Add branch-specific QR code to loyalty card artwork.', 7, 10, 12, 24, 'in_review', 'high', NULL),
(7, 'Barishal Window Sticker', 'Need window sticker artwork with local branch address.', 8, 14, 4, 11, 'pending', 'medium', NULL),
(8, 'Rangpur Story Template', 'Request a story template for weekend offer.', 9, 15, 12, 3, 'approved', 'medium', 'Approved as branch variation.'),
(9, 'Banani Digital Screen Asset', 'Export menu animation in screen resolution 1920x1080.', 2, 5, 12, 17, 'approved', 'high', 'Exported video and linked to asset library.'),
(10, 'Agrabad Billboard Contact Update', 'Add local phone number to billboard design.', 4, 7, 4, 13, 'rejected', 'medium', 'Phone number cannot be added to master billboard.'),
(11, 'Sylhet Ramadan Flyer', 'Need Ramadan flyer with Sylhet branch address.', 5, 8, 12, 9, 'pending', 'high', NULL),
(12, 'Dhanmondi Feedback QR Stand', 'Customize QR stand with branch feedback link.', 3, 6, 4, 30, 'in_review', 'medium', NULL),
(13, 'Rajshahi Local Heroes', 'Create local hero story visual featuring branch customer.', 6, 9, 12, NULL, 'pending', 'low', NULL),
(14, 'Khulna Opening Banner', 'Request archived opening banner adapted for anniversary week.', 7, 10, 4, 5, 'approved', 'medium', 'Approved as anniversary artwork.'),
(15, 'Barishal Counter Card', 'Need counter card with Barishal city offer.', 8, 14, 12, 12, 'pending', 'medium', NULL),
(16, 'Rangpur Recruitment Poster', 'Customize recruitment poster with interview date.', 9, 15, 4, 10, 'approved', 'low', 'Approved for HR use.'),
(17, 'Banani Monsoon Offer Story', 'Create story assets for Monsoon Value Offers.', 2, 5, 12, 28, 'in_review', 'high', NULL),
(18, 'Dhanmondi Signage Clarification', 'Need clarification about storefront sign clear space.', 3, 6, 4, 20, 'approved', 'low', 'Shared signage standard excerpt.'),
(19, 'Agrabad Expo Invitation', 'Adapt expo backdrop style for branch partner invitation.', 4, 7, 12, 29, 'pending', 'low', NULL),
(20, 'Sylhet Press Release', 'Need branch opening press release template update.', 5, 8, 3, 25, 'rejected', 'medium', 'Use the central press template without branch edits.');

INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(1, 'System seeded', 'Demo data has been loaded for FBMS.', 'success', 0),
(2, 'Guideline published', 'Core Brand Identity v3.0 is now published.', 'success', 0),
(3, 'Campaign active', 'Monsoon Value Offers is currently active.', 'info', 0),
(4, 'New design request', 'A new poster customization request needs review.', 'warning', 0),
(5, 'Request approved', 'Your Banani Eid Poster Size Change request was approved.', 'success', 0),
(6, 'Request in review', 'Dhanmondi Menu Board Price Update is now in review.', 'info', 0),
(7, 'Request pending', 'Agrabad Local Poster Copy is awaiting assignment.', 'warning', 0),
(8, 'Banner approved', 'Sylhet banner resize has been approved.', 'success', 1),
(9, 'Translation rejected', 'Rajshahi flyer translation was rejected.', 'error', 0),
(10, 'QR update in review', 'Khulna loyalty card QR request is in review.', 'info', 0),
(11, 'Campaign draft', 'Winter Warmers Draft is waiting for assets.', 'info', 1),
(12, 'Asset assigned', 'A new design task has been assigned to you.', 'warning', 0),
(13, 'Account inactive', 'Your manager account has been marked inactive for demo.', 'warning', 1),
(14, 'Window sticker pending', 'Barishal window sticker request is pending.', 'info', 0),
(15, 'Story template approved', 'Rangpur story template request was approved.', 'success', 0),
(2, 'New branch activity', 'Branch managers submitted 5 new requests this week.', 'info', 0),
(3, 'Report updated', 'Campaign and request dashboards have new data.', 'success', 0),
(4, 'Urgent request', 'Dhanmondi menu board update is marked urgent.', 'warning', 0),
(5, 'Campaign reminder', 'Branch Anniversary Week starts soon.', 'info', 1),
(6, 'Guideline update', 'Storefront signage standards were updated.', 'info', 0);

INSERT INTO activities (actor_id, entity_type, entity_id, action, description) VALUES
(2, 'guideline', 1, 'publish', 'Published Core Brand Identity v3.0'),
(3, 'campaign', 2, 'activate', 'Activated Monsoon Value Offers'),
(4, 'asset', 28, 'upload', 'Uploaded Monsoon Campaign Visual'),
(5, 'request', 1, 'submit', 'Submitted Banani poster resize request'),
(12, 'request', 4, 'complete', 'Completed Sylhet banner resize'),
(3, 'campaign', 6, 'update', 'Updated Loyalty Relaunch campaign assets'),
(2, 'branch', 4, 'review', 'Reviewed Agrabad branch compliance'),
(4, 'asset', 30, 'upload', 'Uploaded Customer Feedback QR Stand'),
(11, 'campaign', 10, 'draft', 'Created Local Heroes Stories draft'),
(1, 'user', 15, 'activate', 'Activated Arif Chowdhury account');
