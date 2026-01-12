import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <motion.div
        className={cn(
          "rounded-full border-2 border-muted border-t-primary",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <motion.p
          className="text-body text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

interface AIGeneratingProps {
  className?: string;
}

export function AIGenerating({ className }: AIGeneratingProps) {
  const dots = [0, 1, 2];
  const steps = [
    "입력하신 정보를 분석하고 있어요",
    "근로기준법에 맞게 계약서를 구성 중이에요",
    "거의 다 됐어요!"
  ];

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6", className)}>
      <motion.div
        className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        >
          <motion.div
            className="w-6 h-6 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </motion.div>
      </motion.div>

      <motion.h2
        className="text-heading text-foreground mb-2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        사장님이 작성하신 내용을 바탕으로
        <br />
        <span className="text-primary">근로계약서를 작성</span>하고 있어요
      </motion.h2>

      <motion.p
        className="text-caption text-muted-foreground text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        AI가 입력 정보를 정리하여 계약서 양식에 맞게 구성합니다
      </motion.p>

      {/* 진행 단계 표시 */}
      <div className="space-y-2 w-full max-w-xs">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 text-caption"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.5 }}
          >
            <motion.div
              className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"
              animate={{ 
                backgroundColor: ["hsl(var(--primary) / 0.2)", "hsl(var(--primary) / 0.6)", "hsl(var(--primary) / 0.2)"]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
            </motion.div>
            <span className="text-muted-foreground">{step}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-1 mt-6">
        <motion.p
          className="text-body text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          잠시만 기다려주세요
        </motion.p>
        <div className="flex gap-0.5 ml-1">
          {dots.map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      <motion.p
        className="text-xs text-muted-foreground/60 mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        * 법적 검토가 필요하시면 AI 노무사 검토를 이용해주세요
      </motion.p>
    </div>
  );
}
