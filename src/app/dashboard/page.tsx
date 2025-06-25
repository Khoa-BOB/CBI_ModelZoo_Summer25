"use client";

import React, { useEffect, useState } from "react";
import SummaryCard from "@/components/Dashboard/SummaryCard";
import ModelTable from "@/components/Dashboard/TrendModelTable";
import ModelUsageChart from "@/components/Dashboard/ModelUsageChart";
import { RocketIcon, LayersIcon, BackpackIcon, ReaderIcon } from "@radix-ui/react-icons";
import { useHyphaStore } from "@/store/hyphaStore";
import ResourceDonutChart from "@/components/Dashboard/ResourceDonutChart";
import { ArtifactInfo } from "@/types/artifact";

export default function Dashboard() {
  const {
    setResources,
    fetchResources,
    setResourceType,
    isLoading,
    itemsPerPage
  } = useHyphaStore();

  const [counts, setCounts] = useState({
    model: 0,
    dataset: 0,
    application: 0,
    notebook: 0
  });

  const [allModels, setAllModels] = useState<ArtifactInfo[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      setResources([]);
      setAllModels([]);
      useHyphaStore.setState({ isLoading: true });

      try {
        // Fetch dataset, application, notebook counts
        const types = ["dataset", "application", "notebook"];
        const countResults = await Promise.all(
          types.map(async (type) => {
            setResourceType(type);
            await fetchResources(1);
            const { totalItems } = useHyphaStore.getState();
            return { type, total: totalItems };
          })
        );

        // Fetch all models manually
        const allModelItems: ArtifactInfo[] = [];
        let page = 1;
        let hasMore = true;
        let modelTotal = 0;

        while (hasMore) {
          const offset = (page - 1) * itemsPerPage;
          let url = `https://hypha.aicell.io/bioimage-io/artifacts/bioimage.io/children?pagination=true&offset=${offset}&limit=${itemsPerPage}&stage=false`;
          
          const filters = { type: "model" };
          url += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;

          const response = await fetch(url);
          const data = await response.json();

          if (data.items && data.items.length > 0) {
            allModelItems.push(...data.items);
            modelTotal = data.total || modelTotal;

            if (data.items.length < itemsPerPage) {
              hasMore = false;
            } else {
              page++;
            }
          } else {
            hasMore = false;
          }
        }

        // Update counts
        const newCounts = {
          model: modelTotal,
          dataset: 0,
          application: 0,
          notebook: 0
        };

        countResults.forEach(({ type, total }) => {
          if (type === "dataset" || type === "application" || type === "notebook") {
            newCounts[type] = total;
          }
        });

        setCounts(newCounts);
        setAllModels(allModelItems);
        setResources(allModelItems);
        useHyphaStore.setState({ isLoading: false });

      } catch (err) {
        console.error("Error loading dashboard data:", err);
        useHyphaStore.setState({ isLoading: false });
      }
    }

    loadDashboardData();
  }, [fetchResources, setResourceType, setResources, itemsPerPage]);

  const pieData = [
    { name: "Models", value: counts.model },
    { name: "Datasets", value: counts.dataset },
    { name: "Applications", value: counts.application },
    { name: "Notebooks", value: counts.notebook }
  ].filter(item => item.value > 0);

  const totalResources = pieData.reduce((sum, item) => sum + item.value, 0);

  const frequentlyUsedModels = allModels
    .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
    .slice(0, 10)
    .map(model => ({
      name: model.manifest?.name || "Unnamed Model",
      usage: model.download_count || 0,
      lastUsed: new Date(model.last_modified).toISOString().split("T")[0]
    }));

  return (
    <section className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mt-6">
          <ResourceDonutChart data={pieData} total={totalResources} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            href="/models"
            title="Models"
            value={isLoading ? "..." : counts.model}
            icon={<RocketIcon />}
            bg="bg-blue-50"
          />
          <SummaryCard
            href="/datasets"
            title="Datasets"
            value={isLoading ? "..." : counts.dataset}
            icon={<LayersIcon />}
            bg="bg-green-50"
          />
          <SummaryCard
            href="/applications"
            title="Applications"
            value={isLoading ? "..." : counts.application}
            icon={<BackpackIcon />}
            bg="bg-yellow-50"
          />
          <SummaryCard
            href="/notebooks"
            title="Notebooks"
            value={isLoading ? "..." : counts.notebook}
            icon={<ReaderIcon />}
            bg="bg-yellow-50"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Frequently Used Models</h2>
          {isLoading && allModels.length === 0 ? (
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
