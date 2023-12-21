"use client";

import { Card } from "@nextui-org/react";

import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddCard({ onPress }: { onPress: () => void }) {
  return (
    <Card
      isPressable
      className="flex items-center justify-center p-5 rounded-full bg-sky-500 hover:bg-sky-600 aspect-square shadow-lg hover:shadow-2xl transition-all"
      onPress={onPress}
    >
      <PlusIcon className="h-8 w-8" color="white" />
    </Card>
  );
}
