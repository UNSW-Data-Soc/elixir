"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Swagger({ doc }: { doc: any }) {
  return <SwaggerUI spec={doc} />;
}