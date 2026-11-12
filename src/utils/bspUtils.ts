import { IndicatorRow, ActivityBudgetRow } from '../data/bspData';

export function parseNumber(val: string | number | undefined | null): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[^\d.-]/g, '');
  if (!cleaned) return 0;
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function formatRiel(val: string | number | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'number' ? val : parseNumber(val);
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}

export interface Table1Summaries {
  grandTotalBudgetN1: number;
  grandTotalTargetN1: number;
  standardTotals: Record<
    number,
    {
      budgetN1: number;
      targetN1Budget: number;
    }
  >;
}

export function computeTable1Summaries(rows: IndicatorRow[]): Table1Summaries {
  const standardTotals: Record<number, { budgetN1: number; targetN1Budget: number }> = {};

  for (let s = 1; s <= 5; s++) {
    standardTotals[s] = { budgetN1: 0, targetN1Budget: 0 };
  }

  const grandTotalRow = rows.find((r) => r.category === 'GRAND_TOTAL');

  for (let s = 1; s <= 5; s++) {
    const headerRow = rows.find((r) => r.standardId === s && r.category === 'STANDARD_HEADER');
    let bN1 = headerRow ? parseNumber(headerRow.budgetYearN1) : 0;
    let tN1 = headerRow ? parseNumber(headerRow.targetNPlus1) : 0;

    // If header has 0, check sum of key indicators
    if (bN1 === 0 || tN1 === 0) {
      const keyRows = rows.filter((r) => r.standardId === s && r.category === 'KEY_INDICATOR');
      if (bN1 === 0) {
        const sumBN1 = keyRows.reduce((acc, r) => acc + parseNumber(r.budgetYearN1), 0);
        if (sumBN1 > 0) bN1 = sumBN1;
      }
      if (tN1 === 0) {
        const sumTN1 = keyRows.reduce((acc, r) => acc + parseNumber(r.targetNPlus1), 0);
        if (sumTN1 > 0) tN1 = sumTN1;
      }
    }

    standardTotals[s] = {
      budgetN1: bN1,
      targetN1Budget: tN1,
    };
  }

  let grandTotalBudgetN1 = grandTotalRow ? parseNumber(grandTotalRow.budgetYearN1) : 0;
  if (grandTotalBudgetN1 === 0) {
    grandTotalBudgetN1 = Object.values(standardTotals).reduce((acc, curr) => acc + curr.budgetN1, 0);
  }

  let grandTotalTargetN1 = grandTotalRow ? parseNumber(grandTotalRow.targetNPlus1) : 0;
  if (grandTotalTargetN1 === 0) {
    grandTotalTargetN1 = Object.values(standardTotals).reduce((acc, curr) => acc + curr.targetN1Budget, 0);
  }

  return {
    grandTotalBudgetN1,
    grandTotalTargetN1,
    standardTotals,
  };
}

export interface YearBudgetSummary {
  state: number;
  partner: number;
  community: number;
  other: number;
  total: number;
}

export interface Table2Summaries {
  grandTotal: {
    yearN: YearBudgetSummary;
    yearN1: YearBudgetSummary;
    yearN2: YearBudgetSummary;
    yearN3: YearBudgetSummary;
  };
  standardTotals: Record<
    number,
    {
      yearN: YearBudgetSummary;
      yearN1: YearBudgetSummary;
      yearN2: YearBudgetSummary;
      yearN3: YearBudgetSummary;
    }
  >;
}

