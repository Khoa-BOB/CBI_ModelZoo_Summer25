'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useHyphaStore } from '@/store/hyphaStore';
import ReactMarkdown from 'react-markdown';
import { resolveHyphaUrl } from '@/utils/urlHelpers';
import { ArtifactInfo } from '@/types/artifact';
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { FileIcon, DownloadIcon, Link1Icon, ClockIcon, Cross2Icon, PersonIcon, IdCardIcon, EyeOpenIcon, DrawingPinFilledIcon} from '@radix-ui/react-icons';

export default function ResourceDetail() {
  const { id, version } = useParams<{ id: string; version?: string }>();
  const { selectedResource, fetchResource, isLoading } = useHyphaStore();

  const [documentation, setDocumentation] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [latestVersion, setLatestVersion] = useState<{ version: string; comment: string; created_at: number } | null>(null);
  const [rdfContent, setRdfContent] = useState<string | null>(null);
  const [isRdfDialogOpen, setIsRdfDialogOpen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [hover, setHover] = useState(false);

  const autoAdvanceInterval = 2500;
  const safeCovers = selectedResource?.manifest?.covers ?? [];
  const safeDocumentation = selectedResource?.manifest?.documentation ?? null;
  const authors = selectedResource?.manifest?.authors ?? [];
  const cite = selectedResource?.manifest?.cite ?? [];
  const tags = selectedResource?.manifest?.tags ?? [];

  // Load resource
  useEffect(() => {
    if (id) fetchResource(`bioimage-io/${id}`, version);
  }, [id, version, fetchResource]);

  // Fetch docs
  useEffect(() => {
    if (!safeDocumentation) {
      setDocumentation('No documentation found.');
      return;
    }
    (async () => {
      try {
        const url = resolveHyphaUrl(safeDocumentation, selectedResource!.id);
        const txt = await fetch(url).then(res => res.text());
        setDocumentation(txt);
      } catch {
        setDocumentation('Failed to fetch documentation.');
      }
    })();
  }, [safeDocumentation, selectedResource]);

  // Latest version
  useEffect(() => {
    if (selectedResource?.versions?.length) {
      setLatestVersion(selectedResource.versions.at(-1) ?? null);
    }
  }, [selectedResource]);

  // Auto-advance
  useEffect(() => {
    if (!safeCovers.length || hover) return;
    const timer = setInterval(() => {
      setCurrentImageIndex(i => (i + 1) % safeCovers.length);
    }, autoAdvanceInterval);
    return () => clearInterval(timer);
  }, [safeCovers, hover]);

  // Handlers
  const handleDownload = () => {
    const artifactId = selectedResource?.id.split('/').pop();
    if (!artifactId) return;
    let url = `https://hypha.aicell.io/bioimage-io/artifacts/${artifactId}/create-zip-file`;
    if (version && version !== 'latest') url += `?version=${version}`;
    window.open(url, '_blank');
  };

  const handleViewSource = async () => {
    if (!selectedResource?.id) return;
    try {
      const rdfUrl = resolveHyphaUrl('rdf.yaml', selectedResource.id);
      const text = await fetch(rdfUrl).then(res => res.text());
      setRdfContent(text);
      setIsRdfDialogOpen(true);
    } catch {}
  };

  const handleCopyId = () => {
    const aid = selectedResource?.id.split('/').pop() || '';
    navigator.clipboard.writeText(aid);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center w-full min-h-[calc(100vh-200px)]">
      <div className="animate-spin h-10 w-10 border-4 border-[var(--secondary)] border-t-[var(--accent)] rounded-full" />
      <p className="mt-4 text-lg text-[var(--secondary)]">Loading Artifact Details...</p>
    </div>
  );

  if (!selectedResource) return <div className="text-[var(--foreground)]">Artifact not found</div>;

  const { manifest } = selectedResource as ArtifactInfo;
  const slideCount = safeCovers.length;
  const radius = 300;

  const formatDate = (ts: number) =>
    new Date(ts * 1000).toLocaleString();

  return (
    <div className="px-4 py-8 space-y-8 text-[var(--foreground)]">
      {/* ─── HERO PANEL (HEADER + DESCRIPTION + ACTIONS) ───────────────────────── */}
<div
  className="
    bg-[var(--chart-background)]
    border-l-4 border-rose-500
    rounded-2xl shadow-md p-6
    grid grid-cols-1 md:grid-cols-3 gap-6
  "
>
  {/* LEFT: Icon + Title + ID + Version */}
  <div className="flex items-start gap-4 md:col-span-2">
    <div className="text-blue-500 text-4xl">{manifest.id_emoji}</div>
    <div className="flex-1 space-y-1">
      <h1 className="text-3xl font-bold text-[var(--foreground)]">
        {manifest.name}
      </h1>
      <div className="flex items-center gap-2 text-sm text-[var(--foreground)">
        <span className="font-medium">ID:</span>
        <code className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded select-all text-gray-900 dark:text-gray-100">
          {selectedResource.id.split('/').pop()}
        </code>
        <button
          onClick={handleCopyId}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
          title="Copy ID"
        >
          <FileIcon className="w-5 h-5 text-[var(--foreground)" />
        </button>
        {showCopied && (
          <span className="text-rose-500">Copied!</span>
        )}
      </div>

      {latestVersion && (
        <div className="inline-flex items-center gap-1 bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm">
          <ClockIcon className="w-4 h-4" />
          {latestVersion.version}
        </div>
      )}
    </div>
  </div>

  {/* MIDDLE: Description */}
  <div className="md:col-span-3 lg:col-span-2 text-[var(--foreground)">
    <p className="text-base">{manifest.description}</p>
  </div>

  {/* ACTION BUTTONS — full width row, aligned right */}
  <div className="md:col-span-3 flex justify-end flex-wrap gap-4">
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 bg-rose-100 hover:bg-rose-300 !text-[var(--foreground) px-6 py-2 rounded-full shadow transition"
    >
      <DownloadIcon className="w-5 h-5" />
      Download
    </button>

    <button
      onClick={handleViewSource}
      className="inline-flex items-center gap-2 bg-gray-300 hover:bg-gray-700 !text-[var(--foreground) px-6 py-2 rounded-full shadow-sm transition"
    >
      <Link1Icon className="w-5 h-5" />
      View Source
    </button>

    {manifest.type === 'model' && (
      <>
        <button
          className="px-6 py-2 bg-rose-100 hover:bg-rose-300 !text-[var(--foreground) rounded-full shadow-sm transition"
        >
          Model Tester
        </button>
        <button
          className="px-6 py-2 bg-gray-300 hover:bg-gray-700 !text-[var(--foreground) rounded-full shadow-sm transition"
        >
          Model Runner
        </button>
      </>
    )}
  </div>
</div>







{/* 3D CAROUSEL */}
      {slideCount > 0 && (
        <section className="relative max-w-3xl mx-auto overflow-hidden h-96">
          <div
            className="w-full h-full relative overflow-hidden"
            style={{ perspective: '1200px' }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                transform: `translateZ(${-radius}px) rotateY(${-currentImageIndex * (360 / slideCount)}deg)`,
                transition: 'transform 1s ease'
              }}
            >
              {safeCovers.map((url, i) => {
                const angle = (360 / slideCount) * i;
                return (
                  <div key={i} className="absolute top-0 left-0 w-full h-full" style={{ transform: `rotateY(${angle}deg) translateZ(${radius}px)` }}>
                    <img src={resolveHyphaUrl(url, id)} alt={`slide-${i}`} className="w-full h-full object-contain object-center" style={{ opacity: i === currentImageIndex ? 1 : 0.5 }} />
                  </div>
                );
              })}
            </div>
            <button onClick={() => setCurrentImageIndex((currentImageIndex - 1 + slideCount) % slideCount)} className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-gray-700 transition">←</button>
            <button onClick={() => setCurrentImageIndex((currentImageIndex + 1) % slideCount)} className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full hover:bg-gray-700 transition">→</button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">{currentImageIndex + 1}/{slideCount}</div>
          </div>
        </section>
      )}

      {/* DOCUMENTATION */}
      {/* {documentation && (
        <section className="bg-[var(--chart-background)] rounded-2xl shadow-lg p-6">
          <div className="prose prose-[var(--foreground)] dark:prose-invert lg:prose-xl">
            <ReactMarkdown>
              {documentation}
            </ReactMarkdown>
          </div>
        </section>
      )} */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
      {/* DOCUMENTATION */}
      {documentation && (
        <section className="bg-[var(--chart-background)] rounded-2xl shadow-lg p-6 md:col-span-8">
          <div className="prose prose-[var(--foreground)] dark:prose-invert lg:prose-xl">
            <ReactMarkdown>
              {documentation}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* SIDEBAR */}
      <div className="md:col-span-4 space-y-6">
        {/* Versions */}
        {selectedResource.versions?.length > 0 && (
          <div className="bg-[var(--chart-background)] dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Versions</h2>
            <ul className="space-y-4">
              {[...selectedResource.versions]
                .reverse()
                .map((v, i) => (
                  <li key={v.version} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <NextLink
                        href={`/artifacts/${selectedResource.id.split('/').pop()}/${v.version}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {v.version}
                      </NextLink>
                      {v.version === latestVersion?.version && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(v.created_at)}
                    </p>
                    {v.comment && <p className="text-sm">{v.comment}</p>}
                    {i < selectedResource.versions.length - 1 && (
                      <hr className="border-gray-200 dark:border-gray-700 my-2" />
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Authors */}
        {authors.length > 0 && (
          <div className="bg-[var(--chart-background)] dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <PersonIcon className="mr-2" /> Authors
            </h2>
            <ul className="space-y-6">
              {authors.map((a, i) => (
                <li key={i} className="space-y-1">
                  <p className="font-medium">{a.name}</p>
                  {a.orcid && (
                    <NextLink
                      href={`https://orcid.org/${a.orcid}`}
                      target="_blank"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      ORCID: {a.orcid}
                    </NextLink>
                  )}
                  {a.affiliation && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <IdCardIcon className="mr-1" />
                      {a.affiliation}
                    </p>
                  )}
                  {i < authors.length - 1 && (
                    <hr className="border-gray-200 dark:border-gray-700 my-2" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-[var(--chart-background)] rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Statistics</h2>
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center text-sm px-3 py-1 rounded-full bg-[var(--accent)]/20 text-[var(--accent)]">
              <DownloadIcon className="mr-2" />
              Downloads: {selectedResource.download_count}
            </span>
            <span className="inline-flex items-center text-sm px-3 py-1 rounded-full bg-[var(--accent)]/20 text-[var(--accent)]">
              <EyeOpenIcon className="mr-2" />
              Views: {selectedResource.view_count}
            </span>
          </div>
        </div>

        {/* Citations */}
        {cite.length > 0 && (
          <div className="bg-[var(--chart-background)] dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Citations</h2>
            <ul className="space-y-4">
              {cite.map((c, i) => (
                <li key={i} className="space-y-1">
                  <p className="text-sm">{c.text}</p>
                  {c.doi && (
                    <NextLink
                      href={`https://doi.org/${c.doi}`}
                      target="_blank"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      DOI: {c.doi}
                    </NextLink>
                  )}
                  {i < cite.length - 1 && (
                    <hr className="border-gray-200 dark:border-gray-700 my-2" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="bg-[var(--chart-background)] dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <DrawingPinFilledIcon className="mr-2" /> Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-sm bg-[var(--accent)]/20 text-[var(--accent)] px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {manifest.git_repo && (
          <div className="bg-[var(--chart-background)] rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Link1Icon className="mr-2" /> Links
            </h2>
            <ul className="space-y-2">
              <li>
                <NextLink
                  href={manifest.git_repo}
                  target="_blank"
                  className="text-sm hover:underline"
                >
                  GitHub Repository
                </NextLink>
              </li>
            </ul>
          </div>
        )}

        {/* License */}
        {manifest.license && (
          <div className="bg-[var(--chart-background)] rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-2">License</h2>
            <p className="text-sm">{manifest.license}</p>
          </div>
        )}
      </div>
    </div>

      {/* RDF DIALOG */}
      {isRdfDialogOpen && (
        <dialog open className="fixed inset-0 m-auto w-11/12 max-w-lg p-6 bg-[var(--chart-background)] rounded-2xl shadow-2xl">
          <button onClick={() => setIsRdfDialogOpen(false)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-[var(--chart-background)] transition">
            <Cross2Icon className="w-5 h-5 text-[var(--secondary)]" />
          </button>
          <pre className="whitespace-pre-wrap text-sm text-[var(--foreground)] max-h-[60vh] overflow-auto">
            {rdfContent}
          </pre>
        </dialog>
      )}
    </div>
  );
}
