"use client";

import { AppHero } from "../ui/ui-layout";
import { useRouter } from "next/navigation";

export default function DashboardFeature() {
  const router = useRouter()

  return (
    <div>
      <AppHero
        title="Hey Welcome To Sol Journal"
        subtitle="decentralized way to write your journal"
      />
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <p>get started</p>
        <button
          onClick={() => {router.push("/soljournal")}}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-8"
        >
          Go to Sol Journal
        </button>
      </div>
    </div>
  );
}
