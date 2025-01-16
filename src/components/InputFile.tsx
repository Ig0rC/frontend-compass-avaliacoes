import { Files } from "lucide-react";
import React, { forwardRef } from "react";


const InputFile = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <div className="relative dropzone focus:bg-blue rounded border-dashed border w-full h-[52px] flex items-center justify-center
      focus:bg-black gap-2 hover:bg-white 
      border-primary
    ">
    <input type="file" className=" absolute opacity-0 inset-0 w-full h-full cursor-pointer"  {...props} ref={ref} />
    <Files />
    Clique ou arraste e solte o arquivo!
  </div>
));

export { InputFile };

