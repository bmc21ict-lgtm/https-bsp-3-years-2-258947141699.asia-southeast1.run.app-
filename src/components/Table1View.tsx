import React, { useState, useMemo } from 'react';
import {
  IndicatorRow,
  STANDARDS_META,
  SchoolProfile,
} from '../data/bspData';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Info,
  DollarSign,
  TrendingUp,
  Layers,
  Edit3,
  X,
  Zap,
  ArrowRight,
  ListPlus,
  Check,
} from 'lucide-react';
import { FormattedKhmerText } from './FormattedKhmerText';
import { normalizeKhmerBulletString, splitKhmerBullets } from '../utils/khmerTextFormatter';
import { parseNumber, formatRiel, computeTable1Summaries } from '../utils/bspUtils';

interface Table1ViewProps {
  rows: IndicatorRow[];
  onUpdateRow: (id: string, field: keyof IndicatorRow, value: string) => void;
  schoolProfile: SchoolProfile;
  onOpenAICopilot?: () => void;
}

export const Table1View: React.FC<Table1ViewProps> = ({
  rows,
  onUpdateRow,
  schoolProfile,
  onOpenAICopilot,
}) => {
  const [selectedStandard, setSelectedStandard] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDisaggregation, setShowDisaggregation] = useState(true);
  const [collapsedStandards, setCollapsedStandards] = useState<Record<number, boolean>>({});
  const [editingModalRow, setEditingModalRow] = useState<IndicatorRow | null>(null);
  const [expandReasonBullets, setExpandReasonBullets] = useState<boolean>(true);
  const [cleanFeedback, setCleanFeedback] = useState<string | null>(null);

  // Auto clean chained inline dashes in reason column across all rows
  const handleAutoCleanAllReasons = () => {
    let count = 0;
    rows.forEach((r) => {
      if (
        r.reasonChangeNPlus1 &&
        (r.reasonChangeNPlus1.includes(' - ') ||
          r.reasonChangeNPlus1.includes('&bull;') ||
          r.reasonChangeNPlus1.includes('•') ||
          r.reasonChangeNPlus1.includes('–'))
      ) {
        const cleaned = normalizeKhmerBulletString(r.reasonChangeNPlus1);
        if (cleaned && cleaned !== r.reasonChangeNPlus1) {
          onUpdateRow(r.id, 'reasonChangeNPlus1', cleaned);
          count++;
        }
      }
    });
    setCleanFeedback(`បានតម្រឹម និងទម្លាក់បន្ទាត់ (-) ចំនួន ${count} ជួរ`);
    setTimeout(() => setCleanFeedback(null), 3000);
  };

  // Open modal with pre-formatted clean multiline text
  const handleOpenEditModal = (row: IndicatorRow) => {
    let reasonText = row.reasonChangeNPlus1 || '';
    if (
      reasonText &&
      (reasonText.includes(' - ') ||
        reasonText.includes('&bull;') ||
        reasonText.includes('•') ||
        reasonText.includes('–'))
    ) {
      const cleaned = normalizeKhmerBulletString(reasonText);
      if (cleaned) {
        reasonText = cleaned;
        onUpdateRow(row.id, 'reasonChangeNPlus1', cleaned);
      }
    }
    setEditingModalRow({ ...row, reasonChangeNPlus1: reasonText });
  };

  // Initial auto-normalization for raw dataset if needed
  React.useEffect(() => {
    const uncleaned = rows.some(
      (r) =>
        r.reasonChangeNPlus1 &&
        (r.reasonChangeNPlus1.includes('&bull;') || r.reasonChangeNPlus1.includes(' - '))
    );
    if (uncleaned) {
      rows.forEach((r) => {
        if (
          r.reasonChangeNPlus1 &&
          (r.reasonChangeNPlus1.includes('&bull;') || r.reasonChangeNPlus1.includes(' - '))
        ) {
          const cleaned = normalizeKhmerBulletString(r.reasonChangeNPlus1);
          if (cleaned && cleaned !== r.reasonChangeNPlus1) {
            onUpdateRow(r.id, 'reasonChangeNPlus1', cleaned);
          }
        }
      });
    }
  }, []);

  // Summaries
  const summaries = useMemo(() => computeTable1Summaries(rows), [rows]);

  const toggleStandardCollapse = (standardId: number) => {
    setCollapsedStandards((prev) => ({
      ...prev,
      [standardId]: !prev[standardId],
    }));
  };

  // Filter rows
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      // Grand total is always preserved when viewing ALL or rendered in summaries
      if (row.category === 'GRAND_TOTAL') {
        return selectedStandard === 'ALL' && !searchQuery.trim();
      }

      // Standard filter
      if (selectedStandard !== 'ALL' && row.standardId !== selectedStandard) {
        return false;
      }

      // Disaggregation filter
      if (!showDisaggregation && row.category === 'DISAGGREGATION') {
        return false;
      }

      // Standard collapse
      if (
        row.category !== 'STANDARD_HEADER' &&
        row.standardId &&
        collapsedStandards[row.standardId]
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchCode = row.code.toLowerCase().includes(query);
        const matchTitle = row.title.toLowerCase().includes(query);
        const matchReason = row.reasonChangeNPlus1.toLowerCase().includes(query);
        if (!matchCode && !matchTitle && !matchReason) {
          return false;
        }
      }

      return true;
    });
  }, [rows, selectedStandard, showDisaggregation, collapsedStandards, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Top Controls & Metrics */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 space-y-4">
        {/* Title & Document Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-indigo-600 rounded-full inline-block"></span>
              <h2 className="text-base md:text-lg font-bold text-slate-900">
                ៤. សូចនាករ និងគោលដៅសមិទ្ធកម្មរបស់សាលារៀន
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 pl-4.5">
              ផែនការយុទ្ធសាស្ត្រថវិកា ៣ ឆ្នាំ ({schoolProfile.yearN1} - {schoolProfile.yearN3}) ផ្អែកលើស្តង់ដាសាលារៀនគំរូទាំង ៥
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              <div>
                <div className="text-[10px] text-indigo-600 font-medium">ថវិកាគ្រោងសរុប (N+1)</div>
                <div className="text-sm font-bold text-indigo-900 font-mono">
                  {formatRiel(summaries.grandTotalBudgetN1)} <span className="text-[10px] font-normal text-indigo-700">រៀល</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="text-[10px] text-emerald-600 font-medium">គោលដៅថវិកាសរុប (N+1)</div>
                <div className="text-sm font-bold text-emerald-900 font-mono">
                  {formatRiel(summaries.grandTotalTargetN1)} <span className="text-[10px] font-normal text-emerald-700">រៀល</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              <div>
                <div className="text-[10px] text-slate-600 font-medium">សូចនាករដែលបង្ហាញ</div>
                <div className="text-sm font-bold text-slate-800 font-mono">
                  {filteredRows.filter((r) => r.category === 'SUB_INDICATOR' || r.category === 'KEY_INDICATOR').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Flow to Table 5 Notification Banner */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-xs text-slate-700">
              <span className="font-bold text-sky-950">ភ្ជាប់ស្វ័យប្រវត្តិតាមតារាងទី៥៖</span>{' '}
              <strong>ឆ្នាំគ្រោងថវិកា N+1</strong> ➔ <strong>ច្បាប់ហិរញ្ញវត្ថុ</strong> ក្នុងតារាងទី៥ និង <strong>ថវិកាគោលដៅ</strong> ➔ <strong>គម្រោងតម្រូវការឥណទាន ឆ្នាំ N+1</strong> ក្នុងតារាងទី៥។
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-800 bg-sky-100/80 px-2.5 py-1 rounded-lg shrink-0">
            <span>Table 1 (តារាងទី៤)</span>
            <ArrowRight className="w-3 h-3 text-sky-600" />
            <span>Table 2 (តារាងទី៥)</span>
          </div>
        </div>

        {/* Filter Tabs and Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Standard Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedStandard('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-colors ${
                selectedStandard === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ទាំងអស់ ({rows.filter((r) => r.category === 'SUB_INDICATOR').length})
            </button>

            {STANDARDS_META.map((std) => {
              const isSelected = selectedStandard === std.id;
              const stdTotal = summaries.standardTotals[std.id]?.budgetN1 || 0;
              return (
                <button
                  key={std.id}
                  onClick={() => setSelectedStandard(std.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-colors ${
                    isSelected
                      ? `${std.badgeBg} font-semibold ring-1 ring-current`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{std.shortTitle}</span>
                  <span className="text-[10px] opacity-75 font-mono">
                    ({formatRiel(stdTotal)})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ស្វែងរកតាមលេខកូដ ឬឈ្មោះសូចនាករ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={() => setExpandReasonBullets(!expandReasonBullets)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                expandReasonBullets
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
              title="បិទ/បើក ការទម្លាក់បន្ទាត់សញ្ញាដក (-) និងតម្រឹមអក្សរចូលក្នុងតារាង"
            >
              <ListPlus className="w-3.5 h-3.5 text-amber-600" />
              <span>{expandReasonBullets ? 'ទម្លាក់បន្ទាត់ (-)៖ បើក' : 'ទម្លាក់បន្ទាត់ (-)៖ បង្រួម'}</span>
            </button>

            <button
              onClick={handleAutoCleanAllReasons}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              title="បំបែកសញ្ញាដក (-) ជាប់គ្នា ឱ្យចុះបន្ទាត់ថ្មីគ្រប់សូចនាករក្នុងតារាង"
            >
              <Zap className="w-3 h-3 text-indigo-600" />
              <span>ទម្លាក់បន្ទាត់ (-) គ្រប់ជួរ</span>
            </button>

            {cleanFeedback && (
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-300 font-medium">
                {cleanFeedback}
              </span>
            )}

            <button
              onClick={() => setShowDisaggregation(!showDisaggregation)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                showDisaggregation
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              }`}
              title="បង្ហាញ/លាក់ ទិន្នន័យបំបែកតាមភេទ (ស្រី/ប្រុស)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showDisaggregation ? 'បំបែកតាមភេទ: បើក' : 'បំបែកតាមភេទ: បិទ'}</span>
            </button>

            {onOpenAICopilot && (
              <button
                onClick={onOpenAICopilot}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xs cursor-pointer transition-all"
                title="ជំនួយការ AI សូចនាករ និងមូលហេតុផ្លាស់ប្តូរ"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ជំនួយការ AI សូចនាករ</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            {/* MoEYS Official Multi-Row Table Header */}
            <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-300 select-none">
              {/* Row 0 of Header */}
              <tr>
                <th
                  rowSpan={3}
                  className="border border-slate-300 px-2.5 py-3 text-center align-middle w-14 bg-slate-100"
                >
                  ល.រ
                </th>
                <th
                  rowSpan={3}
                  className="border border-slate-300 px-3 py-3 align-middle min-w-[280px] bg-slate-100"
                >
                  ស្តង់ដា និងសូចនាករ
                </th>
                <th
                  rowSpan={3}
                  className="border-2 border-indigo-400 px-2 py-3 text-center align-middle w-32 bg-indigo-100 text-indigo-950 font-bold"
                >
                  <div>ឆ្នាំគ្រោងថវិកា</div>
                  <div className="text-[11px] font-mono font-bold text-indigo-800">(ឆ្នាំ N+1: {schoolProfile.yearN1})</div>
                  <div className="text-[10px] text-slate-600 font-normal">(រៀល)</div>
                  <div className="mt-1">
                    <span className="inline-block text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded shadow-2xs font-normal font-sans">
                      ⚡ ជាច្បាប់ហិរញ្ញវត្ថុ
                    </span>
                  </div>
                </th>
                <th
                  colSpan={6}
                  className="border border-slate-300 px-2 py-2 text-center bg-slate-200/80 text-slate-900"
                >
                  គោលដៅសូចនាករសមិទ្ធកម្ម (Performance Indicator Targets)
                </th>
              </tr>

              {/* Row 1 of Header */}
              <tr>
                <th
                  rowSpan={2}
                  className="border border-slate-300 px-2 py-2 text-center align-middle w-20 bg-slate-50"
                >
                  <div>ឆ្នាំមុន*</div>
                  <div className="text-[11px] font-mono text-slate-500 font-normal">(ឆ្នាំ N-1: {schoolProfile.yearNMinus1})</div>
                </th>
                <th
                  rowSpan={2}
                  className="border border-slate-300 px-2 py-2 text-center align-middle w-20 bg-slate-50"
                >
                  <div>ឆ្នាំបច្ចុប្បន្ន</div>
                  <div className="text-[11px] font-mono text-slate-500 font-normal">(ឆ្នាំ N: {schoolProfile.yearN})</div>
                </th>
                <th
                  colSpan={2}
                  className="border border-slate-300 px-2 py-1.5 text-center bg-amber-50/80 text-amber-900"
                >
                  ឆ្នាំគ្រោងថវិកា (ឆ្នាំ N+1: {schoolProfile.yearN1})
                </th>
                <th
                  rowSpan={2}
                  className="border border-slate-300 px-2 py-2 text-center align-middle w-20 bg-slate-50"
                >
                  <div>ឆ្នាំគ្រោងថវិកា</div>
                  <div className="text-[11px] font-mono text-slate-500 font-normal">(ឆ្នាំ N+2: {schoolProfile.yearN2})</div>
                </th>
                <th
                  rowSpan={2}
                  className="border border-slate-300 px-2 py-2 text-center align-middle w-20 bg-slate-50"
                >
                  <div>ឆ្នាំគ្រោងថវិកា</div>
                  <div className="text-[11px] font-mono text-slate-500 font-normal">(ឆ្នាំ N+3: {schoolProfile.yearN3})</div>
                </th>
              </tr>

              {/* Row 2 of Header */}
              <tr>
                <th className="border-2 border-sky-400 px-2 py-1.5 text-center w-28 bg-sky-100 text-sky-950 font-bold text-[11px]">
                  <div>គោលដៅ</div>
                  <div className="text-[9px] font-normal text-slate-600">(ឯកតារៀលគត់ / %)</div>
                  <div className="mt-0.5">
                    <span className="inline-block text-[9px] bg-sky-600 text-white px-1.5 py-0.5 rounded shadow-2xs font-normal font-sans">
                      ⚡ ជាតម្រូវការ N+1
                    </span>
                  </div>
                </th>
                <th className="border border-slate-300 px-3 py-1.5 text-left min-w-[280px] max-w-[420px] bg-amber-100/40 text-amber-950 text-[11px]">
                  <div className="flex items-center justify-between gap-1.5">
                    <span>មូលហេតុនៃការផ្លាស់ប្តូរ (ធៀបនឹងគោលដៅ ឆ្នាំ N)</span>
                    <span className="text-[9px] font-normal text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded font-sans shrink-0 border border-amber-300">
                      ទម្លាក់បន្ទាត់ (-)
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200">
              {filteredRows.map((row) => {
                // 1. GRAND TOTAL ROW
                if (row.category === 'GRAND_TOTAL') {
                  return (
                    <tr
                      key={row.id}
                      className="bg-amber-100/80 font-bold text-slate-900 border-y-2 border-amber-400"
                    >
                      <td
                        colSpan={2}
                        className="border border-slate-300 px-3 py-2.5 text-center text-sm font-moul text-amber-950"
                      >
                        សរុបរួម (Grand Total)
                      </td>
                      <td className="border border-slate-300 px-2 py-2.5 text-right font-mono text-sm text-indigo-950 font-bold bg-indigo-100/60">
                        {formatRiel(summaries.grandTotalBudgetN1 || row.budgetYearN1)}
                      </td>
                      <td className="border border-slate-300 px-2 py-2 text-center text-slate-400 font-mono">
                        -
                      </td>
                      <td className="border border-slate-300 px-2 py-2 text-center text-slate-400 font-mono">
                        -
                      </td>
                      <td className="border border-slate-300 px-2 py-2.5 text-right font-mono text-sm text-amber-950 font-bold bg-amber-200/60">
                        {formatRiel(summaries.grandTotalTargetN1 || row.targetNPlus1)}
                      </td>
                      <td className="border border-slate-300 px-2 py-2 text-slate-600 text-xs italic">
                        សរុបថវិកា និងគោលដៅសមិទ្ធកម្មទាំង ៥ ស្តង់ដា
                      </td>
                      <td className="border border-slate-300 px-2 py-2 text-center text-slate-400 font-mono">
                        -
                      </td>
                      <td className="border border-slate-300 px-2 py-2 text-center text-slate-400 font-mono">
                        -
                      </td>
                    </tr>
                  );
                }

                // 2. STANDARD HEADER ROW
                if (row.category === 'STANDARD_HEADER') {
                  const meta = STANDARDS_META.find((s) => s.id === row.standardId);
                  const isCollapsed = collapsedStandards[row.standardId];
                  const stdSubtotal = summaries.standardTotals[row.standardId]?.budgetN1 || 0;
                  const stdTargetSubtotal = summaries.standardTotals[row.standardId]?.targetN1Budget || 0;

                  return (
                    <tr
                      key={row.id}
                      className="bg-slate-800 text-white font-bold border-y-2 border-slate-700 select-none cursor-pointer hover:bg-slate-750"
                      onClick={() => toggleStandardCollapse(row.standardId)}
                    >
                      <td
                        colSpan={2}
                        className="border border-slate-600 px-3 py-2.5 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isCollapsed ? (
                              <ChevronRight className="w-4 h-4 text-amber-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-amber-400" />
                            )}
                            <span className="text-amber-300 font-semibold tracking-wide text-xs md:text-sm">
                              {row.title}
                            </span>
                          </div>
                          <span className="text-[11px] bg-slate-700 text-slate-200 px-2 py-0.5 rounded-full font-normal">
                            {meta?.indicatorsSummary}
                          </span>
                        </div>
                      </td>
                      <td className="border border-slate-600 px-2 py-2.5 text-right font-mono text-emerald-300 font-bold">
                        {formatRiel(stdSubtotal || row.budgetYearN1)}
                      </td>
                      <td className="border border-slate-600 px-2 py-2 text-center text-slate-400">
                        -
                      </td>
                      <td className="border border-slate-600 px-2 py-2 text-center text-slate-400">
                        -
                      </td>
                      <td className="border border-slate-600 px-2 py-2.5 text-right font-mono text-amber-300 font-bold">
                        {formatRiel(stdTargetSubtotal || row.targetNPlus1)}
                      </td>
                      <td className="border border-slate-600 px-2 py-2 text-slate-300 text-[11px] italic">
                        សរុបស្តង់ដាទី{row.standardId}
                      </td>
                      <td className="border border-slate-600 px-2 py-2 text-center text-slate-400">
                        -
                      </td>
                      <td className="border border-slate-600 px-2 py-2 text-center text-slate-400">
                        -
                      </td>
                    </tr>
                  );
                }

                // 3. KEY INDICATOR ROW
                if (row.category === 'KEY_INDICATOR') {
                  return (
                    <tr
                      key={row.id}
                      className="bg-indigo-50/30 hover:bg-indigo-50/60 font-semibold text-slate-900 border-t border-slate-300"
                    >
                      <td className="border border-slate-300 px-2.5 py-2 text-center font-bold text-indigo-700 bg-indigo-100/40 font-mono">
                        {row.code}
                      </td>
                      <td className="border border-slate-300 px-3 py-2 text-slate-900 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          <span>{row.title}</span>
                        </div>
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-right bg-indigo-50/50">
                        <input
                          type="text"
                          value={row.budgetYearN1}
                          onChange={(e) => onUpdateRow(row.id, 'budgetYearN1', e.target.value)}
                          placeholder="0"
                          className="w-full text-right px-1.5 py-1 text-xs font-mono font-semibold text-indigo-900 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetNMinus1}
                          onChange={(e) => onUpdateRow(row.id, 'targetNMinus1', e.target.value)}
                          placeholder="-"
                          className="w-full text-center px-1 py-1 text-xs font-mono text-slate-700 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetN}
                          onChange={(e) => onUpdateRow(row.id, 'targetN', e.target.value)}
                          placeholder="-"
                          className="w-full text-center px-1 py-1 text-xs font-mono text-slate-700 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-right font-mono bg-amber-50/40">
                        <input
                          type="text"
                          value={row.targetNPlus1}
                          onChange={(e) => onUpdateRow(row.id, 'targetNPlus1', e.target.value)}
                          placeholder="-"
                          className="w-full text-right px-1.5 py-1 text-xs font-mono font-semibold text-amber-900 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-2.5 py-1.5 text-slate-700 text-[11px] align-top min-w-[260px] max-w-[380px] relative group hover:bg-amber-50/20 transition-colors">
                        <div className="flex items-start justify-between gap-1.5">
                          <div
                            onClick={() => handleOpenEditModal(row)}
                            className="flex-1 cursor-pointer"
                            title="ចុចដើម្បីកែសម្រួលមូលហេតុនៃការផ្លាស់ប្តូរ"
                          >
                            {row.reasonChangeNPlus1 ? (
                              expandReasonBullets ? (
                                <FormattedKhmerText
                                  text={row.reasonChangeNPlus1}
                                  mode="table-cell"
                                  dashClassName="text-amber-800 font-bold"
                                />
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span className="truncate max-w-[200px] text-slate-600">
                                    {row.reasonChangeNPlus1}
                                  </span>
                                  {splitKhmerBullets(row.reasonChangeNPlus1).length > 1 && (
                                    <span className="shrink-0 text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-sans">
                                      {splitKhmerBullets(row.reasonChangeNPlus1).length} ចំណុច
                                    </span>
                                  )}
                                </div>
                              )
                            ) : (
                              <span className="text-slate-400 italic text-[11px] group-hover:text-indigo-600">
                                -
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenEditModal(row)}
                            className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-indigo-50 shrink-0 mt-0.5 cursor-pointer"
                            title="កែសម្រួលមូលហេតុនៃការផ្លាស់ប្តូរ"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetNPlus2}
                          onChange={(e) => onUpdateRow(row.id, 'targetNPlus2', e.target.value)}
                          placeholder="-"
                          className="w-full text-center px-1 py-1 text-xs font-mono text-slate-700 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetNPlus3}
                          onChange={(e) => onUpdateRow(row.id, 'targetNPlus3', e.target.value)}
                          placeholder="-"
                          className="w-full text-center px-1 py-1 text-xs font-mono text-slate-700 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                }

                // 4. SUB-INDICATOR ROW
                if (row.category === 'SUB_INDICATOR') {
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors text-slate-800"
                    >
                      <td className="border border-slate-300 px-2.5 py-1.5 text-center text-slate-600 font-mono text-[11px] bg-slate-50/50">
                        {row.code}
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-800">
                        <span className="pl-2">{row.title}</span>
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-right">
                        <input
                          type="text"
                          value={row.budgetYearN1}
                          onChange={(e) => onUpdateRow(row.id, 'budgetYearN1', e.target.value)}
                          placeholder=""
                          className="w-full text-right px-1.5 py-0.5 text-xs font-mono text-slate-800 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetNMinus1}
                          onChange={(e) => onUpdateRow(row.id, 'targetNMinus1', e.target.value)}
                          placeholder=""
                          className="w-full text-center px-1 py-0.5 text-xs font-mono text-slate-700 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetN}
                          onChange={(e) => onUpdateRow(row.id, 'targetN', e.target.value)}
                          placeholder=""
                          className="w-full text-center px-1 py-0.5 text-xs font-mono text-slate-700 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-right font-mono bg-amber-50/20">
                        <input
                          type="text"
                          value={row.targetNPlus1}
                          onChange={(e) => onUpdateRow(row.id, 'targetNPlus1', e.target.value)}
                          placeholder=""
                          className="w-full text-right px-1.5 py-0.5 text-xs font-mono text-slate-800 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-2.5 py-1.5 text-slate-700 text-[11px] align-top min-w-[260px] max-w-[400px] relative group hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between gap-1.5">
                          <div
                            onClick={() => handleOpenEditModal(row)}
                            className="flex-1 cursor-pointer"
                            title="ចុចដើម្បីកែសម្រួលមូលហេតុនៃការផ្លាស់ប្តូរ"
                          >
                            {row.reasonChangeNPlus1 ? (
                              expandReasonBullets ? (
                                <FormattedKhmerText
                                  text={row.reasonChangeNPlus1}
                                  mode="table-cell"
                                  dashClassName="text-indigo-600 font-bold"
                                />
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span className="truncate max-w-[220px] text-slate-700">
                                    {row.reasonChangeNPlus1}
                                  </span>
                                  {splitKhmerBullets(row.reasonChangeNPlus1).length > 1 && (
                                    <span className="shrink-0 text-[9px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-sans">
                                      {splitKhmerBullets(row.reasonChangeNPlus1).length} ចំណុច
                                    </span>
                                  )}
                                </div>
                              )
                            ) : (
                              <span className="text-slate-400 italic text-[11px] group-hover:text-indigo-600">
                                + បញ្ចូលមូលហេតុ...
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenEditModal(row)}
                            className="text-slate-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-indigo-50 shrink-0 mt-0.5 cursor-pointer"
                            title="កែសម្រួលមូលហេតុនៃការផ្លាស់ប្តូរ"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetNPlus2}
                          onChange={(e) => onUpdateRow(row.id, 'targetNPlus2', e.target.value)}
                          placeholder=""
                          className="w-full text-center px-1 py-0.5 text-xs font-mono text-slate-700 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-1 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetNPlus3}
                          onChange={(e) => onUpdateRow(row.id, 'targetNPlus3', e.target.value)}
                          placeholder=""
                          className="w-full text-center px-1 py-0.5 text-xs font-mono text-slate-700 bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                }

                // 5. DISAGGREGATION ROW (- ស្រី, - ប្រុស)
                if (row.category === 'DISAGGREGATION') {
                  const isFemale = row.title.includes('ស្រី');
                  return (
                    <tr
                      key={row.id}
                      className={`text-[11px] ${
                        isFemale ? 'bg-pink-50/20 text-pink-900' : 'bg-blue-50/20 text-blue-900'
                      }`}
                    >
                      <td className="border border-slate-300 px-2 py-1 text-center text-slate-400 font-mono text-[10px]">
                        -
                      </td>
                      <td className="border border-slate-300 px-3 py-1 font-medium pl-6">
                        <span className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isFemale ? 'bg-pink-400' : 'bg-blue-400'
                            }`}
                          ></span>
                          <span>{row.title}</span>
                        </span>
                      </td>
                      <td className="border border-slate-300 px-1 py-0.5 text-right font-mono text-slate-400">
                        {row.budgetYearN1 || '-'}
                      </td>
                      <td className="border border-slate-300 px-1 py-0.5 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetNMinus1}
                          onChange={(e) => onUpdateRow(row.id, 'targetNMinus1', e.target.value)}
                          placeholder="-"
                          className="w-full text-center px-1 py-0.5 text-[11px] font-mono bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-0.5 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetN}
                          onChange={(e) => onUpdateRow(row.id, 'targetN', e.target.value)}
                          placeholder="-"
                          className="w-full text-center px-1 py-0.5 text-[11px] font-mono bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-0.5 text-right font-mono bg-amber-50/20">
                        <input
                          type="text"
                          value={row.targetNPlus1}
                          onChange={(e) => onUpdateRow(row.id, 'targetNPlus1', e.target.value)}
                          placeholder="-"
                          className="w-full text-right px-1 py-0.5 text-[11px] font-mono bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-2 py-0.5 text-slate-400 text-[10px] italic">
                        {row.reasonChangeNPlus1 || ''}
                      </td>
                      <td className="border border-slate-300 px-1 py-0.5 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetNPlus2}
                          onChange={(e) => onUpdateRow(row.id, 'targetNPlus2', e.target.value)}
                          placeholder="-"
                          className="w-full text-center px-1 py-0.5 text-[11px] font-mono bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="border border-slate-300 px-1 py-0.5 text-center font-mono">
                        <input
                          type="text"
                          value={row.targetNPlus3}
                          onChange={(e) => onUpdateRow(row.id, 'targetNPlus3', e.target.value)}
                          placeholder="-"
                          className="w-full text-center px-1 py-0.5 text-[11px] font-mono bg-transparent rounded hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                }

                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Edit Reason Modal */}
      {/* Quick Edit Reason Modal */}
      {editingModalRow && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">កែសម្រួលមូលហេតុនៃការផ្លាស់ប្តូរ</h3>
                  <p className="text-[11px] text-slate-300">ទម្លាក់បន្ទាត់ និងតម្រឹមតាមសញ្ញាដក (-)</p>
                </div>
              </div>
              <button
                onClick={() => setEditingModalRow(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-bold">
                    {editingModalRow.code}
                  </span>
                  <span className="text-slate-900 leading-snug">{editingModalRow.title}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  មូលហេតុនៃការផ្លាស់ប្តូរគោលដៅ (ធៀបនឹងគោលដៅឆ្នាំបច្ចុប្បន្ន N: {schoolProfile.yearN})
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-50/60 border border-amber-200/80 rounded-xl p-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const formatted = normalizeKhmerBulletString(editingModalRow.reasonChangeNPlus1);
                      if (formatted) {
                        setEditingModalRow({ ...editingModalRow, reasonChangeNPlus1: formatted });
                        onUpdateRow(editingModalRow.id, 'reasonChangeNPlus1', formatted);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-2xs"
                    title="បំបែកសញ្ញាដក (-) ជាប់គ្នា ឱ្យចុះបន្ទាត់ថ្មីស្វ័យប្រវត្តិ"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>ទម្លាក់បន្ទាត់ស្វ័យប្រវត្តិតាមសញ្ញា (-)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const cur = editingModalRow.reasonChangeNPlus1.trim();
                      const nextVal = cur ? `${cur}\n- ` : '- ';
                      setEditingModalRow({ ...editingModalRow, reasonChangeNPlus1: nextVal });
                      onUpdateRow(editingModalRow.id, 'reasonChangeNPlus1', nextVal);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <ListPlus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>+ បន្ថែមចំណុច (-)</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {splitKhmerBullets(editingModalRow.reasonChangeNPlus1).length} ចំណុច
                </span>
              </div>

              {/* Textarea for Editing */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ខ្លឹមសារ (មួយបន្ទាត់សម្រាប់មួយចំណុច ចាប់ផ្តើមដោយសញ្ញា -)៖
                </label>
                <textarea
                  rows={6}
                  value={editingModalRow.reasonChangeNPlus1}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditingModalRow({ ...editingModalRow, reasonChangeNPlus1: val });
                    onUpdateRow(editingModalRow.id, 'reasonChangeNPlus1', val);
                  }}
                  placeholder="- សាលារៀនមានរៀបចំការប្រជុំ...&#10;- ការប្រជុំមានការចូលរួម...&#10;- មានរបាយការណ៍ពិនិត្យ..."
                  className="w-full text-xs sm:text-[13px] leading-relaxed p-3.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:outline-none font-sans"
                />
              </div>

              {/* Live Preview in Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                  <span>ការបង្ហាញជាក់ស្តែងក្នុងតារាង (Live Table Alignment)៖</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-sans font-medium">
                    ✓ តម្រឹមអក្សរចូលក្រោមសញ្ញា (-)
                  </span>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3 max-h-36 overflow-y-auto">
                  <FormattedKhmerText
                    text={editingModalRow.reasonChangeNPlus1}
                    mode="table-cell"
                    dashClassName="text-indigo-600 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <button
                type="button"
                onClick={() => setEditingModalRow(null)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>រួចរាល់</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
