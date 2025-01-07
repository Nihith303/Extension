import { AlertTriangle, ExternalLink, Link, Mail, MessageCircle, Phone } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { BaseLink, LinkData } from '../../types/seo';
import { checkLinks } from '../../utils/seoAnalyzer';

interface LinksPanelProps {
  links: LinkData;
}

export function LinksPanel({ links }: LinksPanelProps) {
  const [activeTab, setActiveTab] = useState<'internal' | 'external' | 'other' | 'broken'>('internal');

  // New state to hold broken link statuses
  const [brokenLinks, setBrokenLinks] = useState<{ [key: string]: boolean }>({});

  const [loading, setLoading] = useState(true);

  // Check for broken links when the component mounts or links change
  useEffect(() => {
    const fetchBrokenLinks = async () => {
      setLoading(true);
      const linkChecks = await checkLinks(links);
      setBrokenLinks(linkChecks);
      setLoading(false);
    };

    fetchBrokenLinks();
  }, [links]);

  const issuesSummary = useMemo(() => {
    const summary = {
      broken: Object.values(brokenLinks).filter(isBroken => isBroken).length,
      noText: 0,
      noRel: 0,
    };

    [...links.internal, ...links.external, ...links.otherLinks].forEach(link => {
      if (!link.text) summary.noText++;
      if (!link.attributes.rel.length) summary.noRel++;
    });

    return summary;
  }, [links, brokenLinks]);

  return (
    <div className="p-4 space-y-1">
      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard
          title="Total Links"
          value={links.analysis.totalCount}
          icon={<Link className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Internal Links"
          value={links.analysis.internalCount}
          icon={<Link className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="External Links"
          value={links.analysis.externalCount}
          icon={<ExternalLink className="h-5 w-5" />}
          color="orange"
        />
        <StatCard
          title="Broken Links"
          value={issuesSummary.broken}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="red"
        />
        <StatCard
          title="Other Links"
          value={links.analysis.otherCount}
          icon={<MessageCircle className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Issues Summary */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-4 mt-0 flex items-center">
          <div className="mr-2 loader"></div>
          <h2 className="text-lg font-medium text-gray-900">Checking for broken links...</h2>
        </div>
      ) : (issuesSummary.broken > 0 || links.issues.length > 0) ? (
        <div className="bg-white rounded-lg shadow p-4 mt-0">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Critical Issues & Warnings</h2>
          <div className="space-y-4">
            {issuesSummary.broken > 0 && (
              <IssueAlert
                type="error"
                title="Broken Links Detected"
                description={`${issuesSummary.broken} links appear to be broken or returning errors.`}
              />
            )}
            {links.issues.map((issue, index) => (
              <IssueAlert
                key={index}
                type="warning"
                title="Link Issue"
                description={issue}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-4 mt-0">
          <h2 className="text-lg font-medium text-gray-900 mb-4">No Broken Links</h2>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('internal')}
              className={`px-4 py-2 text-sm font-medium border-b-2 
                ${activeTab === 'internal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Internal Links ({links.analysis.internalCount})
            </button>
            <button
              onClick={() => setActiveTab('external')}
              className={`px-4 py-2 text-sm font-medium border-b-2 
                ${activeTab === 'external'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              External Links ({links.analysis.externalCount})
            </button>
            <button
              onClick={() => setActiveTab('other')}
              className={`px-4 py-2 text-sm font-medium border-b-2 
                ${activeTab === 'other'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Other Links ({links.analysis.otherCount})
            </button>
            <button
              onClick={() => setActiveTab('broken')}
              className={`px-4 py-2 text-sm font-medium border-b-2 
                ${activeTab === 'broken'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Broken Links ({issuesSummary.broken})
            </button>
          </nav>
        </div>

        {/* Links Table */}
        <div className="overflow-x-auto mt-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[50%]">
                  URL
                </th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">
                  Text & Attributes
                </th>
                <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(() => {
                switch (activeTab) {
                  case 'internal':
                    return links.internal.map((link, index) => (
                      <LinkRow key={index} link={link} type="internal" isBroken={brokenLinks[link.href]} />
                    ));
                  case 'external':
                    return links.external.map((link, index) => (
                      <LinkRow key={index} link={link} type="external" isBroken={brokenLinks[link.href]} />
                    ));
                  case 'other':
                    return links.otherLinks.map((link, index) => (
                      <LinkRow key={index} link={link} type="other" isBroken={brokenLinks[link.href]} />
                    ));
                  case 'broken':
                    return Object.keys(brokenLinks).filter(link => brokenLinks[link]).map((link, index) => (
                      <LinkRow key={index} link={{ href: link, text: 'Broken Link', status: 'broken', attributes: { rel: [] } }} type="broken" isBroken={true} />
                    ));
                }
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LinkRow({ link, type, isBroken }: { link: BaseLink; type: 'internal' | 'external' | 'other' | 'broken'; isBroken?: boolean }) {
  const getLinkIcon = () => {
    if (type === 'internal') return <Link className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />;
    if (type === 'external') return <ExternalLink className="h-4 w-4 text-blue-500 flex-shrink-0 mt-1" />;
    
    // Icon selection for other links based on protocol
    const protocol = link.protocol?.replace(':', '');
    switch (protocol) {
      case 'tel':
        return <Phone className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />;
      case 'mailto':
        return <Mail className="h-4 w-4 text-orange-500 flex-shrink-0 mt-1" />;
      case 'whatsapp':
      case 'telegram':
        return <MessageCircle className="h-4 w-4 text-purple-500 flex-shrink-0 mt-1" />;
      default:
        return <Link className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />;
    }
  };

  return (
    <tr className={isBroken ? 'bg-red-50' : ''}>
      <td className="px-2 py-1">
        <div className="flex items-start space-x-2">
          {getLinkIcon()}
          <a 
            href={link.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 hover:text-blue-800 break-all"
          >
            {link.href}
          </a>
        </div>
      </td>
      <td className="px-2 py-1">
        <div className="space-y-1">
          <p className={`text-sm font-medium ${link.text === 'No text' ? 'text-red-500' : 'text-gray-900'}`}>
            {link.text}
          </p>
          <div className="text-xs text-gray-500">
            {link.attributes.rel.length > 0 && (
              <p>Rel: {link.attributes.rel.join(', ')}</p>
            )}
            {link.attributes.title && <p>Title: {link.attributes.title}</p>}
          </div>
        </div>
      </td>
      <td className="px-2 py-1 whitespace-nowrap">
        <StatusBadge status={isBroken ? 'broken' : link.status} />
        {link.issues && link.issues.length > 0 && (
          <div className="mt-1">
            <Tooltip content={link.issues.join('\n')}>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </Tooltip>
          </div>
        )}
      </td>
    </tr>
  );
}

// Helper Components
function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-red-50 text-red-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className={`rounded-full p-2 ${colorClasses[color as keyof typeof colorClasses]}`}>{icon}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
      <div className="mt-2 text-sm text-gray-500">{title}</div>
    </div>
  );
}

function IssueAlert({ type, title, description }: { type: 'error' | 'warning'; title: string; description: string }) {
  const styles = {
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <div className={`${styles[type]} p-4 rounded-lg border`}>
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="mt-1 text-sm">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: 'ok' | 'invalid_url' | 'broken' }) {
  const styles = {
    ok: 'bg-green-100 text-green-800',
    invalid_url: 'bg-yellow-100 text-yellow-800',
    broken: 'bg-red-100 text-red-800',
  };

  const displayText = {
    ok: 'OK',
    invalid_url: 'INVALID',
    broken: 'BROKEN'
  };

  return (
    <span className={`${styles[status]} px-2 py-1 text-xs font-medium rounded-full`}>
      {displayText[status]}
    </span>
  );
}

function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  return (
    <div className="group relative flex">
      {children}
      <span className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 hidden group-hover:block w-48 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-pre-line">
        {content}
      </span>
    </div>
  );
}