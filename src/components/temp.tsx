'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useHyphaStore } from '@/store/hyphaStore';
import ReactMarkdown from 'react-markdown';
import { resolveHyphaUrl } from '@/utils/urlHelpers';
import { ArtifactInfo } from '@/types/artifact';
import { FileIcon, DownloadIcon, Link1Icon, ClockIcon } from '@radix-ui/react-icons';

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
      <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full" />
      <p className="mt-4 text-lg text-gray-600">Loading Artifact Details...</p>
    </div>
  );

  if (!selectedResource) return <div>Artifact not found</div>;

  const { manifest } = selectedResource as ArtifactInfo;
  const slideCount = safeCovers.length;
  const radius = 300;

  return (
    <div className="px-4 py-8 space-y-8">
      {/* HEADER */}
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <span className="text-2xl">{manifest.id_emoji}</span>
          {manifest.name}
        </h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">ID:</span>
          <code className="bg-gray-100 px-2 py-0.5 rounded select-all">{selectedResource.id.split('/').pop()}</code>
          <button onClick={handleCopyId} title="Copy ID" className="p-1 hover:bg-gray-200 rounded">
            <FileIcon className="w-4 h-4" />
          </button>
          {showCopied && <span className="text-green-600 text-sm">Copied!</span>}
        </div>
      </header>

      {/* DESCRIPTION & ACTIONS */}
      <section className="space-y-4">
        <p className="text-base text-gray-700">{manifest.description}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownload} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            <DownloadIcon className="w-4 h-4" /> Download
          </button>
          <button onClick={handleViewSource} className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition">
            <Link1Icon className="w-4 h-4" /> View Source
          </button>
          {manifest.type === 'model' && (
            <>
              <button className="px-4 py-2 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition">Model Tester</button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition">Model Runner</button>
            </>
          )}
          {latestVersion && (
            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              <ClockIcon className="w-4 h-4" /> Version: {latestVersion.version}
            </div>
          )}
        </div>
      </section>

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
      {documentation && (
        <section className="prose lg:prose-xl">
          <ReactMarkdown>{documentation}</ReactMarkdown>
        </section>
      )}

      {/* RDF DIALOG */}
      {isRdfDialogOpen && (
        <dialog open className="p-6 rounded-lg shadow-2xl w-11/12 max-w-lg">
          <pre className="whitespace-pre-wrap text-sm">{rdfContent}</pre>
          <button onClick={() => setIsRdfDialogOpen(false)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Close</button>
        </dialog>
      )}
    </div>
  );
}
