import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import ErrorState from '../../components/common/ErrorState';
import PageHeader from '../../components/common/PageHeader';

import api from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function CampaignDetailsPage() {
       const { id } = useParams();

       const [campaign, setCampaign] = useState(null);
       const [publications, setPublications] = useState([]);
       const [loading, setLoading] = useState(true);
       const [publicationsLoading, setPublicationsLoading] = useState(true);
       const [error, setError] = useState('');
       const [publicationsError, setPublicationsError] = useState('');

       useEffect(() => {
              const loadCampaign = async () => {
                     setLoading(true);
                     setError('');

                     try {
                            const response = await api.get(`/campaigns/${id}`);
                            setCampaign(response.data.data);
                     } catch (err) {
                            setError(
                                   err.response?.data?.message ||
                                   'Failed to load campaign.'
                            );
                     } finally {
                            setLoading(false);
                     }
              };

              const loadPublications = async () => {
                     setPublicationsLoading(true);
                     setPublicationsError('');

                     try {
                            const response = await api.get(
                                   `/campaigns/${id}/publications`
                            );

                            setPublications(response.data.data || []);
                     } catch (err) {
                            setPublicationsError(
                                   err.response?.data?.message ||
                                   'Failed to load publications.'
                            );
                     } finally {
                            setPublicationsLoading(false);
                     }
              };

              loadCampaign();
              loadPublications();
       }, [id]);

       if (loading) {
              return (
                     <div className="space-y-5">
                            <PageHeader
                                   title="Campaign Details"
                                   description="Loading campaign information..."
                            />

                            <div className="rounded-lg border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-900">
                                   <div className="h-6 w-48 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
                                   <div className="mt-4 h-4 w-72 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
                                   <div className="mt-3 h-4 w-64 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
                            </div>
                     </div>
              );
       }

       if (error) {
              return (
                     <div className="space-y-5">
                            <PageHeader
                                   title="Campaign Details"
                                   description="Unable to load campaign."
                                   actions={
                                          <Link to="/campaigns">
                                                 <Button icon={FiArrowLeft} variant="secondary">
                                                        Back to Campaigns
                                                 </Button>
                                          </Link>
                                   }
                            />

                            <ErrorState message={error} />
                     </div>
              );
       }

       if (!campaign) {
              return null;
       }

       return (
              <div className="space-y-5">
                     <PageHeader
                            title={campaign.name}
                            description="Campaign details and social media publications."
                            actions={
                                   <Link to="/campaigns">
                                          <Button icon={FiArrowLeft} variant="secondary">
                                                 Back to Campaigns
                                          </Button>
                                   </Link>
                            }
                     />

                     <div className="grid gap-5 lg:grid-cols-2">
                            <section className="rounded-lg border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-900">
                                   <div className="flex items-start justify-between gap-4">
                                          <div>
                                                 <p className="text-xs font-mono font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                        Campaign
                                                 </p>

                                                 <h2 className="mt-1 text-xl font-bold text-ink-900 dark:text-white">
                                                        {campaign.name}
                                                 </h2>
                                          </div>

                                          <Badge value={campaign.status} />
                                   </div>

                                   <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                                          <div>
                                                 <dt className="text-xs font-mono uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                        Start Date
                                                 </dt>
                                                 <dd className="mt-1 text-sm text-ink-900 dark:text-white">
                                                        {formatDate(campaign.start_date)}
                                                 </dd>
                                          </div>

                                          <div>
                                                 <dt className="text-xs font-mono uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                        End Date
                                                 </dt>
                                                 <dd className="mt-1 text-sm text-ink-900 dark:text-white">
                                                        {formatDate(campaign.end_date)}
                                                 </dd>
                                          </div>

                                          <div>
                                                 <dt className="text-xs font-mono uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                        Budget
                                                 </dt>
                                                 <dd className="mt-1 text-sm text-ink-900 dark:text-white">
                                                        {formatCurrency(campaign.budget)}
                                                 </dd>
                                          </div>

                                          <div>
                                                 <dt className="text-xs font-mono uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                        Campaign ID
                                                 </dt>
                                                 <dd className="mt-1 text-sm text-ink-900 dark:text-white">
                                                        {campaign.id}
                                                 </dd>
                                          </div>
                                   </dl>

                                   {campaign.description ? (
                                          <div className="mt-6 border-t border-ink-100 pt-5 dark:border-ink-800">
                                                 <p className="text-xs font-mono font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                        Description
                                                 </p>

                                                 <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink-700 dark:text-ink-200">
                                                        {campaign.description}
                                                 </p>
                                          </div>
                                   ) : null}
                            </section>

                            <section className="rounded-lg border border-ink-200 bg-white p-6 dark:border-ink-700 dark:bg-ink-900">
                                   <p className="text-xs font-mono font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                          Campaign Resources
                                   </p>

                                   <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                          <div className="rounded-lg bg-ink-50 p-4 dark:bg-ink-800">
                                                 <p className="text-xs text-ink-500 dark:text-ink-400">
                                                        Branches
                                                 </p>
                                                 <p className="mt-1 text-2xl font-bold text-ink-900 dark:text-white">
                                                        {campaign.branches_count ?? 0}
                                                 </p>
                                          </div>

                                          <div className="rounded-lg bg-ink-50 p-4 dark:bg-ink-800">
                                                 <p className="text-xs text-ink-500 dark:text-ink-400">
                                                        Assets
                                                 </p>
                                                 <p className="mt-1 text-2xl font-bold text-ink-900 dark:text-white">
                                                        {campaign.assets_count ?? 0}
                                                 </p>
                                          </div>
                                   </div>
                            </section>
                     </div>

                     <section className="rounded-lg border border-ink-200 bg-white dark:border-ink-700 dark:bg-ink-900">
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-6 py-4 dark:border-ink-800">
                                   <div>
                                          <h2 className="text-lg font-bold text-ink-900 dark:text-white">
                                                 Social Media Publications
                                          </h2>

                                          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                                                 Manage publications associated with this campaign.
                                          </p>
                                   </div>
                            </div>

                            <div className="p-6">
                                   {publicationsLoading ? (
                                          <div className="space-y-3">
                                                 <div className="h-10 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
                                                 <div className="h-10 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
                                                 <div className="h-10 animate-pulse rounded bg-ink-100 dark:bg-ink-800" />
                                          </div>
                                   ) : publicationsError ? (
                                          <p className="text-sm text-red-600 dark:text-red-400">
                                                 {publicationsError}
                                          </p>
                                   ) : publications.length === 0 ? (
                                          <p className="text-sm text-ink-500 dark:text-ink-400">
                                                 No social media publications have been added to this campaign yet.
                                          </p>
                                   ) : (
                                          <div className="overflow-x-auto">
                                                 <table className="min-w-full divide-y divide-ink-200 dark:divide-ink-700">
                                                        <thead>
                                                               <tr>
                                                                      <th className="px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                                             Platform
                                                                      </th>

                                                                      <th className="px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                                             Title
                                                                      </th>

                                                                      <th className="px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                                             Published
                                                                      </th>

                                                                      <th className="px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                                             Post
                                                                      </th>

                                                                      <th className="px-4 py-3 text-left font-mono text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-400">
                                                                             Insights
                                                                      </th>
                                                               </tr>
                                                        </thead>

                                                        <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                                                               {publications.map((publication) => (
                                                                      <tr
                                                                             key={publication.id}
                                                                             className="hover:bg-ink-50 dark:hover:bg-ink-800/50"
                                                                      >
                                                                             <td className="px-4 py-4 text-sm font-semibold text-ink-900 dark:text-white">
                                                                                    {publication.platform || '-'}
                                                                             </td>

                                                                             <td className="px-4 py-4 text-sm text-ink-700 dark:text-ink-200">
                                                                                    {publication.title || '-'}
                                                                             </td>

                                                                             <td className="px-4 py-4 text-sm text-ink-700 dark:text-ink-200">
                                                                                    {publication.published_at
                                                                                           ? formatDate(publication.published_at)
                                                                                           : '-'}
                                                                             </td>

                                                                             <td className="px-4 py-4 text-sm">
                                                                                    {publication.post_url ? (
                                                                                           <a
                                                                                                  href={publication.post_url}
                                                                                                  target="_blank"
                                                                                                  rel="noreferrer"
                                                                                                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                                                           >
                                                                                                  View Post
                                                                                           </a>
                                                                                    ) : (
                                                                                           '-'
                                                                                    )}
                                                                             </td>

                                                                             <td className="px-4 py-4 text-sm">
                                                                                    {publication.insights_url ? (
                                                                                           <a
                                                                                                  href={publication.insights_url}
                                                                                                  target="_blank"
                                                                                                  rel="noreferrer"
                                                                                                  className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                                                           >
                                                                                                  View Insights
                                                                                           </a>
                                                                                    ) : (
                                                                                           '-'
                                                                                    )}
                                                                             </td>
                                                                      </tr>
                                                               ))}
                                                        </tbody>
                                                 </table>
                                          </div>
                                   )}
                            </div>
                     </section>
              </div>
       );
}