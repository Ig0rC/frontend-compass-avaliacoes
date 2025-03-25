
import logo from "@/assets/images/logo.png";
import { PhotoProfile } from "@/components/photo-profile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { IUser } from "@/entities/i-user-supplier";
import { INotifications, NotificationService } from "@/services/notification-service";
import { UserService } from "@/services/user-service";
import { PopoverClose } from "@radix-ui/react-popover";
import { Bell, BellRing, CircleCheck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { toast } from "sonner";

export function HeaderListLayout() {
  const [, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [user, setUser] = useState<IUser | null>(null);


  useEffect(() => {
    let data: INotifications[] = [];
    async function loadData() {
      data = await NotificationService.list();
      setNotifications(data);
    }

    loadData();


    const ws = new WebSocket('ws://localhost:3000/notification-ws');// URL do servidor

    ws.onopen = () => {
      console.log('entrou');
      console.log('Conectado ao WebSocket');
    };


    ws.onmessage = async (event) => {
      if (event.data) {
        console.log(data);
        const notificationData = JSON.parse(event.data);

        const newNotification = await NotificationService.findById(notificationData.notificationId);

        const isExistNotification = data.find((notification) => {
          console.log(notification.id, newNotification.id, 'here')
          return notification.id === newNotification.id
        });

        console.log(isExistNotification)
        if (isExistNotification) return;

        setNotifications(prevState => [newNotification, ...prevState])
      }
    };

    ws.onerror = (error) => {
      console.error('Erro:', error);
    };

    ws.onclose = () => {
      console.log('Desconectado');
    };

    setSocket(ws);

    return () => ws.close();
  }, []);

  async function handleReadedNotification(id: number) {
    try {
      await NotificationService.readedNotification(id);

      setNotifications((prevState) => prevState.map((notification) => {
        if (id === notification?.recipients[0]?.id) {
          console.log({
            ...notification,
            recipients: [{
              ...notification.recipients[0],
              status: 'read',
            }]
          })
          return {
            ...notification,
            recipients: [{
              ...notification.recipients[0],
              status: 'read',
            }]
          }
        }

        return notification;
      }));

      toast.success('Notificaçao foi lida!');
    } catch {
      toast.error('Erro para marcar a notificação como lida!')
    }
  }


  useEffect(() => {
    UserService.findProfileData().then(data => {
      setUser(data);
    }).catch(() => {
      toast.error('Erro ao carregar dados do usuário')
    });


  }, [])
  console.log(notifications);
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
              {notifications.find((notification) => notification.recipients[0]?.status === 'unread') ?
                <BellRing className="w-9 h-9 text-red-400 animate-pulse" />
                : <Bell className="w-9 h-9" color="#424242" />}
            </PopoverTrigger>

            <PopoverContent className="mr-2">
              <div className="flex flex-row justify-between mb-4">
                <div className="flex flex-row items-center gap-1">
                  <Bell className="w-5 h-5" color="#424242" />
                  <span className="text-base text-[#424242] font-semibold">Notificações</span>
                </div>
                <PopoverClose>
                  <X className="w-6 h-6" color="#424242" />
                </PopoverClose>
              </div>

              {notifications.map((notification) => (
                <div key={notification.id}>
                  {notification.recipients[0]?.status === 'unread' ?
                    (<div onClick={() => handleReadedNotification(notification.recipients[0].id)} className="cursor-pointer flex gap-2 mb-6">
                      <BellRing className="min-h-5 min-w-5 text-red-400 animate-pulse " />
                      <span className="text-sm">
                        {notification.description}
                      </span>
                    </div>
                    )
                    : (<div className="cursor-pointer flex gap-2 mb-6">
                      <CircleCheck className="text-primary min-h-5 min-w-5 pointer" />
                      <span className="text-sm">
                        {notification.description}
                      </span>
                    </div>)}
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div >
      </header >
      <div className="flex-1">
        <Outlet />
      </div>
    </div >
  );
}
