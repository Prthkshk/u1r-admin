import { useEffect } from "react";

export default function Products({ mode }) {
  useEffect(() => {}, [mode]);

  const modeLabel =
    mode === "wholesale" ? "Wholesale" : mode === "retail" ? "Retail" : "";
  const heading = modeLabel ? `${modeLabel} Products` : "Products";

  return <h1 className="text-3xl font-bold">{heading}</h1>;
}
