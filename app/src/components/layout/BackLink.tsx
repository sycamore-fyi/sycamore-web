import { Link, To } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";

export default function BackLink(props: { to: To; children: ReactNode; }) {
  return (
    <Link to={props.to} className="inline-flex font-semibold gap-2 hover:opacity-60">
      <ArrowLeft />
      {props.children}
    </Link>
  );
}