export function computeTable2Summaries(rows: ActivityBudgetRow[]): Table2Summaries {
  const years = ['yearN', 'yearN1', 'yearN2', 'yearN3'] as const;
  const standardTotals: Table2Summaries['standardTotals'] = {};

  for (let s = 1; s <= 5; s++) {
    standardTotals[s] = {
      yearN: { state: 0, partner: 0, community: 0, other: 0, total: 0 },
      yearN1: { state: 0, partner: 0, community: 0, other: 0, total: 0 },
      yearN2: { state: 0, partner: 0, community: 0, other: 0, total: 0 },
      yearN3: { state: 0, partner: 0, community: 0, other: 0, total: 0 },
    };

    const stdActivities = rows.filter((r) => r.standardId === s && r.category === 'ACTIVITY');
    const stdHeader = rows.find((r) => r.standardId === s && r.category === 'STANDARD_HEADER');

    years.forEach((yr) => {
      let state = 0;
      let partner = 0;
      let community = 0;
      let other = 0;

      if (stdActivities.length > 0) {
        stdActivities.forEach((act) => {
          state += parseNumber(act[yr]?.state);
          partner += parseNumber(act[yr]?.partner);
          community += parseNumber(act[yr]?.community);
          other += parseNumber(act[yr]?.other);
        });
      }

      // Fallback to standard header if activities are all zero
      if (state === 0 && partner === 0 && community === 0 && other === 0 && stdHeader) {
        state = parseNumber(stdHeader[yr]?.state);
        partner = parseNumber(stdHeader[yr]?.partner);
        community = parseNumber(stdHeader[yr]?.community);
        other = parseNumber(stdHeader[yr]?.other);
      }

      const total = state + partner + community + other;
      standardTotals[s][yr] = { state, partner, community, other, total };
    });
  }

  const grandTotal = {
    yearN: { state: 0, partner: 0, community: 0, other: 0, total: 0 },
    yearN1: { state: 0, partner: 0, community: 0, other: 0, total: 0 },
    yearN2: { state: 0, partner: 0, community: 0, other: 0, total: 0 },
    yearN3: { state: 0, partner: 0, community: 0, other: 0, total: 0 },
  };

  const grandTotalRow = rows.find((r) => r.category === 'GRAND_TOTAL');

  years.forEach((yr) => {
    let state = 0;
    let partner = 0;
    let community = 0;
    let other = 0;

    for (let s = 1; s <= 5; s++) {
      state += standardTotals[s][yr].state;
      partner += standardTotals[s][yr].partner;
      community += standardTotals[s][yr].community;
      other += standardTotals[s][yr].other;
    }

    if (state === 0 && partner === 0 && community === 0 && other === 0 && grandTotalRow) {
      state = parseNumber(grandTotalRow[yr]?.state);
      partner = parseNumber(grandTotalRow[yr]?.partner);
      community = parseNumber(grandTotalRow[yr]?.community);
      other = parseNumber(grandTotalRow[yr]?.other);
    }

    const total = state + partner + community + other;
    grandTotal[yr] = { state, partner, community, other, total };
  });

  return {
    grandTotal,
    standardTotals,
  };
}

export function syncTable1ToTable2(
  t1: IndicatorRow[],
  t2: ActivityBudgetRow[]
): ActivityBudgetRow[] {
  const t1GrandTotal = t1.find((r) => r.category === 'GRAND_TOTAL');
  const t1StdHeaders = new Map<number, IndicatorRow>();
  t1.forEach((r) => {
    if (r.category === 'STANDARD_HEADER') {
      t1StdHeaders.set(r.standardId, r);
    }
  });

  return t2.map((row) => {
    if (row.category === 'GRAND_TOTAL' && t1GrandTotal) {
      return {
        ...row,
        yearN1: {
          ...row.yearN1,
          state: t1GrandTotal.budgetYearN1 || row.yearN1.state,
        },
      };
    }

    if (row.category === 'STANDARD_HEADER') {
      const match = t1StdHeaders.get(row.standardId);
      if (match) {
        return {
          ...row,
          yearN1: {
            ...row.yearN1,
            state: match.budgetYearN1 || row.yearN1.state,
          },
        };
      }
    }

    return row;
  });
}

export function syncTable2ToTable1(
  t2: ActivityBudgetRow[],
  t1: IndicatorRow[]
): IndicatorRow[] {
  const t2GrandTotal = t2.find((r) => r.category === 'GRAND_TOTAL');
  const t2StdHeaders = new Map<number, ActivityBudgetRow>();
  t2.forEach((r) => {
    if (r.category === 'STANDARD_HEADER') {
      t2StdHeaders.set(r.standardId, r);
    }
  });

  return t1.map((row) => {
    if (row.category === 'GRAND_TOTAL' && t2GrandTotal) {
      return {
        ...row,
        budgetYearN1: t2GrandTotal.yearN1?.state || row.budgetYearN1,
      };
    }

    if (row.category === 'STANDARD_HEADER') {
      const match = t2StdHeaders.get(row.standardId);
      if (match) {
        return {
          ...row,
          budgetYearN1: match.yearN1?.state || row.budgetYearN1,
        };
      }
    }

    return row;
  });
}

export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][]
): void {
  const processCell = (val: string | number) => {
    let str = String(val ?? '');
    str = str.replace(/"/g, '""');
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str}"`;
    }
    return str;
  };

  const csvContent =
    '\uFEFF' +
    [
      headers.map(processCell).join(','),
      ...rows.map((row) => row.map(processCell).join(',')),
    ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
