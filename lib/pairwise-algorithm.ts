export interface Parameter {
  name: string;
  values: string[];
}

function pairKey(pi: number, vi: number, pj: number, vj: number): string {
  return `${pi},${vi},${pj},${vj}`;
}

export function generatePairwise(parameters: Parameter[]): string[][] {
  const n = parameters.length;
  if (n === 0) return [];
  if (n === 1) return parameters[0].values.map(v => [v]);

  const uncovered = new Set<string>();
  for (let pi = 0; pi < n; pi++) {
    for (let pj = pi + 1; pj < n; pj++) {
      for (let vi = 0; vi < parameters[pi].values.length; vi++) {
        for (let vj = 0; vj < parameters[pj].values.length; vj++) {
          uncovered.add(pairKey(pi, vi, pj, vj));
        }
      }
    }
  }

  const testCases: number[][] = [];

  while (uncovered.size > 0) {
    const tc: (number | null)[] = new Array(n).fill(null);

    const firstKey = uncovered.values().next().value!;
    const [pi, vi, pj, vj] = firstKey.split(',').map(Number);
    tc[pi] = vi;
    tc[pj] = vj;

    for (let p = 0; p < n; p++) {
      if (tc[p] !== null) continue;
      let bestVal = 0;
      let bestScore = -1;
      for (let v = 0; v < parameters[p].values.length; v++) {
        let score = 0;
        for (let q = 0; q < n; q++) {
          if (q === p || tc[q] === null) continue;
          const vq = tc[q] as number;
          const key = p < q ? pairKey(p, v, q, vq) : pairKey(q, vq, p, v);
          if (uncovered.has(key)) score++;
        }
        if (score > bestScore) {
          bestScore = score;
          bestVal = v;
        }
      }
      tc[p] = bestVal;
    }

    for (let pi2 = 0; pi2 < n; pi2++) {
      for (let pj2 = pi2 + 1; pj2 < n; pj2++) {
        uncovered.delete(pairKey(pi2, tc[pi2] as number, pj2, tc[pj2] as number));
      }
    }

    testCases.push(tc as number[]);
  }

  return testCases.map(tc =>
    tc.map((vi, pi) => parameters[pi].values[vi])
  );
}

export function countTotalPairs(parameters: Parameter[]): number {
  let count = 0;
  for (let i = 0; i < parameters.length; i++) {
    for (let j = i + 1; j < parameters.length; j++) {
      count += parameters[i].values.length * parameters[j].values.length;
    }
  }
  return count;
}
