import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  pathTo: string;
}

export function ContainerFormLayout({ children, pathTo }: Props) {
  return (
    <div className="flex justify-center h-full ">
      <div className="max-w-[964px] w-full h-full mt-12 px-3 ">
        <header className="flex flex-col">
          <Link className="text-blue-customBlue flex items-center gap-[6px]" to={pathTo}>
            <ArrowLeft />
            Ínicio
          </Link>
        </header>

        {children}
      </div>
    </div>
  )
}