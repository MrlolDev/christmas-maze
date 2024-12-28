export default function Button({
  children,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="button mt-2" {...props}>
      {children}
    </button>
  );
}
