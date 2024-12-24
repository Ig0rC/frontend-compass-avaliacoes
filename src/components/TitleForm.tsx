interface Props {
  title: string;
}

export function TitleForm({ title }: Props) {
  return <h1 className="mt-9 w-full text-[22px] leading-[33px] mb-8	 text-grey-500">{title}</h1>
}
