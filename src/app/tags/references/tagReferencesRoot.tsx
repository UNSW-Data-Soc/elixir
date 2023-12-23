"use client";

import { useState } from "react";

import TagReferencesList from "./tagReferencesList";

export default function TagReferencesRoot() {
  return (
    <>
      <TagReferencesList styleLarge={true} />
    </>
  );
}
