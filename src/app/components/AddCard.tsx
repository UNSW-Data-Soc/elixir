"use client";

import { Card } from "@nextui-org/react";

import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddCard({
  onPress,
  text = "",
}: {
  onPress: () => void;
  text?: string;
}) {
  return (
    <Card
      isPressable
      className="flex flex-row items-center justify-center gap-2 rounded-3xl bg-sky-500 p-5 text-xl text-white shadow-lg transition-all hover:bg-sky-600 hover:shadow-2xl"
      onPress={onPress}
    >
      <PlusIcon className="h-8 w-8" color="white" />
      {text}
    </Card>
  );
}
