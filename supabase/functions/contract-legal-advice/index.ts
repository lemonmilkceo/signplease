import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contractData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `당신은 대한민국 노동법 전문 법률 자문가입니다. 사용자가 작성한 근로계약서를 분석하고 다음 관점에서 조언을 제공해주세요:

1. **법적 적합성**: 근로기준법에 맞게 작성되었는지 확인
2. **필수 기재사항**: 누락된 중요 항목이 있는지 체크
3. **근로자 보호**: 근로자의 권리가 충분히 보장되는지 검토
4. **개선 제안**: 더 명확하거나 공정하게 수정할 부분 제안

응답은 친절하고 이해하기 쉬운 한국어로 작성해주세요. 이모지를 적절히 사용하여 가독성을 높여주세요.
중요한 법적 문제가 있다면 ⚠️ 표시와 함께 강조해주세요.
좋은 점이 있다면 ✅ 표시와 함께 칭찬해주세요.`;

    const contractSummary = `
근로계약서 정보:
- 사업주: ${contractData.employerName}
- 근로자: ${contractData.workerName}
- 시급: ${contractData.hourlyWage?.toLocaleString()}원 ${contractData.includeWeeklyHolidayPay ? '(주휴수당 포함)' : ''}
- 근무 기간: ${contractData.startDate} ~ ${contractData.noEndDate ? '(종료일 없음)' : contractData.endDate || '미정'}
- 근무 시간: ${contractData.workStartTime} ~ ${contractData.workEndTime}
- 주당 근무일수: ${contractData.workDaysPerWeek ? `주 ${contractData.workDaysPerWeek}일` : '미정'}
- 근무 장소: ${contractData.workLocation}
- 임금 지급일: ${contractData.paymentMonth === 'current' ? '당월' : '익월'} ${contractData.paymentEndOfMonth ? '말일' : `${contractData.paymentDay}일`}
- 업무 내용: ${contractData.jobDescription || '미기재'}
`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `다음 근로계약서를 분석하고 법적 조언을 해주세요:\n${contractSummary}` }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI 서비스 사용량을 초과했습니다." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI 분석에 실패했습니다." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const advice = data.choices?.[0]?.message?.content || "조언을 생성할 수 없습니다.";

    return new Response(JSON.stringify({ advice }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Legal advice error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
