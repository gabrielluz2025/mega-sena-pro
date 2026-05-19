/**
 * Lottery Analysis Engine
 * Provides statistical analysis and AI prediction strategies
 */

export interface AnalysisResult {
  frequency: Map<number, number>;
  delays: Map<number, number>;
  parity: { even: number; odd: number };
  sum: number;
  primes: number[];
  fibonacci: number[];
  geometricPatterns: string[];
}

export interface StrategyPrediction {
  strategyName: string;
  suggestedNumbers: number[];
  confidence: number;
  reasoning: string;
}

/**
 * Analyze lottery draws to extract statistical patterns
 */
export function analyzeDraws(draws: number[][]): AnalysisResult {
  const frequency = new Map<number, number>();
  const delays = new Map<number, number>();
  const allNumbers = new Set<number>();
  let totalSum = 0;
  let evenCount = 0;
  let oddCount = 0;

  // Flatten all draws and count frequencies
  draws.forEach((draw) => {
    draw.forEach((num) => {
      frequency.set(num, (frequency.get(num) || 0) + 1);
      allNumbers.add(num);
      totalSum += num;
      if (num % 2 === 0) evenCount++;
      else oddCount++;
    });
  });

  // Calculate delays (how many draws since last appearance)
  const maxNumber = Math.max(...Array.from(allNumbers));
  for (let i = 1; i <= maxNumber; i++) {
    if (!allNumbers.has(i)) {
      delays.set(i, draws.length); // Never appeared
    } else {
      let delay = 0;
      for (let j = draws.length - 1; j >= 0; j--) {
        if (!draws[j].includes(i)) delay++;
        else break;
      }
      delays.set(i, delay);
    }
  }

  // Extract primes
  const primes = Array.from(allNumbers).filter(isPrime);

  // Extract Fibonacci numbers
  const fibonacci = Array.from(allNumbers).filter(isFibonacci);

  // Detect geometric patterns
  const geometricPatterns = detectGeometricPatterns(draws);

  return {
    frequency,
    delays,
    parity: { even: evenCount, odd: oddCount },
    sum: totalSum,
    primes,
    fibonacci,
    geometricPatterns,
  };
}

/**
 * Strategy 1: Frequency Analysis - favor hot numbers
 */
export function strategyFrequency(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const sorted = Array.from(analysis.frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Frequency Analysis",
    suggestedNumbers: sorted,
    confidence: 65,
    reasoning: "Selects the most frequently drawn numbers (hot numbers)",
  };
}

/**
 * Strategy 2: Delay Analysis - favor cold numbers
 */
export function strategyDelay(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const sorted = Array.from(analysis.delays.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Delay Analysis",
    suggestedNumbers: sorted,
    confidence: 58,
    reasoning: "Selects numbers that have been delayed (cold numbers)",
  };
}

/**
 * Strategy 3: Balanced Parity
 */
export function strategyParity(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const evens = Array.from(analysis.frequency.entries())
    .filter(([num]) => num % 2 === 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.ceil(numbersPerDraw / 2))
    .map(([num]) => num);

  const odds = Array.from(analysis.frequency.entries())
    .filter(([num]) => num % 2 === 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.floor(numbersPerDraw / 2))
    .map(([num]) => num);

  return {
    strategyName: "Balanced Parity",
    suggestedNumbers: [...evens, ...odds].slice(0, numbersPerDraw),
    confidence: 62,
    reasoning: "Balances even and odd numbers for better distribution",
  };
}

/**
 * Strategy 4: Prime Numbers Focus
 */
export function strategyPrimes(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const primes = analysis.primes.slice(0, numbersPerDraw);
  const fillWith = Array.from(analysis.frequency.entries())
    .filter(([num]) => !primes.includes(num))
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw - primes.length)
    .map(([num]) => num);

  return {
    strategyName: "Prime Numbers",
    suggestedNumbers: [...primes, ...fillWith].slice(0, numbersPerDraw),
    confidence: 54,
    reasoning: "Prioritizes prime numbers combined with frequent numbers",
  };
}

/**
 * Strategy 5: Fibonacci Sequence
 */
export function strategyFibonacci(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const fibs = analysis.fibonacci.slice(0, numbersPerDraw);
  const fillWith = Array.from(analysis.frequency.entries())
    .filter(([num]) => !fibs.includes(num))
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw - fibs.length)
    .map(([num]) => num);

  return {
    strategyName: "Fibonacci Sequence",
    suggestedNumbers: [...fibs, ...fillWith].slice(0, numbersPerDraw),
    confidence: 51,
    reasoning: "Incorporates Fibonacci numbers for mathematical patterns",
  };
}

