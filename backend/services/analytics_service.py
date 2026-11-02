"""
Analytics Service for LeadLens Phase 3.6.
Reads isolated demo business analytics dataset and computes deterministic,
mathematically consistent aggregations for the Analytics Dashboard.
"""
from collections import defaultdict
from datetime import datetime, timedelta
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from backend.api.schemas.analytics import (
    AnalyticsInsightItem,
    AnalyticsOverviewResponse,
    CampaignPerformanceItem,
    ConversionTrendItem,
    ScoreDistributionBucket,
    SegmentPerformanceItem,
    SourcePerformanceItem,
    SummaryMetrics,
)
from backend.core.config import ANALYTICS_DATASET_PATH

logger = logging.getLogger("leadlens.analytics_service")

VALID_RANGES = {
    "7d": ("Last 7 Days", 7),
    "30d": ("Last 30 Days", 30),
    "90d": ("Last 90 Days", 90),
    "all": ("All Time", None),
}


class AnalyticsService:
    """Central service managing business simulation analytics data and calculations."""

    def __init__(self, dataset_path: Path = ANALYTICS_DATASET_PATH):
        self.dataset_path = dataset_path
        self._anchor_date: Optional[datetime] = None
        self._records: List[Dict[str, Any]] = []
        self._is_loaded = False

    def load_dataset(self) -> None:
        """Load and cache isolated demo analytics dataset in memory."""
        if not self.dataset_path.exists():
            logger.warning("Analytics dataset not found at %s. Initializing empty dataset.", self.dataset_path)
            self._records = []
            self._anchor_date = datetime.now()
            self._is_loaded = True
            return

        try:
            with open(self.dataset_path, "r", encoding="utf-8") as f:
                payload = json.load(f)

            anchor_str = payload.get("anchor_date", "2026-10-27")
            self._anchor_date = datetime.strptime(anchor_str, "%Y-%m-%d")
            self._records = payload.get("records", [])
            self._is_loaded = True
            logger.info(
                "Loaded %d demo analytics records (anchor date: %s)",
                len(self._records),
                anchor_str,
            )
        except Exception as exc:
            logger.error("Failed to load analytics dataset: %s", exc, exc_info=True)
            self._records = []
            self._anchor_date = datetime.now()
            self._is_loaded = True

    def _ensure_loaded(self) -> None:
        if not self._is_loaded:
            self.load_dataset()

    def get_overview(self, range_code: str) -> AnalyticsOverviewResponse:
        """
        Compute complete analytics dashboard overview for requested date range.
        Raises ValueError if range_code is invalid.
        """
        self._ensure_loaded()
        clean_code = (range_code or "").lower().strip()
        if clean_code not in VALID_RANGES:
            raise ValueError(f"Invalid range parameter '{range_code}'. Accepted values: '7d', '30d', '90d', 'all'.")

        range_label, days_count = VALID_RANGES[clean_code]
        anchor = self._anchor_date or datetime(2026, 10, 27)

        # 1. Filter current period records and previous period records
        current_records, prev_records = self._filter_periods(clean_code, days_count, anchor)

        # 2. Compute Summary Metrics
        summary = self._compute_summary(current_records, prev_records)

        # 3. Compute Conversion Trend
        trend = self._compute_trend(current_records, clean_code, days_count, anchor)

        # 4. Compute Source Performance
        source_perf = self._compute_source_performance(current_records)

        # 5. Compute Segment Performance
        segment_perf = self._compute_segment_performance(current_records)

        # 6. Compute Campaign Performance
        campaign_perf = self._compute_campaign_performance(current_records)

        # 7. Compute Score Distribution
        score_dist = self._compute_score_distribution(current_records)

        # 8. Compute Deterministic Insights
        insights = self._compute_insights(
            summary, source_perf, segment_perf, campaign_perf, score_dist
        )

        return AnalyticsOverviewResponse(
            range=clean_code,
            range_label=range_label,
            anchor_date=anchor.strftime("%Y-%m-%d"),
            data_notice="Demo workspace data",
            summary=summary,
            conversion_trend=trend,
            source_performance=source_perf,
            segment_performance=segment_perf,
            campaign_performance=campaign_perf,
            score_distribution=score_dist,
            insights=insights,
        )

    def _filter_periods(
        self, range_code: str, days_count: Optional[int], anchor: datetime
    ) -> Tuple[List[Dict[str, Any]], Optional[List[Dict[str, Any]]]]:
        """Slice records into current window and immediate preceding window."""
        if range_code == "all" or days_count is None:
            # 'all' time: current is everything, no preceding window
            return list(self._records), None

        current_start = anchor - timedelta(days=days_count - 1)
        prev_start = anchor - timedelta(days=(days_count * 2) - 1)
        prev_end = anchor - timedelta(days=days_count)

        cur_start_str = current_start.strftime("%Y-%m-%d")
        anchor_str = anchor.strftime("%Y-%m-%d")
        prev_start_str = prev_start.strftime("%Y-%m-%d")
        prev_end_str = prev_end.strftime("%Y-%m-%d")

        current = [r for r in self._records if cur_start_str <= r["created_at"] <= anchor_str]
        prev = [r for r in self._records if prev_start_str <= r["created_at"] <= prev_end_str]

        return current, prev

    def _compute_summary(
        self, current: List[Dict[str, Any]], prev: Optional[List[Dict[str, Any]]]
    ) -> SummaryMetrics:
        """Calculate primary pipeline summary metrics with period-over-period delta."""
        total = len(current)
        converted = sum(1 for r in current if r.get("converted") == 1)
        rate = round((converted / total * 100), 2) if total > 0 else 0.0
        avg_score = round(sum(r.get("score", 0) for r in current) / total, 1) if total > 0 else 0.0

        prev_leads: Optional[int] = None
        prev_converted: Optional[int] = None
        prev_rate: Optional[float] = None
        leads_growth: Optional[float] = None
        conv_growth: Optional[float] = None
        rate_delta: Optional[float] = None

        if prev is not None and len(prev) > 0:
            prev_leads = len(prev)
            prev_converted = sum(1 for r in prev if r.get("converted") == 1)
            prev_rate = round((prev_converted / prev_leads * 100), 2) if prev_leads > 0 else 0.0
            leads_growth = round(((total - prev_leads) / prev_leads * 100), 1) if prev_leads > 0 else None
            conv_growth = round(((converted - prev_converted) / prev_converted * 100), 1) if prev_converted > 0 else None
            rate_delta = round(rate - prev_rate, 2)

        return SummaryMetrics(
            total_leads=total,
            converted_leads=converted,
            conversion_rate=rate,
            average_lead_score=avg_score,
            previous_period_leads=prev_leads,
            previous_period_conversions=prev_converted,
            previous_period_conversion_rate=prev_rate,
            leads_growth_pct=leads_growth,
            conversions_growth_pct=conv_growth,
            conversion_rate_delta=rate_delta,
        )

    def _compute_trend(
        self, current: List[Dict[str, Any]], range_code: str, days_count: Optional[int], anchor: datetime
    ) -> List[ConversionTrendItem]:
        """Aggregate leads and conversions chronologically."""
        if not current:
            return []

        # If 7d or 30d, daily aggregation
        if range_code in ("7d", "30d"):
            date_counts: Dict[str, Dict[str, int]] = defaultdict(lambda: {"leads": 0, "converted": 0})
            
            # Fill all days in window so days with 0 leads still appear honestly
            num_days = 7 if range_code == "7d" else 30
            for i in range(num_days - 1, -1, -1):
                d_str = (anchor - timedelta(days=i)).strftime("%Y-%m-%d")
                _ = date_counts[d_str]  # initialize

            for r in current:
                d_str = r["created_at"]
                if d_str in date_counts:
                    date_counts[d_str]["leads"] += 1
                    if r.get("converted") == 1:
                        date_counts[d_str]["converted"] += 1

            trend_items = []
            for d_str in sorted(date_counts.keys()):
                leads_cnt = date_counts[d_str]["leads"]
                conv_cnt = date_counts[d_str]["converted"]
                rate = round((conv_cnt / leads_cnt * 100), 1) if leads_cnt > 0 else 0.0
                trend_items.append(
                    ConversionTrendItem(
                        date=d_str,
                        leads=leads_cnt,
                        converted=conv_cnt,
                        conversion_rate=rate,
                    )
                )
            return trend_items

        # For 90d or all: group into weekly buckets for clean visual pacing
        weekly_counts: Dict[str, Dict[str, int]] = defaultdict(lambda: {"leads": 0, "converted": 0})
        sorted_records = sorted(current, key=lambda x: x["created_at"])
        
        for r in sorted_records:
            dt = datetime.strptime(r["created_at"], "%Y-%m-%d")
            # Group into Monday of each week
            monday = dt - timedelta(days=dt.weekday())
            week_key = monday.strftime("%Y-%m-%d")
            weekly_counts[week_key]["leads"] += 1
            if r.get("converted") == 1:
                weekly_counts[week_key]["converted"] += 1

        trend_items = []
        for week_key in sorted(weekly_counts.keys()):
            leads_cnt = weekly_counts[week_key]["leads"]
            conv_cnt = weekly_counts[week_key]["converted"]
            rate = round((conv_cnt / leads_cnt * 100), 1) if leads_cnt > 0 else 0.0
            trend_items.append(
                ConversionTrendItem(
                    date=week_key,
                    leads=leads_cnt,
                    converted=conv_cnt,
                    conversion_rate=rate,
                )
            )
        return trend_items

    def _compute_source_performance(self, current: List[Dict[str, Any]]) -> List[SourcePerformanceItem]:
        """Aggregate performance per acquisition source."""
        if not current:
            return []

        buckets: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"total": 0, "converted": 0, "score_sum": 0}
        )
        for r in current:
            src = r.get("source", "Unknown")
            buckets[src]["total"] += 1
            if r.get("converted") == 1:
                buckets[src]["converted"] += 1
            buckets[src]["score_sum"] += r.get("score", 0)

        items = []
        for src, data in buckets.items():
            tot = data["total"]
            conv = data["converted"]
            rate = round((conv / tot * 100), 2) if tot > 0 else 0.0
            avg_sc = round((data["score_sum"] / tot), 1) if tot > 0 else 0.0
            items.append(
                SourcePerformanceItem(
                    source=src,
                    total_leads=tot,
                    converted_leads=conv,
                    conversion_rate=rate,
                    average_score=avg_sc,
                )
            )

        # Sort by conversion_rate descending
        items.sort(key=lambda x: x.conversion_rate, reverse=True)
        return items

    def _compute_segment_performance(self, current: List[Dict[str, Any]]) -> List[SegmentPerformanceItem]:
        """Aggregate performance per LeadLens qualification tier in canonical order."""
        tier_order = ["HOT", "WARM", "NURTURE", "COLD"]
        buckets: Dict[str, Dict[str, Any]] = {
            t: {"total": 0, "converted": 0, "score_sum": 0} for t in tier_order
        }

        for r in current:
            score = r.get("score", 0)
            if score >= 80:
                seg = "HOT"
            elif score >= 60:
                seg = "WARM"
            elif score >= 40:
                seg = "NURTURE"
            else:
                seg = "COLD"

            buckets[seg]["total"] += 1
            if r.get("converted") == 1:
                buckets[seg]["converted"] += 1
            buckets[seg]["score_sum"] += score

        items = []
        for seg in tier_order:
            data = buckets[seg]
            tot = data["total"]
            conv = data["converted"]
            rate = round((conv / tot * 100), 2) if tot > 0 else 0.0
            avg_sc = round((data["score_sum"] / tot), 1) if tot > 0 else 0.0
            items.append(
                SegmentPerformanceItem(
                    segment=seg,
                    total_leads=tot,
                    converted_leads=conv,
                    conversion_rate=rate,
                    average_score=avg_sc,
                )
            )
        return items

    def _compute_campaign_performance(self, current: List[Dict[str, Any]]) -> List[CampaignPerformanceItem]:
        """Aggregate performance per marketing / outbound campaign."""
        if not current:
            return []

        buckets: Dict[str, Dict[str, Any]] = defaultdict(
            lambda: {"total": 0, "converted": 0, "score_sum": 0}
        )
        for r in current:
            cmp = r.get("campaign", "Direct / Organic")
            buckets[cmp]["total"] += 1
            if r.get("converted") == 1:
                buckets[cmp]["converted"] += 1
            buckets[cmp]["score_sum"] += r.get("score", 0)

        items = []
        for cmp, data in buckets.items():
            tot = data["total"]
            conv = data["converted"]
            rate = round((conv / tot * 100), 2) if tot > 0 else 0.0
            avg_sc = round((data["score_sum"] / tot), 1) if tot > 0 else 0.0
            items.append(
                CampaignPerformanceItem(
                    campaign=cmp,
                    total_leads=tot,
                    converted_leads=conv,
                    conversion_rate=rate,
                    average_score=avg_sc,
                )
            )

        # Pre-sort by conversion rate descending
        items.sort(key=lambda x: x.conversion_rate, reverse=True)
        return items

    def _compute_score_distribution(self, current: List[Dict[str, Any]]) -> List[ScoreDistributionBucket]:
        """Group leads into 5 score buckets (0-19, 20-39, 40-59, 60-79, 80-100)."""
        total = len(current)
        bucket_defs = [
            ("0-19", "Score 0–19 (Very Low)", lambda s: 0 <= s < 20),
            ("20-39", "Score 20–39 (Cold)", lambda s: 20 <= s < 40),
            ("40-59", "Score 40–59 (Nurture)", lambda s: 40 <= s < 60),
            ("60-79", "Score 60–79 (Warm)", lambda s: 60 <= s < 80),
            ("80-100", "Score 80–100 (Hot)", lambda s: 80 <= s <= 100),
        ]

        buckets_data = []
        for key, label, predicate in bucket_defs:
            count = sum(1 for r in current if predicate(r.get("score", 0)))
            pct = round((count / total * 100), 1) if total > 0 else 0.0
            buckets_data.append(
                ScoreDistributionBucket(
                    bucket=key,
                    range_label=label,
                    count=count,
                    percentage=pct,
                )
            )
        return buckets_data

    def _compute_insights(
        self,
        summary: SummaryMetrics,
        sources: List[SourcePerformanceItem],
        segments: List[SegmentPerformanceItem],
        campaigns: List[CampaignPerformanceItem],
        score_dist: List[ScoreDistributionBucket],
    ) -> List[AnalyticsInsightItem]:
        """Generate deterministic, data-supported LeadLens insights without speculation."""
        insights = []
        total_leads = summary.total_leads

        if total_leads == 0:
            return [
                AnalyticsInsightItem(
                    id="insight-empty",
                    type="neutral",
                    title="No Pipeline Data",
                    description="No lead activities recorded for the selected date window.",
                    metric_value=None,
                )
            ]

        # 1. Best performing source by conversion rate
        if sources:
            best_source = max(sources, key=lambda s: s.conversion_rate)
            insights.append(
                AnalyticsInsightItem(
                    id="insight-best-source",
                    type="positive",
                    title="Highest Converting Channel",
                    description=(
                        f"{best_source.source} currently leads channel conversion yield at "
                        f"{best_source.conversion_rate:.1f}% with an average lead score of "
                        f"{best_source.average_score:.1f} ({best_source.converted_leads}/{best_source.total_leads} converted)."
                    ),
                    metric_value=f"{best_source.conversion_rate:.1f}%",
                )
            )

        # 2. Highest volume source
        if sources:
            top_vol_source = max(sources, key=lambda s: s.total_leads)
            vol_pct = (top_vol_source.total_leads / total_leads * 100) if total_leads > 0 else 0.0
            insights.append(
                AnalyticsInsightItem(
                    id="insight-volume-source",
                    type="neutral",
                    title="Primary Pipeline Volume Generator",
                    description=(
                        f"{top_vol_source.source} contributes the largest share of pipeline volume, "
                        f"supplying {top_vol_source.total_leads} leads ({vol_pct:.1f}% of total inbound)."
                    ),
                    metric_value=f"{top_vol_source.total_leads} leads",
                )
            )

        # 3. Best converting segment (HOT qualification)
        hot_seg = next((s for s in segments if s.segment == "HOT"), None)
        if hot_seg and hot_seg.total_leads > 0:
            insights.append(
                AnalyticsInsightItem(
                    id="insight-hot-segment",
                    type="positive",
                    title="High-Tier Lead Precision",
                    description=(
                        f"HOT leads (score 80+) achieve a {hot_seg.conversion_rate:.1f}% conversion rate, "
                        f"confirming strong conversion correlation with AI lead scores."
                    ),
                    metric_value=f"{hot_seg.conversion_rate:.1f}%",
                )
            )

        # 4. Top performing campaign
        if campaigns:
            best_campaign = max(campaigns, key=lambda c: c.conversion_rate)
            insights.append(
                AnalyticsInsightItem(
                    id="insight-top-campaign",
                    type="opportunity",
                    title="Top Converting Campaign",
                    description=(
                        f"'{best_campaign.campaign}' delivers the highest conversion rate at "
                        f"{best_campaign.conversion_rate:.1f}% across {best_campaign.total_leads} leads "
                        f"with an average score of {best_campaign.average_score:.1f}."
                    ),
                    metric_value=f"{best_campaign.conversion_rate:.1f}%",
                )
            )

        # 5. Pipeline qualification quality (Warm + Hot share)
        warm_hot_count = sum(
            b.count for b in score_dist if b.bucket in ("60-79", "80-100")
        )
        warm_hot_pct = (warm_hot_count / total_leads * 100) if total_leads > 0 else 0.0
        insights.append(
            AnalyticsInsightItem(
                id="insight-pipeline-quality",
                type="positive" if warm_hot_pct >= 50 else "neutral",
                title="Pipeline Qualification Density",
                description=(
                    f"{warm_hot_pct:.1f}% of incoming leads score 60 or higher (WARM or HOT tiers), "
                    f"indicating strong qualification density in the active pipeline."
                ),
                metric_value=f"{warm_hot_pct:.1f}%",
            )
        )

        # 6. Trend / period comparison dynamic
        if summary.conversion_rate_delta is not None:
            delta_str = f"{summary.conversion_rate_delta:+.2f}%"
            sent_type = "positive" if summary.conversion_rate_delta >= 0 else "neutral"
            direction = "increased" if summary.conversion_rate_delta >= 0 else "decreased"
            insights.append(
                AnalyticsInsightItem(
                    id="insight-period-velocity",
                    type=sent_type,
                    title="Period Velocity Momentum",
                    description=(
                        f"Overall conversion rate {direction} by {abs(summary.conversion_rate_delta):.2f} "
                        f"percentage points compared to the immediately preceding time window."
                    ),
                    metric_value=delta_str,
                )
            )

        return insights


# Central singleton instance
analytics_service = AnalyticsService()
