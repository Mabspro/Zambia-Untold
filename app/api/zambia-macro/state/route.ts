import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  FALLBACK_PRESENT_STATE,
  deriveFxDirection,
  deriveHydrologyStatus,
  deriveRailHealth,
  type UntoldPresentState,
} from "@/lib/untold/present-state";

export const revalidate = 3600;

type PsiRow = {
  inference_date: string | null;
  psi_score: number | null;
  psi_regime: string | null;
  confidence: number | null;
  model_version: string | null;
};

type HydrologyRow = {
  date: string | null;
  percent_full: number | null;
  lake_level_m: number | null;
};

type FxRow = {
  date: string | null;
  zmw_usd_mid: number | null;
};

type RailRow = {
  checked_at: string | null;
  overall_status: string | null;
};

function getSignalsClient() {
  const url = process.env.ZAMBIAMACRO_SUPABASE_URL;
  const anonKey = process.env.ZAMBIAMACRO_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function withHeaders(payload: UntoldPresentState) {
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

async function loadPresentState(): Promise<UntoldPresentState> {
  const client = getSignalsClient();
  if (!client) {
    return FALLBACK_PRESENT_STATE;
  }

  try {
    const [psiResult, hydrologyResult, fxResult, railResult] = await Promise.all([
      client
        .from("public_psi_view")
        .select("inference_date, psi_score, psi_regime, confidence, model_version")
        .order("inference_date", { ascending: false })
        .limit(1)
        .maybeSingle<PsiRow>(),
      client
        .from("public_hydrology_latest_view")
        .select("date, percent_full, lake_level_m")
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle<HydrologyRow>(),
      client
        .from("public_boz_fx_latest_view")
        .select("date, zmw_usd_mid")
        .order("date", { ascending: false })
        .limit(2)
        .returns<FxRow[]>(),
      client
        .from("public_rail_health_latest_view")
        .select("checked_at, overall_status")
        .order("checked_at", { ascending: false })
        .limit(1)
        .maybeSingle<RailRow>(),
    ]);

    if (psiResult.error || hydrologyResult.error || fxResult.error || railResult.error) {
      return FALLBACK_PRESENT_STATE;
    }

    const psi = psiResult.data;
    const hydrology = hydrologyResult.data;
    const fxRows = fxResult.data ?? [];
    const rail = railResult.data;
    const latestFx = fxRows[0]?.zmw_usd_mid ?? null;
    const previousFx = fxRows[1]?.zmw_usd_mid ?? null;
    const railLabel = rail?.overall_status?.trim() || FALLBACK_PRESENT_STATE.railHealth.label;

    return {
      psi: {
        value: psi?.psi_score ?? null,
        regime: psi?.psi_regime ?? FALLBACK_PRESENT_STATE.psi.regime,
        updatedAt: psi?.inference_date ?? null,
      },
      hydrology: {
        karibaPercent: hydrology?.percent_full ?? null,
        status: deriveHydrologyStatus(hydrology?.percent_full ?? null),
      },
      fx: {
        pair: "ZMW/USD",
        value: latestFx,
        direction: deriveFxDirection(latestFx, previousFx),
      },
      railHealth: {
        label: railLabel,
        status: deriveRailHealth(railLabel),
      },
      sourceStatus: "live",
    };
  } catch {
    return FALLBACK_PRESENT_STATE;
  }
}

export async function GET() {
  const state = await loadPresentState();
  return withHeaders(state);
}
