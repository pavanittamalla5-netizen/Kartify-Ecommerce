import { motion } from "framer-motion";

const blobs = [
  { c: "#7F5AF0", pos: { top: -80, left: -100 }, x: 80, y: 60 },
  { c: "#2CB67D", pos: { top: "35%", right: -140 }, x: -70, y: 80 },
  { c: "#FF8906", pos: { bottom: -120, left: "15%" }, x: 60, y: -70 },
];

export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute w-80 h-80 rounded-full opacity-50 blur-[80px]"
          style={{ background: b.c, ...b.pos }}
          animate={{ x: [0, b.x, 0], y: [0, b.y, 0] }}
          transition={{ duration: 14 + i * 3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}