"use client";

import React, { useEffect } from "react";
import SummaryCard from "@/components/Dashboard/SummaryCard";
import ModelTable from "@/components/Dashboard/TrendModelTable";
import ModelUsageChart from "@/components/Dashboard/ModelUsageChart";
import { RocketIcon, LayersIcon, BackpackIcon, ReaderIcon } from "@radix-ui/react-icons";
import { useHyphaStore } from "@/store/hyphaStore";
import ResourceDonutChart from "@/components/Dashboard/ResourceDonutChart";

export default function Dashboard() {
  const {
    resources,
    resourceType,
    isLoading,
    setResources,
    fetchResources,
    setTotalItems
  } = useHyphaStore();

  async function fetchAllOfType(type: string) {
    let page = 1;
    let hasMore = true;
    const itemsPerPage = 12;
    let accumulated: any[] = [];

    while (hasMore) {
      const offset = (page - 1) * itemsPerPage;

      let url = `https://hypha.aicell.io/bioimage-io/artifacts/bioimage.io/children?pagination=true&offset=${offset}&limit=${itemsPerPage}&stage=false`;
      const filters = { type };
      url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${type} resources`);
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        hasMore = false;
      } else {
        accumulated = [...accumulated, ...data.items];
        page++;
        if (data.items.length < itemsPerPage) {
          hasMore = false; // last page
        }
      }
    }

    return accumulated;
  }

  useEffect(() => {
    async function loadAllResources() {
      setResources([]);
      setTotalItems(0);
      useHyphaStore.setState({ isLoading: true });

      try {
        // Fetch each type fully and accumulate
        const [models, datasets, applications, notebooks] = await Promise.all([
          fetchAllOfType("model"),
          fetchAllOfType("dataset"),
          fetchAllOfType("application"),
          fetchAllOfType("notebook"),
        ]);

        const all = [...models, ...datasets, ...applications,...notebooks];

        useHyphaStore.setState({
          resources: all,
          totalItems: all.length,
          isLoading: false
        });

      } catch (err) {
        console.error("Error loading resources:", err);
        useHyphaStore.setState({ isLoading: false });
      }
    }

    loadAllResources();
  }, [setResources, setTotalItems]);

  // Calculate counts
  const totalModels = resources.filter(r => r.type === "model").length;
  const totalDatasets = resources.filter(r => r.type === "dataset").length;
  const totalApplications = resources.filter(r => r.type === "application").length;
  const totalNotebooks = resources.filter(r => r.type === "notebook").length;

  // Top models
  const frequentlyUsedModels = resources
    .filter(r => r.type === "model")
    .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
    .slice(0, 10)
    .map(model => ({
      name: model.manifest.name,
      usage: model.download_count || 0,
      lastUsed: new Date(model.last_modified).toISOString().split("T")[0]
    }));


  const pieData = [
    { name: "Models", value: totalModels },
    { name: "Datasets", value: totalDatasets },
    { name: "Applications", value: totalApplications },
    { name: "Notebooks", value: totalNotebooks }
  ].filter(item => item.value > 0);

  const totalResources = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mt-6">
          <ResourceDonutChart data={pieData} total={totalResources} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            title="Models"
            value={isLoading ? "..." : totalModels}
            icon={<RocketIcon />}
            bg="bg-blue-50"
          />

          <SummaryCard
            title="Datasets"
            value={isLoading ? "..." : totalDatasets}
            icon={<LayersIcon />}
            bg="bg-green-50"
          />

          <SummaryCard
            title="Applications"
            value={isLoading ? "..." : totalApplications}
            icon={<BackpackIcon />}
            bg="bg-yellow-50"
          />

          <SummaryCard
            title="Notebooks"
            value={isLoading ? "..." : totalNotebooks}
            icon={<ReaderIcon />}
            bg="bg-yellow-50"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Frequently Used Models</h2>
          {isLoading && resources.length === 0 ? (
            <div className="text-gray-500 text-sm">Loading models...</div>
          ) : frequentlyUsedModels.length === 0 ? (
            <div className="text-gray-500 text-sm">No models found.</div>
          ) : (
            <ModelTable models={frequentlyUsedModels} />
          )}
        </div>

        <div className="mt-6">
          <ModelUsageChart data={frequentlyUsedModels} />
        </div>
      </div>
    </section>
  );
}