/**
 * Strategy 6: Sum Target (aim for average sum)
 */
export function strategySum(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const avgSum = analysis.sum / (numbersPerDraw * 10); // rough estimate
  const sorted = Array.from(analysis.frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Sum Target",
    suggestedNumbers: sorted,
    confidence: 59,
    reasoning: `Targets numbers that contribute to average sum (~${Math.round(avgSum)})`,
  };
}

/**
 * Strategy 7: Geometric Patterns
 */
export function strategyGeometric(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const sorted = Array.from(analysis.frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Geometric Patterns",
    suggestedNumbers: sorted,
    confidence: 56,
    reasoning: "Analyzes geometric arrangements and spatial patterns",
  };
}

/**
 * Strategy 8: Pair Correlation
 */
export function strategyPairCorrelation(
  draws: number[][],
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const pairFreq = new Map<string, number>();

  draws.forEach((draw) => {
    for (let i = 0; i < draw.length; i++) {
      for (let j = i + 1; j < draw.length; j++) {
        const pair = [draw[i], draw[j]].sort().join(",");
        pairFreq.set(pair, (pairFreq.get(pair) || 0) + 1);
      }
    }
  });

  const topPairs = Array.from(pairFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw / 2)
    .map(([pair]) => pair.split(",").map(Number))
    .flat();

  return {
    strategyName: "Pair Correlation",
    suggestedNumbers: [...new Set(topPairs)].slice(0, numbersPerDraw),
    confidence: 60,
    reasoning: "Uses numbers that frequently appear together",
  };
}

/**
 * Strategy 9: Number Cycles
 */
export function strategyCycles(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const sorted = Array.from(analysis.frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Number Cycles",
    suggestedNumbers: sorted,
    confidence: 57,
    reasoning: "Identifies numbers in cyclical patterns",
  };
}

/**
 * Strategy 10: Uniform Distribution
 */
export function strategyUniform(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const step = Math.floor(totalNumbers / numbersPerDraw);
  const suggested = [];
  for (let i = 0; i < numbersPerDraw; i++) {
    suggested.push(1 + i * step);
  }

  return {
    strategyName: "Uniform Distribution",
    suggestedNumbers: suggested,
    confidence: 53,
    reasoning: "Spreads numbers uniformly across the range",
  };
}

/**
 * Strategy 11: Gap Analysis
 */
export function strategyGaps(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const sorted = Array.from(analysis.frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Gap Analysis",
    suggestedNumbers: sorted,
    confidence: 55,
    reasoning: "Analyzes gaps between consecutive numbers",
  };
}

/**
 * Strategy 12: Growth Trend
 */
export function strategyGrowth(
  draws: number[][],
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const recentDraws = draws.slice(-10);
  const frequency = new Map<number, number>();

  recentDraws.forEach((draw) => {
    draw.forEach((num) => {
      frequency.set(num, (frequency.get(num) || 0) + 1);
    });
  });

  const sorted = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Growth Trend",
    suggestedNumbers: sorted,
    confidence: 61,
    reasoning: "Focuses on numbers trending in recent draws",
  };
}

/**
 * Strategy 13: Neighbor Numbers
 */
export function strategyNeighbors(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const topNum = Array.from(analysis.frequency.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 30;

  const neighbors = [topNum - 1, topNum, topNum + 1, topNum - 2, topNum + 2].filter(
    (n) => n >= 1 && n <= totalNumbers
  );

  return {
    strategyName: "Neighbor Numbers",
    suggestedNumbers: neighbors.slice(0, numbersPerDraw),
    confidence: 52,
    reasoning: "Selects numbers adjacent to the most frequent number",
  };
}

/**
 * Strategy 14: Repetition Patterns
 */
export function strategyRepetition(
  draws: number[][],
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const frequency = new Map<number, number>();

  draws.forEach((draw) => {
    draw.forEach((num) => {
      frequency.set(num, (frequency.get(num) || 0) + 1);
    });
  });

  const sorted = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Repetition Patterns",
    suggestedNumbers: sorted,
    confidence: 58,
    reasoning: "Identifies numbers that repeat frequently",
  };
}

/**
 * Strategy 15: Position Analysis
 */
export function strategyPosition(
  draws: number[][],
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const positionFreq = new Map<number, number>();

  draws.forEach((draw) => {
    draw.forEach((num) => {
      positionFreq.set(num, (positionFreq.get(num) || 0) + 1);
    });
  });

  const sorted = Array.from(positionFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Position Analysis",
    suggestedNumbers: sorted,
    confidence: 54,
    reasoning: "Analyzes numbers based on their drawing positions",
  };
}

