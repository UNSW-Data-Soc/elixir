"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TagReferencesList from "./tagReferencesList";

export default function TagReferencesRoot() {
  const session = useSession();
  const [showEditingTools, setShowEditingTools] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated" && session.data.user.moderator) {
      setShowEditingTools(true);
    }
  }, [session.status]);

  return (
    <TagReferencesList styleLarge={true} showEditingTools={showEditingTools} />
  );
}
