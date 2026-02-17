import { useState } from "react";
import {
  SiReact,
  SiLaravel,
  SiDocker,
  SiPython,
  SiCplusplus,
  SiArduino,
  SiRaspberrypi,
  SiNodedotjs,
} from "@icons-pack/react-simple-icons";

const TechTicker = () => {
  const techs = [
    { name: "React", color: "#61DAFB", Icon: SiReact },
    { name: "Laravel", color: "#FF2D20", Icon: SiLaravel },
    { name: "Docker", color: "#2496ED", Icon: SiDocker },
    { name: "Python", color: "#3776AB", Icon: SiPython },
    { name: "C++", color: "#00599C", Icon: SiCplusplus },
    { name: "Arduino", color: "#00979D", Icon: SiArduino },
    { name: "Raspberry Pi", color: "#A22846", Icon: SiRaspberrypi },
    { name: "Node.js", color: "#5FA04E", Icon: SiNodedotjs },
  ];

  return (
    <section className="py-16 overflow-hidden">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Tech Stack</h2>
        <div className="relative">
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
            {[...techs, ...techs, ...techs].map((tech, index) => (
              <TechIcon key={`${tech.name}-${index}`} tech={tech} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TechIcon = ({ tech }: { tech: { name: string; color: string; Icon: React.ComponentType<{ color?: string; size?: number }> } }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center gap-2 mx-8 min-w-[80px] flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <tech.Icon
        size={32}
        color={isHovered ? tech.color : "hsl(var(--muted-foreground))"}
        className="transition-colors duration-300"
      />
      <span className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground whitespace-nowrap">
        {tech.name}
      </span>
    </div>
  );
};

export default TechTicker;
