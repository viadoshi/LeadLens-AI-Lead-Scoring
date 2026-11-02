"""
Campaign Service for LeadLens Phase 3.7.
Manages campaign lifecycle (CRUD, filtering, search, archiving) and
calculates campaign performance dynamically from the demo lead records.
"""
from collections import defaultdict
from datetime import datetime
import json
import logging
from pathlib import Path
import re
from typing import Any, Dict, List, Optional, Tuple

from backend.api.schemas.campaign import (
    CampaignCreateRequest,
    CampaignDetailResponse,
    CampaignInsightItem,
    CampaignListResponse,
    CampaignScoreBucket,
    CampaignSegmentItem,
    CampaignSourceItem,
    CampaignSummaryCards,
    CampaignSummaryItem,
    CampaignTopLeadItem,
    CampaignTrendItem,
    CampaignUpdateRequest,
)
from backend.core.config import ANALYTICS_DATASET_PATH, CAMPAIGNS_DATASET_PATH

logger = logging.getLogger("leadlens.campaign_service")

# Curated reference top leads matching mockLeadsData.js for seamless click-through
TOP_LEADS_BY_CAMPAIGN: Dict[str, List[Dict[str, Any]]] = {
    "q4-enterprise": [
        {"lead_id": "105", "name": "Aria Montgomery", "company": "Synthetix AI", "score": 89, "segment": "HOT", "status": "Contact immediately"},
        {"lead_id": "101", "name": "Sarah Mitchell", "company": "Acme Technologies", "score": 87, "segment": "HOT", "status": "Contact immediately"},
        {"lead_id": "110", "name": "Derek Foster", "company": "GreenVolt Energy", "score": 64, "segment": "WARM", "status": "Follow up within 24h"},
        {"lead_id": "117", "name": "Kiran Patel", "company": "Delta Precision Manufacturing", "score": 28, "segment": "COLD", "status": "Low-priority follow-up"},
    ],
    "cloud-scale": [
        {"lead_id": "102", "name": "Marcus Vance", "company": "CloudScale Systems", "score": 92, "segment": "HOT", "status": "Schedule enterprise demo"},
        {"lead_id": "108", "name": "Lucas Sterling", "company": "Hyperion Security", "score": 78, "segment": "WARM", "status": "Share product case study"},
        {"lead_id": "112", "name": "Tobias Schmidt", "company": "Bavaria Automotive", "score": 54, "segment": "NURTURE", "status": "Nurture sequence"},
        {"lead_id": "120", "name": "Zoe Katsaros", "company": "Athenian Metals Ltd", "score": 12, "segment": "COLD", "status": "Archive prospect"},
    ],
    "webinar-ai": [
        {"lead_id": "103", "name": "Elena Rostova", "company": "FinPulse Software", "score": 84, "segment": "HOT", "status": "Send technical whitepaper"},
        {"lead_id": "109", "name": "Chloe Bennett", "company": "AeroCore Dynamics", "score": 68, "segment": "WARM", "status": "Follow up within 24h"},
        {"lead_id": "118", "name": "Grace Hopper", "company": "Hopper Educational Trust", "score": 22, "segment": "COLD", "status": "Archive prospect"},
    ],
    "saas-growth-sdr": [
        {"lead_id": "104", "name": "David Chen", "company": "Nexus Logistics", "score": 81, "segment": "HOT", "status": "Trigger executive outbound"},
        {"lead_id": "107", "name": "Priya Sharma", "company": "OmniCommerce Labs", "score": 72, "segment": "WARM", "status": "Follow up within 24h"},
        {"lead_id": "111", "name": "Naomi Tanaka", "company": "Zenith Media Group", "score": 58, "segment": "NURTURE", "status": "Nurture sequence"},
        {"lead_id": "119", "name": "Liam O'Connor", "company": "Celtic Hospitality Group", "score": 18, "segment": "COLD", "status": "Archive prospect"},
    ],
    "executive-intent": [
        {"lead_id": "102", "name": "Marcus Vance", "company": "CloudScale Systems", "score": 92, "segment": "HOT", "status": "Schedule enterprise demo"},
        {"lead_id": "105", "name": "Aria Montgomery", "company": "Synthetix AI", "score": 89, "segment": "HOT", "status": "Contact immediately"},
        {"lead_id": "101", "name": "Sarah Mitchell", "company": "Acme Technologies", "score": 87, "segment": "HOT", "status": "Contact immediately"},
        {"lead_id": "108", "name": "Lucas Sterling", "company": "Hyperion Security", "score": 78, "segment": "WARM", "status": "Share product case study"},
        {"lead_id": "107", "name": "Priya Sharma", "company": "OmniCommerce Labs", "score": 72, "segment": "WARM", "status": "Follow up within 24h"},
    ],
    "email-nurture": [
        {"lead_id": "110", "name": "Derek Foster", "company": "GreenVolt Energy", "score": 64, "segment": "WARM", "status": "Follow up within 24h"},
        {"lead_id": "111", "name": "Naomi Tanaka", "company": "Zenith Media Group", "score": 58, "segment": "NURTURE", "status": "Nurture sequence"},
        {"lead_id": "112", "name": "Tobias Schmidt", "company": "Bavaria Automotive", "score": 54, "segment": "NURTURE", "status": "Nurture sequence"},
        {"lead_id": "118", "name": "Grace Hopper", "company": "Hopper Educational Trust", "score": 22, "segment": "COLD", "status": "Archive prospect"},
    ],
    "fintech-targeted": [
        {"lead_id": "106", "name": "Julian Hayes", "company": "Vanguard Biotech", "score": 76, "segment": "WARM", "status": "Share compliance whitepaper"},
        {"lead_id": "114", "name": "Evan Wright", "company": "Apex Insurance Group", "score": 47, "segment": "NURTURE", "status": "Nurture sequence"},
        {"lead_id": "116", "name": "Arthur Pendelton", "company": "Legacy Capital Holdings", "score": 34, "segment": "COLD", "status": "Low-priority follow-up"},
    ],
}