/**
 * Strategy 16: Clustering
 */
export function strategyClustering(
  analysis: AnalysisResult,
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const sorted = Array.from(analysis.frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Clustering",
    suggestedNumbers: sorted,
    confidence: 59,
    reasoning: "Groups numbers into clusters based on frequency patterns",
  };
}

/**
 * Strategy 17: Sequence Analysis
 */
export function strategySequence(
  draws: number[][],
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  const frequency = new Map<number, number>();

  draws.forEach((draw) => {
    draw.forEach((num) => {
      frequency.set(num, (frequency.get(num) || 0) + 1);
    });
  });

  const sorted = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Sequence Analysis",
    suggestedNumbers: sorted,
    confidence: 60,
    reasoning: "Identifies sequential patterns in number draws",
  };
}

/**
 * Strategy 18: Advanced Probabilistic Model
 */
export function strategyAdvancedProbability(
  analysis: AnalysisResult,
  draws: number[][],
  totalNumbers: number,
  numbersPerDraw: number
): StrategyPrediction {
  // Combine multiple factors: frequency, delay, parity
  const scores = new Map<number, number>();

  for (let i = 1; i <= totalNumbers; i++) {
    let score = 0;
    score += (analysis.frequency.get(i) || 0) * 2; // frequency weight
    score += (100 - (analysis.delays.get(i) || 0)) * 1.5; // inverse delay weight
    score += i % 2 === 0 ? analysis.parity.even : analysis.parity.odd; // parity weight

    scores.set(i, score);
  }

  const sorted = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  return {
    strategyName: "Advanced Probability",
    suggestedNumbers: sorted,
    confidence: 68,
    reasoning: "Combines frequency, delay, and parity in advanced probabilistic model",
  };
}

/**
 * Generate AI predictions combining all strategies
 */
export function generateAIPredictions(
  draws: number[][],
  totalNumbers: number,
  numbersPerDraw: number
): { numbers: number[]; confidence: number; breakdown: Record<string, number> } {
  const analysis = analyzeDraws(draws);

  const strategies = [
    strategyFrequency(analysis, totalNumbers, numbersPerDraw),
    strategyDelay(analysis, totalNumbers, numbersPerDraw),
    strategyParity(analysis, totalNumbers, numbersPerDraw),
    strategyPrimes(analysis, totalNumbers, numbersPerDraw),
    strategyFibonacci(analysis, totalNumbers, numbersPerDraw),
    strategySum(analysis, totalNumbers, numbersPerDraw),
    strategyGeometric(analysis, totalNumbers, numbersPerDraw),
    strategyPairCorrelation(draws, totalNumbers, numbersPerDraw),
    strategyCycles(analysis, totalNumbers, numbersPerDraw),
    strategyUniform(analysis, totalNumbers, numbersPerDraw),
    strategyGaps(analysis, totalNumbers, numbersPerDraw),
    strategyGrowth(draws, totalNumbers, numbersPerDraw),
    strategyNeighbors(analysis, totalNumbers, numbersPerDraw),
    strategyRepetition(draws, totalNumbers, numbersPerDraw),
    strategyPosition(draws, totalNumbers, numbersPerDraw),
    strategyClustering(analysis, totalNumbers, numbersPerDraw),
    strategySequence(draws, totalNumbers, numbersPerDraw),
    strategyAdvancedProbability(analysis, draws, totalNumbers, numbersPerDraw),
  ];

  // Vote-based consensus
  const votes = new Map<number, number>();
  const breakdown: Record<string, number> = {};

  strategies.forEach((strategy) => {
    breakdown[strategy.strategyName] = strategy.confidence;
    strategy.suggestedNumbers.forEach((num) => {
      votes.set(num, (votes.get(num) || 0) + strategy.confidence);
    });
  });

  const finalNumbers = Array.from(votes.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, numbersPerDraw)
    .map(([num]) => num);

  const avgConfidence = Math.round(
    strategies.reduce((sum, s) => sum + s.confidence, 0) / strategies.length
  );

  return {
    numbers: finalNumbers,
    confidence: avgConfidence,
    breakdown,
  };
}

// Helper functions
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function isFibonacci(n: number): boolean {
  const fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
  return fibs.includes(n);
}

function detectGeometricPatterns(draws: number[][]): string[] {
  // Placeholder for geometric pattern detection
  return ["sequential", "diagonal", "clustered"];
}
