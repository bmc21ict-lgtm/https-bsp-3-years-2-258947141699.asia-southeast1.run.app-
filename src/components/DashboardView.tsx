import React, { useState } from 'react';
import {
  IndicatorRow,
  ActivityBudgetRow,
  STANDARDS_META,
  SchoolProfile,
} from '../data/bspData';
import {
  computeTable1Summaries,
  computeTable2Summaries,
  formatRiel,
  parseNumber,
} from '../utils/bspUtils';
import {
  GraduationCap,
  BookOpen,
  Users,
  Building2,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  PieChart,
  CheckCircle,
  Award,
  ArrowUpRight,
  FileSpreadsheet,
} from 'lucide-react';

interface DashboardViewProps {
  table1Rows: IndicatorRow[];
  table2Rows: ActivityBudgetRow[];
  schoolProfile: SchoolProfile;
  onNavigateToTable1: () => void;
  onNavigateToTable2: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  table1Rows,
  table2Rows,
  schoolProfile,
  onNavigateToTable1,
  onNavigateToTable2,
}) => {
  const t1Summaries = computeTable1Summaries(table1Rows);
  const t2Summaries = computeTable2Summaries(table2Rows);

  const iconsMap: Record<string, React.ReactNode> = {
    GraduationCap: <GraduationCap className="w-5 h-5 text-emerald-600" />,
    BookOpen: <BookOpen className="w-5 h-5 text-indigo-600" />,
    Users: <Users className="w-5 h-5 text-amber-600" />,
    Building2: <Building2 className="w-5 h-5 text-blue-600" />,
    ShieldCheck: <ShieldCheck className="w-5 h-5 text-rose-600" />,
  };

  // Find key milestone indicators from Table 1
  const enrollmentIndicator = table1Rows.find((r) => r.code === '១.១');
  const dropoutIndicator = table1Rows.find((r) => r.code === '២.១');
  const khmerGradeIndicator = table1Rows.find((r) => r.code === '៣.១');
  const mathGradeIndicator = table1Rows.find((r) => r.code === '៣.២');
  const readingG3Indicator = table1Rows.find((r) => r.code === '៣.៣');
  const readingG6Indicator = table1Rows.find((r) => r.code === '៣.៤');

  const [selectedFundingYear, setSelectedFundingYear] = useState<'yearN' | 'yearN1'>('yearN');
  const [hoveredSource, setHoveredSource] = useState<string | null>(null);

  const currentFunding = t2Summaries.grandTotal[selectedFundingYear] || {
    state: 0,
    partner: 0,
    community: 0,
    other: 0,
    total: 0,
  };

  const rawTotal =
    (currentFunding.state || 0) +
    (currentFunding.partner || 0) +
    (currentFunding.community || 0) +
    (currentFunding.other || 0);
  const totalFunding = rawTotal > 0 ? rawTotal : 1;

  const fundingSources = [
    {
      id: 'state',
      name: 'ថវិការដ្ឋ (State / SIG / PB)',
      shortName: 'រដ្ឋ',
      amount: currentFunding.state || 0,
      color: '#2563eb',
      colorClass: 'text-blue-600',
      bgClass: 'bg-blue-600',
      borderClass: 'border-blue-200',
      lightBg: 'bg-blue-50/70',
    },
    {
      id: 'partner',
      name: 'ដៃគូអភិវឌ្ឍន៍ (Partners / NGOs)',
      shortName: 'ដៃគូ',
      amount: currentFunding.partner || 0,
      color: '#7c3aed',
      colorClass: 'text-violet-600',
      bgClass: 'bg-violet-600',
      borderClass: 'border-violet-200',
      lightBg: 'bg-violet-50/70',
    },
    {
      id: 'community',
      name: 'សហគមន៍ / មូលនិធិឃុំ (CIP)',
      shortName: 'សហគមន៍',
      amount: currentFunding.community || 0,
      color: '#f59e0b',
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-500',
      borderClass: 'border-amber-200',
      lightBg: 'bg-amber-50/70',
    },
    {
      id: 'other',
      name: 'ប្រភពផ្សេងៗ (Other)',
      shortName: 'ផ្សេងៗ',
      amount: currentFunding.other || 0,
      color: '#10b981',
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-500',
      borderClass: 'border-emerald-200',
      lightBg: 'bg-emerald-50/70',
    },
  ];

  const radius = 40;
  const circumference = 2 * Math.PI * radius; // 251.327
  let cumulativePercent = 0;

  const slices = fundingSources.map((source) => {
    const percent = rawTotal > 0 ? source.amount / totalFunding : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -cumulativePercent * circumference;
    cumulativePercent += percent;
    return {
      ...source,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-sky-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Award className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-800/80 text-amber-300 text-xs px-3 py-1 rounded-full font-medium mb-3 border border-indigo-700">
            <Award className="w-3.5 h-3.5" />
            <span>ក្របខ័ណ្ឌស្តង់ដាសាលារៀនគំរូទាំង ៥ របស់ MoEYS</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-moul tracking-wide text-amber-200">
            {schoolProfile.schoolName}
          </h2>
          <p className="text-sm text-slate-200 mt-2 leading-relaxed">
            ផ្ទាំងទិដ្ឋភាពទូទៅនៃផែនការយុទ្ធសាស្ត្រថវិកា ៣ ឆ្នាំ (BSP 3-Years) សម្រាប់ឆ្នាំ {schoolProfile.yearN1} ដល់ {schoolProfile.yearN3}។ គ្រប់គ្រងសូចនាករគន្លឹះ ចំណាយថវិកា និងប្រភពហិរញ្ញប្បទានដោយតម្លាភាព និងប្រសិទ្ធភាព។
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={onNavigateToTable1}
              className="flex items-center gap-2 bg-white text-indigo-950 hover:bg-slate-100 text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
              <span>ពិនិត្យសូចនាករ (តារាងទី១)</span>
            </button>
            <button
              onClick={onNavigateToTable2}
              className="flex items-center gap-2 bg-indigo-800/80 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-indigo-600 transition-colors cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-amber-300" />
              <span>ពិនិត្យប្រភពថវិកា (តារាងទី២)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">ថវិកាគ្រោងសរុប (N+1: {schoolProfile.yearN1})</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-indigo-950">
            {formatRiel(t1Summaries.grandTotalBudgetN1)} <span className="text-xs font-normal text-slate-500">រៀល</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>បែងចែកលើ ៥ ស្តង់ដាសាលារៀន</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">គោលដៅថវិកា (N+1 Target)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-950">
            {formatRiel(t1Summaries.grandTotalTargetN1)} <span className="text-xs font-normal text-slate-500">រៀល</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-2">
            <span>ឯកតារៀលគត់</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">សូចនាករសរុប</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            96 <span className="text-xs font-normal text-slate-500">សូចនាករ</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-2">
            ២៦ គន្លឹះ + ៧០ រង (+២០ បំបែកភេទ)
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">សកម្មភាពគម្រោង (តារាងទី២)</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-sky-950">
            {table2Rows.filter((r) => r.category === 'ACTIVITY').length} <span className="text-xs font-normal text-slate-500">សកម្មភាព</span>
          </div>
          <div className="text-[11px] text-sky-700 font-medium mt-2">
            ៤ ប្រភពហិរញ្ញប្បទាន
          </div>
        </div>
      </div>

      {/* Visual Budget Distribution Pie Chart Section */}
      <div className="bg-white p-5 lg:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                ការបែងចែកប្រភពថវិកា (Budget Distribution by Funding Source)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 pl-10">
              ការវិភាគចំណែកនៃថវិការដ្ឋ (SIG/PB) ដៃគូអភិវឌ្ឍន៍ សហគមន៍/មូលនិធិឃុំ (CIP) និងប្រភពផ្សេងៗ ក្នុងតារាងទី២
            </p>
          </div>

          {/* Year Switcher Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setSelectedFundingYear('yearN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFundingYear === 'yearN'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ឆ្នាំបច្ចុប្បន្ន N ({schoolProfile.yearN})
            </button>
            <button
              onClick={() => setSelectedFundingYear('yearN1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFundingYear === 'yearN1'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ឆ្នាំគ្រោង N+1 ({schoolProfile.yearN1})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Donut / Pie Chart Visual (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-2">
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="14"
                />
                {/* Dynamic Slices */}
                {slices.map((slice) => {
                  if (slice.amount <= 0) return null;
                  const isHovered = hoveredSource === slice.id;
                  return (
                    <circle
                      key={slice.id}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={slice.color}
                      strokeWidth={isHovered ? 18 : 14}
                      strokeDasharray={slice.strokeDasharray}
                      strokeDashoffset={slice.strokeDashoffset}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredSource(slice.id)}
                      onMouseLeave={() => setHoveredSource(null)}
                    />
                  );
                })}
              </svg>

              {/* Center Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                <span className="text-[11px] text-slate-500 font-semibold truncate max-w-[130px]">
                  {hoveredSource
                    ? slices.find((s) => s.id === hoveredSource)?.shortName
                    : 'ថវិកាសរុប'}
                </span>
                <span className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {formatRiel(
                    hoveredSource
                      ? slices.find((s) => s.id === hoveredSource)?.amount || 0
                      : rawTotal
                  )}
                </span>
                <span className="text-[10px] text-slate-400">
                  {hoveredSource
                    ? `${slices.find((s) => s.id === hoveredSource)?.percent}% នៃសរុប`
                    : 'រៀល'}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2 italic">
              ដាក់ Cursor លើចំណែក Pie ដើម្បីមើលទំហំថវិកា និងភាគរយ
            </p>
          </div>

          {/* Funding Sources Breakdown List (7 cols) */}
          <div className="md:col-span-7 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slices.map((source) => {
                const isHovered = hoveredSource === source.id;
                return (
                  <div
                    key={source.id}
                    onMouseEnter={() => setHoveredSource(source.id)}
                    onMouseLeave={() => setHoveredSource(null)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isHovered
                        ? 'border-indigo-400 shadow-sm bg-white ring-2 ring-indigo-100'
                        : `${source.lightBg} border-slate-200/70 hover:border-slate-300 bg-white`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: source.color }}
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          {source.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                        {source.percent}%
                      </span>
                    </div>

                    <div className="text-sm font-bold font-mono text-slate-900 pl-5">
                      {formatRiel(source.amount)} <span className="text-[11px] font-normal text-slate-500">រៀល</span>
                    </div>

                    {/* Mini progress bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${source.percent}%`,
                          backgroundColor: source.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                ថវិកាគម្រោងសរុបប្រចាំឆ្នាំ {selectedFundingYear === 'yearN' ? schoolProfile.yearN : schoolProfile.yearN1}៖ <strong className="font-mono text-slate-900">{formatRiel(rawTotal)} រៀល</strong>
              </span>
              <button
                onClick={onNavigateToTable2}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline"
              >
                <span>មើលតារាងទី២ លម្អិត</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Standards Budget Distribution & Key Target Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2 Cols: Standards Budget Allocation Progress */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                ការបែងចែកថវិកាគ្រោងតាមស្តង់ដា (Budget by Standard - N+1)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ភាគរយ និងទំហំថវិកាសម្រាប់ស្តង់ដានីមួយៗនៃឆ្នាំ {schoolProfile.yearN1}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              សរុប: {formatRiel(t1Summaries.grandTotalBudgetN1)} រៀល
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {STANDARDS_META.map((std) => {
              const budget = t1Summaries.standardTotals[std.id]?.budgetN1 || 0;
              const total = t1Summaries.grandTotalBudgetN1 || 1;
              const percent = Math.round((budget / total) * 100);

              return (
                <div key={std.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-100">
                        {iconsMap[std.iconName]}
                      </div>
                      <span className="font-semibold text-slate-800">{std.title}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900">{formatRiel(budget)} រៀល</span>
                      <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {percent}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        std.id === 1
                          ? 'bg-emerald-500'
                          : std.id === 2
                          ? 'bg-indigo-500'
                          : std.id === 3
                          ? 'bg-amber-500'
                          : std.id === 4
                          ? 'bg-blue-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 pl-8">
                    {std.indicatorsSummary}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1 Col: Key Learning & School Targets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">
              សូចនាករគន្លឹះសំខាន់ៗ (Key Targets)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ការប្រៀបធៀបគោលដៅឆ្នាំបច្ចុប្បន្ន ធៀបនឹង ឆ្នាំគ្រោង N+1
            </p>
          </div>

          <div className="space-y-3">
            {/* Enrollment */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="text-[11px] text-slate-500 font-medium">
                ១.១ ភាគរយកុមារថ្នាក់ទី១ ចូលរៀនតាមអាយុ
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-600">
                  ឆ្នាំ N: <strong className="font-mono text-slate-800">{enrollmentIndicator?.targetN || '100%'}</strong>
                </span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                  គោលដៅ N+1: <strong className="font-mono">{enrollmentIndicator?.targetNPlus1 || '100%'}</strong>
                </span>
              </div>
            </div>

            {/* Dropout */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="text-[11px] text-slate-500 font-medium">
                ២.១ អត្រាបោះបង់ការសិក្សាបានថយចុះ
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-600">
                  ឆ្នាំ N: <strong className="font-mono text-slate-800">{dropoutIndicator?.targetN || '3%'}</strong>
                </span>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded">
                  គោលដៅ N+1: <strong className="font-mono">{dropoutIndicator?.targetNPlus1 || '2%'}</strong>
                </span>
              </div>
            </div>

            {/* Reading G3 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="text-[11px] text-slate-500 font-medium">
                ៣.៣ សមត្ថភាពអានថ្នាក់ទី៣ តាមស្តង់ដា
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-600">
                  ឆ្នាំ N: <strong className="font-mono text-slate-800">{readingG3Indicator?.targetN || '47.5%'}</strong>
                </span>
                <span className="text-xs text-indigo-700 font-semibold bg-indigo-100/70 px-2 py-0.5 rounded">
                  គោលដៅ N+1: <strong className="font-mono">{readingG3Indicator?.targetNPlus1 || '50%'}</strong>
                </span>
              </div>
            </div>

            {/* Reading G6 */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="text-[11px] text-slate-500 font-medium">
                ៣.៤ សមត្ថភាពអានថ្នាក់ទី៦ តាមស្តង់ដា
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-600">
                  ឆ្នាំ N: <strong className="font-mono text-slate-800">{readingG6Indicator?.targetN || '55%'}</strong>
                </span>
                <span className="text-xs text-indigo-700 font-semibold bg-indigo-100/70 px-2 py-0.5 rounded">
                  គោលដៅ N+1: <strong className="font-mono">{readingG6Indicator?.targetNPlus1 || '60%'}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standards Summary Cards */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          ទិដ្ឋភាពទូទៅនៃស្តង់ដាទាំង ៥ (Overview of 5 Standards)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STANDARDS_META.map((std) => {
            const budgetN1 = t1Summaries.standardTotals[std.id]?.budgetN1 || 0;
            const targetN1 = t1Summaries.standardTotals[std.id]?.targetN1Budget || 0;

            return (
              <div
                key={std.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${std.badgeBg}`}>
                      ស្តង់ដាទី {std.id}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-50">
                      {iconsMap[std.iconName]}
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">
                    {std.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {std.indicatorsSummary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">ថវិកាគ្រោង (N+1)</div>
                    <div className="text-xs font-bold font-mono text-slate-900">
                      {formatRiel(budgetN1)} រៀល
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">គោលដៅថវិកា (N+1)</div>
                    <div className="text-xs font-bold font-mono text-emerald-700">
                      {formatRiel(targetN1)} រៀល
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