class CampaignService:
    """Service handling campaign CRUD, filtering, and performance aggregations."""

    def __init__(
        self,
        campaigns_path: Path = CAMPAIGNS_DATASET_PATH,
        analytics_path: Path = ANALYTICS_DATASET_PATH,
    ):
        self.campaigns_path = campaigns_path
        self.analytics_path = analytics_path
        self._campaigns: List[Dict[str, Any]] = []
        self._leads: List[Dict[str, Any]] = []
        self._is_loaded = False

    def load_data(self) -> None:
        """Load campaigns metadata and lead records from filesystem."""
        # 1. Load lead records
        if self.analytics_path.exists():
            try:
                with open(self.analytics_path, "r", encoding="utf-8") as f:
                    payload = json.load(f)
                self._leads = payload.get("records", [])
                logger.info("Loaded %d lead records for campaign attribution.", len(self._leads))
            except Exception as exc:
                logger.error("Failed to load leads for campaigns: %s", exc)
                self._leads = []
        else:
            self._leads = []

        # 2. Load campaigns metadata
        if self.campaigns_path.exists():
            try:
                with open(self.campaigns_path, "r", encoding="utf-8") as f:
                    self._campaigns = json.load(f)
                logger.info("Loaded %d campaigns from %s.", len(self._campaigns), self.campaigns_path)
            except Exception as exc:
                logger.error("Failed to load campaigns: %s", exc)
                self._campaigns = []
        else:
            self._campaigns = []

        self._is_loaded = True

    def _ensure_loaded(self) -> None:
        if not self._is_loaded:
            self.load_data()

    def _save_campaigns(self) -> None:
        """Persist in-memory campaigns to JSON file."""
        try:
            self.campaigns_path.parent.mkdir(parents=True, exist_ok=True)
            with open(self.campaigns_path, "w", encoding="utf-8") as f:
                json.dump(self._campaigns, f, indent=2)
            logger.info("Persisted %d campaigns to %s", len(self._campaigns), self.campaigns_path)
        except Exception as exc:
            logger.error("Failed to persist campaigns to disk: %s", exc)

    def _get_campaign_leads(self, campaign: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Filter leads associated with a campaign by name or ID match."""
        camp_name = campaign.get("name", "").lower().strip()
        camp_id = campaign.get("id", "").lower().strip()
        return [
            lead for lead in self._leads
            if lead.get("campaign", "").lower().strip() == camp_name
            or lead.get("campaign_id", "").lower().strip() == camp_id
        ]

    def _compute_campaign_metrics(self, campaign: Dict[str, Any]) -> Dict[str, Any]:
        """Derive performance metrics from associated lead data."""
        matching_leads = self._get_campaign_leads(campaign)
        tot = len(matching_leads)
        conv = sum(1 for l in matching_leads if l.get("converted") == 1)
        rate = round((conv / tot * 100), 2) if tot > 0 else 0.0
        avg_score = round(sum(l.get("score", 0) for l in matching_leads) / tot, 1) if tot > 0 else 0.0

        return {
            "total_leads": tot,
            "converted_leads": conv,
            "conversion_rate": rate,
            "average_score": avg_score,
        }

    def get_campaigns(
        self,
        status: Optional[str] = None,
        channel: Optional[str] = None,
        campaign_type: Optional[str] = None,
        search: Optional[str] = None,
    ) -> CampaignListResponse:
        """Retrieve filtered, searched list of campaigns with summary metrics."""
        self._ensure_loaded()

        # 1. Filter campaigns
        filtered = []
        for c in self._campaigns:
            if status and status.lower() != "all" and c.get("status", "").lower() != status.lower():
                continue
            if channel and channel.lower() != "all" and c.get("channel", "").lower() != channel.lower():
                continue
            if campaign_type and campaign_type.lower() != "all" and c.get("campaign_type", "").lower() != campaign_type.lower():
                continue
            if search and search.strip():
                query = search.strip().lower()
                c_name = c.get("name", "").lower()
                c_desc = c.get("description", "").lower()
                if query not in c_name and query not in c_desc:
                    continue
            filtered.append(c)

        # 2. Build summary items with performance calculation
        items = []
        for c in filtered:
            metrics = self._compute_campaign_metrics(c)
            items.append(
                CampaignSummaryItem(
                    id=c["id"],
                    name=c["name"],
                    description=c.get("description", ""),
                    status=c.get("status", "Active"),
                    channel=c.get("channel", "LinkedIn"),
                    campaign_type=c.get("campaign_type", "Inbound"),
                    start_date=c.get("start_date", "2026-09-01"),
                    end_date=c.get("end_date"),
                    budget=float(c.get("budget", 0.0)),
                    owner=c.get("owner", "Sarah Jenkins"),
                    created_at=c.get("created_at", datetime.now().isoformat()),
                    total_leads=metrics["total_leads"],
                    converted_leads=metrics["converted_leads"],
                    conversion_rate=metrics["conversion_rate"],
                    average_score=metrics["average_score"],
                )
            )

        # 3. Macro summary across all campaigns (non-archived for business perspective)
        all_metrics = [self._compute_campaign_metrics(c) for c in self._campaigns]
        tot_camps = len(self._campaigns)
        active_camps = sum(1 for c in self._campaigns if c.get("status") == "Active")
        tot_leads = sum(m["total_leads"] for m in all_metrics)
        tot_conv = sum(m["converted_leads"] for m in all_metrics)
        avg_rate = round((tot_conv / tot_leads * 100), 2) if tot_leads > 0 else 0.0

        summary = CampaignSummaryCards(
            total_campaigns=tot_camps,
            active_campaigns=active_camps,
            total_campaign_leads=tot_leads,
            average_campaign_conversion_rate=avg_rate,
        )

        return CampaignListResponse(summary=summary, campaigns=items)

    def get_campaign_detail(self, campaign_id: str) -> CampaignDetailResponse:
        """
        Retrieve comprehensive analytics and intelligence for a single campaign.
        Raises KeyError if campaign_id is not found.
        """
        self._ensure_loaded()

        clean_id = (campaign_id or "").lower().strip()
        campaign = next(
            (c for c in self._campaigns if c["id"].lower() == clean_id), None
        )
        if not campaign:
            # Fallback check on name slugification
            campaign = next(
                (c for c in self._campaigns if self._slugify(c["name"]) == clean_id), None
            )

        if not campaign:
            raise KeyError(f"Campaign '{campaign_id}' not found.")

        # Derive campaign leads
        leads = self._get_campaign_leads(campaign)
        tot = len(leads)
        conv = sum(1 for l in leads if l.get("converted") == 1)
        rate = round((conv / tot * 100), 2) if tot > 0 else 0.0
        avg_score = round(sum(l.get("score", 0) for l in leads) / tot, 1) if tot > 0 else 0.0

        # 1. Source Performance
        source_items = self._compute_sources(leads)

        # 2. Segment Performance
        segment_items = self._compute_segments(leads)

        # 3. Score Distribution
        dist_items = self._compute_distribution(leads)

        # 4. Conversion Trend
        trend_items = self._compute_trend(leads)

        # 5. Top Leads
        top_leads = self._get_top_leads(campaign["id"], leads)

        # 6. Deterministic Insights
        insights = self._compute_insights(campaign, tot, conv, rate, avg_score, segment_items, source_items)

        return CampaignDetailResponse(
            id=campaign["id"],
            name=campaign["name"],
            description=campaign.get("description", ""),
            status=campaign.get("status", "Active"),
            channel=campaign.get("channel", "LinkedIn"),
            campaign_type=campaign.get("campaign_type", "Inbound"),
            start_date=campaign.get("start_date", "2026-09-01"),
            end_date=campaign.get("end_date"),
            budget=float(campaign.get("budget", 0.0)),
            owner=campaign.get("owner", "Sarah Jenkins"),
            created_at=campaign.get("created_at", datetime.now().isoformat()),
            total_leads=tot,
            converted_leads=conv,
            conversion_rate=rate,
            average_score=avg_score,
            source_performance=source_items,
            segment_performance=segment_items,
            score_distribution=dist_items,
            conversion_trend=trend_items,
            top_leads=top_leads,
            insights=insights,
        )

    def create_campaign(self, req: CampaignCreateRequest) -> CampaignSummaryItem:
        """Create new campaign and persist."""
        self._ensure_loaded()

        camp_id = self._slugify(req.name)
        # Avoid slug collisions
        existing_ids = {c["id"] for c in self._campaigns}
        counter = 1
        base_id = camp_id
        while camp_id in existing_ids:
            camp_id = f"{base_id}-{counter}"
            counter += 1

        new_camp = {
            "id": camp_id,
            "name": req.name.strip(),
            "description": (req.description or "").strip(),
            "status": req.status or "Active",
            "channel": req.channel.strip(),
            "campaign_type": req.campaign_type.strip(),
            "start_date": req.start_date.strip(),
            "end_date": req.end_date.strip() if req.end_date else None,
            "budget": float(req.budget),
            "owner": req.owner.strip() if req.owner else "Sarah Jenkins",
            "created_at": datetime.now().isoformat() + "Z",
        }

        self._campaigns.insert(0, new_camp)
        self._save_campaigns()

        return CampaignSummaryItem(
            id=new_camp["id"],
            name=new_camp["name"],
            description=new_camp["description"],
            status=new_camp["status"],
            channel=new_camp["channel"],
            campaign_type=new_camp["campaign_type"],
            start_date=new_camp["start_date"],
            end_date=new_camp["end_date"],
            budget=new_camp["budget"],
            owner=new_camp["owner"],
            created_at=new_camp["created_at"],
            total_leads=0,
            converted_leads=0,
            conversion_rate=0.0,
            average_score=0.0,
        )

    def update_campaign(self, campaign_id: str, req: CampaignUpdateRequest) -> CampaignSummaryItem:
        """Update existing campaign metadata."""
        self._ensure_loaded()
        clean_id = (campaign_id or "").lower().strip()
        campaign = next((c for c in self._campaigns if c["id"].lower() == clean_id), None)
        if not campaign:
            raise KeyError(f"Campaign '{campaign_id}' not found.")

        if req.name is not None:
            campaign["name"] = req.name.strip()
        if req.description is not None:
            campaign["description"] = req.description.strip()
        if req.channel is not None:
            campaign["channel"] = req.channel.strip()
        if req.campaign_type is not None:
            campaign["campaign_type"] = req.campaign_type.strip()
        if req.status is not None:
            campaign["status"] = req.status.strip()
        if req.start_date is not None:
            campaign["start_date"] = req.start_date.strip()
        if req.end_date is not None:
            campaign["end_date"] = req.end_date.strip() if req.end_date else None
        if req.budget is not None:
            campaign["budget"] = float(req.budget)
        if req.owner is not None:
            campaign["owner"] = req.owner.strip()

        self._save_campaigns()
        metrics = self._compute_campaign_metrics(campaign)

        return CampaignSummaryItem(
            id=campaign["id"],
            name=campaign["name"],
            description=campaign.get("description", ""),
            status=campaign["status"],
            channel=campaign["channel"],
            campaign_type=campaign["campaign_type"],
            start_date=campaign["start_date"],
            end_date=campaign.get("end_date"),
            budget=campaign["budget"],
            owner=campaign["owner"],
            created_at=campaign.get("created_at", datetime.now().isoformat()),
            total_leads=metrics["total_leads"],
            converted_leads=metrics["converted_leads"],
            conversion_rate=metrics["conversion_rate"],
            average_score=metrics["average_score"],
        )

    def archive_campaign(self, campaign_id: str) -> CampaignSummaryItem:
        """Set campaign status to Archived."""
        self._ensure_loaded()
        clean_id = (campaign_id or "").lower().strip()
        campaign = next((c for c in self._campaigns if c["id"].lower() == clean_id), None)
        if not campaign:
            raise KeyError(f"Campaign '{campaign_id}' not found.")

        campaign["status"] = "Archived"
        self._save_campaigns()
        metrics = self._compute_campaign_metrics(campaign)

        return CampaignSummaryItem(
            id=campaign["id"],
            name=campaign["name"],
            description=campaign.get("description", ""),
            status=campaign["status"],
            channel=campaign["channel"],
            campaign_type=campaign["campaign_type"],
            start_date=campaign["start_date"],
            end_date=campaign.get("end_date"),
            budget=campaign["budget"],
            owner=campaign["owner"],
            created_at=campaign.get("created_at", datetime.now().isoformat()),
            total_leads=metrics["total_leads"],
            converted_leads=metrics["converted_leads"],
            conversion_rate=metrics["conversion_rate"],
            average_score=metrics["average_score"],
        )

    # --- Calculation Helpers ---

    def _compute_sources(self, leads: List[Dict[str, Any]]) -> List[CampaignSourceItem]:
        buckets: Dict[str, Dict[str, int]] = defaultdict(lambda: {"total": 0, "converted": 0})
        for l in leads:
            src = l.get("source", "Direct")
            buckets[src]["total"] += 1
            if l.get("converted") == 1:
                buckets[src]["converted"] += 1

        items = []
        for src, data in buckets.items():
            tot = data["total"]
            conv = data["converted"]
            rate = round((conv / tot * 100), 2) if tot > 0 else 0.0
            items.append(
                CampaignSourceItem(
                    source=src,
                    total_leads=tot,
                    converted_leads=conv,
                    conversion_rate=rate,
                )
            )
        items.sort(key=lambda s: s.conversion_rate, reverse=True)
        return items

    def _compute_segments(self, leads: List[Dict[str, Any]]) -> List[CampaignSegmentItem]:
        order = ["HOT", "WARM", "NURTURE", "COLD"]
        buckets: Dict[str, Dict[str, Any]] = {
            t: {"total": 0, "converted": 0, "score_sum": 0} for t in order
        }
        for l in leads:
            score = l.get("score", 0)
            if score >= 80:
                seg = "HOT"
            elif score >= 60:
                seg = "WARM"
            elif score >= 40:
                seg = "NURTURE"
            else:
                seg = "COLD"

            buckets[seg]["total"] += 1
            if l.get("converted") == 1:
                buckets[seg]["converted"] += 1
            buckets[seg]["score_sum"] += score

        items = []
        for seg in order:
            data = buckets[seg]
            tot = data["total"]
            conv = data["converted"]
            rate = round((conv / tot * 100), 2) if tot > 0 else 0.0
            avg = round((data["score_sum"] / tot), 1) if tot > 0 else 0.0
            items.append(
                CampaignSegmentItem(
                    segment=seg,
                    total_leads=tot,
                    converted_leads=conv,
                    conversion_rate=rate,
                    average_score=avg,
                )
            )
        return items

    def _compute_distribution(self, leads: List[Dict[str, Any]]) -> List[CampaignScoreBucket]:
        tot = len(leads)
        bucket_defs = [
            ("0-19", "Score 0–19 (Very Low)", lambda s: 0 <= s < 20),
            ("20-39", "Score 20–39 (Cold)", lambda s: 20 <= s < 40),
            ("40-59", "Score 40–59 (Nurture)", lambda s: 40 <= s < 60),
            ("60-79", "Score 60–79 (Warm)", lambda s: 60 <= s < 80),
            ("80-100", "Score 80–100 (Hot)", lambda s: 80 <= s <= 100),
        ]
        buckets = []
        for b_id, b_label, pred in bucket_defs:
            count = sum(1 for l in leads if pred(l.get("score", 0)))
            pct = round((count / tot * 100), 1) if tot > 0 else 0.0
            buckets.append(
                CampaignScoreBucket(
                    bucket=b_id,
                    range_label=b_label,
                    count=count,
                    percentage=pct,
                )
            )
        return buckets

    def _compute_trend(self, leads: List[Dict[str, Any]]) -> List[CampaignTrendItem]:
        if not leads:
            return []
        daily: Dict[str, Dict[str, int]] = defaultdict(lambda: {"leads": 0, "converted": 0})
        for l in leads:
            d_str = l.get("created_at")
            if d_str:
                daily[d_str]["leads"] += 1
                if l.get("converted") == 1:
                    daily[d_str]["converted"] += 1

        items = []
        # Return sorted by date
        for d_str in sorted(daily.keys()):
            cnt = daily[d_str]["leads"]
            conv = daily[d_str]["converted"]
            rate = round((conv / cnt * 100), 1) if cnt > 0 else 0.0
            items.append(
                CampaignTrendItem(
                    date=d_str,
                    leads=cnt,
                    converted=conv,
                    conversion_rate=rate,
                )
            )
        return items

    def _get_top_leads(self, campaign_id: str, leads: List[Dict[str, Any]]) -> List[CampaignTopLeadItem]:
        # If curated top leads exist for this campaign, use them
        curated = TOP_LEADS_BY_CAMPAIGN.get(campaign_id.lower())
        if curated:
            return [CampaignTopLeadItem(**item) for item in curated[:5]]

        # Otherwise sort campaign leads by score descending
        sorted_leads = sorted(leads, key=lambda l: l.get("score", 0), reverse=True)
        top = []
        for l in sorted_leads[:5]:
            top.append(
                CampaignTopLeadItem(
                    lead_id=str(l.get("id", "101")).replace("LL-", ""),
                    name=l.get("name", "Executive Lead"),
                    company=l.get("company", "Enterprise Account"),
                    score=l.get("score", 75),
                    segment=l.get("segment", "WARM"),
                    status="Contact immediately" if l.get("score", 0) >= 80 else "Follow up within 24h",
                )
            )
        return top

    def _compute_insights(
        self,
        campaign: Dict[str, Any],
        total: int,
        converted: int,
        rate: float,
        avg_score: float,
        segments: List[CampaignSegmentItem],
        sources: List[CampaignSourceItem],
    ) -> List[CampaignInsightItem]:
        insights = []
        if total == 0:
            return [
                CampaignInsightItem(
                    id="insight-empty",
                    type="neutral",
                    title="No Campaign Activity",
                    description="No lead activity recorded for this campaign yet.",
                    metric_value=None,
                )
            ]

        # 1. Warm + Hot qualification density
        warm_hot = sum(s.total_leads for s in segments if s.segment in ("HOT", "WARM"))
        warm_hot_pct = (warm_hot / total * 100) if total > 0 else 0.0
        insights.append(
            CampaignInsightItem(
                id="insight-qualification",
                type="positive" if warm_hot_pct >= 50 else "neutral",
                title="Lead Qualification Yield",
                description=(
                    f"{warm_hot_pct:.1f}% of leads in '{campaign['name']}' score 60 or higher "
                    f"({warm_hot}/{total} leads in WARM or HOT tiers)."
                ),
                metric_value=f"{warm_hot_pct:.1f}%",
            )
        )

        # 2. HOT tier conversion efficiency
        hot_seg = next((s for s in segments if s.segment == "HOT"), None)
        if hot_seg and hot_seg.total_leads > 0:
            insights.append(
                CampaignInsightItem(
                    id="insight-hot-conv",
                    type="positive",
                    title="HOT Tier Conversion",
                    description=(
                        f"HOT leads in this campaign achieve a {hot_seg.conversion_rate:.1f}% conversion rate "
                        f"({hot_seg.converted_leads}/{hot_seg.total_leads} converted)."
                    ),
                    metric_value=f"{hot_seg.conversion_rate:.1f}%",
                )
            )

        # 3. Top performing source
        if sources:
            best_src = sources[0]
            insights.append(
                CampaignInsightItem(
                    id="insight-top-src",
                    type="opportunity",
                    title="Highest Yield Source",
                    description=(
                        f"{best_src.source} generates the highest conversion yield in this campaign at "
                        f"{best_src.conversion_rate:.1f}% ({best_src.converted_leads}/{best_src.total_leads} leads)."
                    ),
                    metric_value=f"{best_src.conversion_rate:.1f}%",
                )
            )

        # 4. Overall conversion velocity
        insights.append(
            CampaignInsightItem(
                id="insight-overall-yield",
                type="positive" if rate >= 25 else "neutral",
                title="Campaign Conversion Rate",
                description=(
                    f"Overall campaign conversion yield is {rate:.1f}% across {total} leads "
                    f"with an average AI score of {avg_score:.1f}."
                ),
                metric_value=f"{rate:.1f}%",
            )
        )

        return insights

    @staticmethod
    def _slugify(text: str) -> str:
        s = text.lower().strip()
        s = re.sub(r"[^\w\s-]", "", s)
        s = re.sub(r"[\s_-]+", "-", s)
        return s.strip("-")


# Singleton instance
campaign_service = CampaignService()
