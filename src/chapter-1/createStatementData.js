class PerformanceCalculator {
  constructor(performance, play) {
    this.performance = performance;
    this.play = play;
  }

  static for(performance, play) {
    switch (play.type) {
      case 'tragedy':
        return new TragedyCalculator(performance, play);
      case 'comedy':
        return new ComedyCalculator(performance, play);
    }
    return new PerformanceCalculator(performance, play);
  }

  get audience() {
    return this.performance.audience;
  }

  get amount() {
    throw new Error('subclass responsibility');
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

export function createStatementData(invoice, plays) {
  let result = {};
  result.performances = invoice.performances.map(enrichPerformance);
  result.customer = invoice.customer;
  result.totalAmount = totalAmount(result);
  result.volumeCredits = totalVolumeCredits(result);
  return result;

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function playFor(perf) {
    return plays[perf.playID];
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function enrichPerformance(performance) {
    return PerformanceCalculator.for({...performance}, playFor(performance));
  }
}
