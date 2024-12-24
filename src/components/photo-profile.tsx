import photoUser from '@/assets/images/photo-user.jpeg';
import { cn } from '@/lib/utils';

interface PhotoProfileProps {
  className?: string;
  classNamePhoto?: string;
  url: string | undefined | null;
}

export function PhotoProfile({ className, classNamePhoto, url }: PhotoProfileProps) {
  return (
    <div className={cn("h-36 w-36 bg-primary rounded-full relative", className)}>
      <img
        src={url || photoUser}
        className={cn("rounded-full h-32 w-32 absolute top-0 bottom-0 left-0 right-0 m-auto object-cover", classNamePhoto)}
      />
    </div>
  )
}