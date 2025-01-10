import logo from "@/assets/images/logo.png";
import { PhotoProfile } from "@/components/photo-profile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IUsersSupplier } from "@/entities/i-user-supplier";
import { UserService } from "@/services/user-service";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { toast } from "sonner";

export function HeaderListLayout() {
  const [user, setUser] = useState<IUsersSupplier | null>(null);
  useEffect(() => {
    UserService.findProfileData().then(data => {
      setUser(data);
    }).catch(() => {
      toast.error('Erro ao carregar dados do usuário')
    })
  }, [])

  return (
    <div className="px-[40px] box-border w-full m-auto h-full flex flex-col bg-[#FAFAFA]">
      <header className="bg-grey-50 flex justify-between items-center">

        <Link to="/profile-user" className="flex justify-between items-center gap-6">
          <PhotoProfile
            classNamePhoto="max-w-16 max-h-16 w-full h-full"
            className="max-w-20 max-h-20"
            url={user?.additionalInfo.userAdditionalUrlPicture}
          />
          <p>{user?.username}</p>
        </Link>
        <div>
          <img
            src={logo}
            alt="logo"
            className="max-w-[228px] w-full h-[109px]"
          />
        </div>
        <div>
          <Popover>
            <PopoverTrigger>
              <Bell className="w-9 h-9" color="#424242" />
            </PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
          </Popover>
        </div>
      </header>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
