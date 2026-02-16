const techs = [
  { name: "React", color: "#61DAFB", path: "M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 3a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm-7 7c0-1.38.56-2.63 1.46-3.54L12 12l-5.54 3.54A4.98 4.98 0 015 12z" },
  { name: "Laravel", color: "#FF2D20", path: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" },
  { name: "Docker", color: "#2496ED", path: "M4 16s1-1 4-1 4.5 2 8 2 4-1 4-1M2 12h20M12 2v10" },
  { name: "Python", color: "#3776AB", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z" },
  { name: "C++", color: "#00599C", path: "M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L19 9v6l-7 3.82L5 15V9l7-4.82z" },
  { name: "Arduino", color: "#00979D", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 13H8v-2h2v2zm0-4H8V9h2v2zm6 4h-2v-2h2v2zm0-4h-2V9h2v2z" },
  { name: "Raspberry Pi", color: "#A22846", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" },
  { name: "AWS", color: "#FF9900", path: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 15l-6-3V8l6-3 6 3v6l-6 3z" },
];

const TechTicker = () => {
  return (
    <section className="overflow-hidden border-y border-border/50 py-8">
      <div className="animate-marquee flex w-max items-center gap-16">
        {[...techs, ...techs].map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="group flex flex-col items-center gap-2"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 fill-none stroke-muted-foreground transition-colors duration-300 group-hover:stroke-foreground"
              strokeWidth="1.5"
              style={{ ["--brand-color" as string]: tech.color }}
            >
              <path
                d={tech.path}
                className="transition-all duration-300 group-hover:[stroke:var(--brand-color)]"
              />
            </svg>
            <span className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechTicker;
