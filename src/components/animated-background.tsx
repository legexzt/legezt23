export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 h-full w-full">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.15),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(-45deg,hsl(var(--primary)/0.2),hsl(var(--accent)/0.2),hsl(var(--primary)/0.1),hsl(var(--accent)/0.1))] bg-[size:400%_400%] animate-move-bg opacity-50" />
    </div>
  );
};
