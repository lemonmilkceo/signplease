import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AllowanceCalculatorProps {
  type: "overtime" | "holiday" | "annualLeave";
  hourlyWage: number;
  dailyWorkHours: number;
  onCalculate: (amount: number) => void;
}

export function AllowanceCalculator({
  type,
  hourlyWage,
  dailyWorkHours,
  onCalculate,
}: AllowanceCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // 연장근로: 월 연장시간
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  
  // 휴일근로: 월 휴일근로시간
  const [holidayHours, setHolidayHours] = useState<number>(0);
  
  // 연차: 미사용 연차일수
  const [unusedAnnualDays, setUnusedAnnualDays] = useState<number>(0);

  const calculateAmount = () => {
    let amount = 0;
    
    switch (type) {
      case "overtime":
        // 연장근로수당 = 시급 × 1.5 × 월 연장시간
        amount = Math.round(hourlyWage * 1.5 * overtimeHours);
        break;
      case "holiday":
        // 휴일근로수당 = 시급 × 1.5 × 월 휴일근로시간
        amount = Math.round(hourlyWage * 1.5 * holidayHours);
        break;
      case "annualLeave":
        // 연차유급휴가 수당 = 시급 × 1일 소정근로시간 × 미사용 연차일수
        amount = Math.round(hourlyWage * dailyWorkHours * unusedAnnualDays);
        break;
    }
    
    onCalculate(amount);
    setIsOpen(false);
  };

  const getTitle = () => {
    switch (type) {
      case "overtime":
        return "연장근로수당 계산기";
      case "holiday":
        return "휴일근로수당 계산기";
      case "annualLeave":
        return "연차유급휴가 수당 계산기";
    }
  };

  const getFormula = () => {
    switch (type) {
      case "overtime":
        return `시급(${hourlyWage.toLocaleString()}원) × 1.5 × 월 연장시간`;
      case "holiday":
        return `시급(${hourlyWage.toLocaleString()}원) × 1.5 × 월 휴일근로시간`;
      case "annualLeave":
        return `시급(${hourlyWage.toLocaleString()}원) × ${dailyWorkHours}시간 × 미사용 연차일수`;
    }
  };

  const getPreview = () => {
    switch (type) {
      case "overtime":
        return overtimeHours > 0 
          ? `= ${Math.round(hourlyWage * 1.5 * overtimeHours).toLocaleString()}원`
          : null;
      case "holiday":
        return holidayHours > 0
          ? `= ${Math.round(hourlyWage * 1.5 * holidayHours).toLocaleString()}원`
          : null;
      case "annualLeave":
        return unusedAnnualDays > 0
          ? `= ${Math.round(hourlyWage * dailyWorkHours * unusedAnnualDays).toLocaleString()}원`
          : null;
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-caption text-primary hover:text-primary/80 transition-colors"
      >
        <Calculator className="w-3.5 h-3.5" />
        <span>계산기로 입력</span>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
              <p className="text-caption font-medium text-foreground">{getTitle()}</p>
              <p className="text-xs text-muted-foreground">{getFormula()}</p>
              
              {type === "overtime" && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">월 예상 연장근로시간</label>
                  <div className="flex items-center gap-2">
                    <Input
                      variant="toss"
                      inputSize="sm"
                      type="number"
                      min={0}
                      placeholder="0"
                      value={overtimeHours || ""}
                      onChange={(e) => setOvertimeHours(Number(e.target.value) || 0)}
                      className="flex-1"
                    />
                    <span className="text-caption text-muted-foreground">시간</span>
                  </div>
                </div>
              )}
              
              {type === "holiday" && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">월 예상 휴일근로시간</label>
                  <div className="flex items-center gap-2">
                    <Input
                      variant="toss"
                      inputSize="sm"
                      type="number"
                      min={0}
                      placeholder="0"
                      value={holidayHours || ""}
                      onChange={(e) => setHolidayHours(Number(e.target.value) || 0)}
                      className="flex-1"
                    />
                    <span className="text-caption text-muted-foreground">시간</span>
                  </div>
                </div>
              )}
              
              {type === "annualLeave" && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">예상 미사용 연차일수 (연간)</label>
                  <div className="flex items-center gap-2">
                    <Input
                      variant="toss"
                      inputSize="sm"
                      type="number"
                      min={0}
                      max={26}
                      placeholder="0"
                      value={unusedAnnualDays || ""}
                      onChange={(e) => setUnusedAnnualDays(Number(e.target.value) || 0)}
                      className="flex-1"
                    />
                    <span className="text-caption text-muted-foreground">일</span>
                  </div>
                </div>
              )}
              
              {getPreview() && (
                <p className="text-body font-semibold text-primary">{getPreview()}</p>
              )}
              
              <motion.button
                type="button"
                onClick={calculateAmount}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-caption font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                계산 결과 적용
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
