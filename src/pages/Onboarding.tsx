import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAppStore } from "@/lib/store";
import { Shield, FileCheck, Lock, CheckCircle2, Users } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, isLoading } = useAuth();
  const { setIsDemo } = useAppStore();

  // If already logged in, redirect to role selection
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/select-role");
    }
  }, [user, isLoading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDemo = () => {
    setIsDemo(true);
    navigate("/select-role");
  };

  const trustFeatures = [
    {
      icon: <FileCheck className="w-5 h-5" />,
      title: "법적 효력 보장",
      description: "노동부 표준 양식 기반",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "최신 법률 자동 반영",
      description: "2026년 근로기준법 준수",
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "보안 암호화 저장",
      description: "개인정보 안전하게 보호",
    },
  ];

  const stats = [
    { value: "50,000+", label: "작성된 계약서" },
    { value: "99.9%", label: "서비스 안정성" },
    { value: "4.9", label: "사용자 평점" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-muted border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-primary/[0.03] to-transparent" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 pt-12 pb-6 relative z-10">
        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-3 gap-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center py-4 px-2 rounded-xl bg-muted/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Features */}
        <motion.div
          className="space-y-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 shadow-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {feature.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {feature.description}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            </motion.div>
          ))}
        </motion.div>

        {/* User Trust Indicator */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center"
              >
                <Users className="w-3.5 h-3.5 text-primary" />
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">1,200+</span> 사업장이 이용 중
          </p>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            variant="toss"
            size="full"
            onClick={handleGoogleLogin}
            className="gap-3 h-14 text-base font-semibold shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            구글로 시작하기
          </Button>

          <Button
            variant="ghost"
            size="full"
            onClick={handleDemo}
            className="text-muted-foreground h-12"
          >
            먼저 둘러볼게요
          </Button>

          <p className="text-xs text-center text-muted-foreground pt-2">
            로그인 시 <span className="underline">이용약관</span> 및{" "}
            <span className="underline">개인정보처리방침</span>에 동의합니다
          </p>
        </motion.div>
      </div>
    </div>
  );
}
